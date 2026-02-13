<?php

namespace App\Controller;

use App\Entity\Invoice;
use App\Entity\Payment;
use App\Event\InvoiceCreatedEvent;
use App\Repository\InvoiceRepository;
use App\Repository\PaymentRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Contracts\EventDispatcher\EventDispatcherInterface;

#[Route('/api')]
class FinanceController extends AbstractController
{
    public function __construct(
        private readonly EntityManagerInterface   $em,
        private readonly EventDispatcherInterface $dispatcher
    )
    {
    }

    #[Route('/invoices', methods: ['GET'])]
    public function listInvoices(InvoiceRepository $repository): JsonResponse
    {
        $rawRows = $repository->findAllWithBalance(50);

        // Map the results to add the 'balance' field
        $invoices = array_map(function ($row) {
            $amount = (float) $row['amount'];
            $paid = (float) $row['paid'];

            return [
                'id' => $row['id'],
                'reference' => $row['reference'],
                'amount' => $amount,
                'paid' => $paid,
                'balance' => $amount - $paid,
                // Helpful status for the frontend UI
                'status' => ($amount - $paid) <= 0 ? 'paid' : 'pending'
            ];
        }, $rawRows);

        return $this->json($invoices);
    }

    #[Route('/invoices', methods: ['POST'])]
    public function createInvoice(
        #[MapRequestPayload] InvoiceDTO $dto
    ): JsonResponse
    {
        $invoice = new Invoice();
        $invoice->amount = $dto->amount;
        $invoice->reference = $dto->reference ?? uniqid('INV-', true);

        $this->em->persist($invoice);
        $this->em->flush();

        $this->dispatcher->dispatch(new InvoiceCreatedEvent($invoice));

        return $this->json($invoice, 201);
    }

    #[Route('/balance/{id?}', methods: ['GET'])]
    public function getBalance(
        ?int              $id,
        InvoiceRepository $invRepo,
        PaymentRepository $payRepo
    ): JsonResponse
    {
        if ($id) {
            $invoice = $invRepo->find($id);

            if (!$invoice) {
                return $this->json(['error' => 'Invoice not found'], 404);
            }

            $paid = $payRepo->getPaidAmountForInvoice($id);

            $balance = $invoice->amount - $paid;

            return $this->json([
                'invoice_id' => $id,
                'total_amount' => $invoice->amount,
                'total_paid' => $paid,
                'balance' => $balance,
                'status' => $balance <= 0 ? 'paid' : 'pending'
            ]);
        }

        $totalInvoiced = $invRepo->getTotalInvoicedAmount();
        $totalPaid = $payRepo->getTotalPaidAmount();

        return $this->json([
            'balance' => $totalInvoiced - $totalPaid
        ]);
    }

    #[Route('/payments', methods: ['POST'])]
    public function createPayment(
        #[MapRequestPayload] PaymentDTO $dto,
        InvoiceRepository $invRepo
    ): JsonResponse
    {
        $invoice = $invRepo->find($dto->invoice_id);

        if (!$invoice) {
            return $this->json(['error' => 'Invoice not found'], 404);
        }

        $payment = new Payment();
        $payment->amount = $dto->amount;
        $payment->invoice = $invoice;

        $this->em->persist($payment);
        $this->em->flush();

        return $this->json([
            'id' => $payment->id,
            'amount' => $payment->amount,
            'invoice_id' => $invoice->id,
            'timestamp' => date('c')
        ], 201);
    }
}
