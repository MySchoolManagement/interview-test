<?php
namespace App\Repository;

use App\Entity\Invoice;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Invoice>
 */
class InvoiceRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Invoice::class);
    }

    public function getTotalInvoicedAmount(): float
    {
        return (float) $this->createQueryBuilder('i')
            ->select('SUM(i.amount)')
            ->getQuery()
            ->getSingleScalarResult() ?? 0.0;
    }

    /**
     * Returns an array of arrays:
     * [
     * 'id' => 1,
     * 'reference' => 'INV-001',
     * 'amount' => 100.00,
     * 'paid' => 40.00
     * ]
     */
    public function findAllWithBalance(int $limit = 50): array
    {
        return $this->createQueryBuilder('i')
            ->select('i.id, i.reference, i.amount')
            // Subquery to sum payments for this specific invoice
            ->addSelect('(SELECT COALESCE(SUM(p.amount), 0) FROM App\Entity\Payment p WHERE p.invoice = i) as paid')
            ->orderBy('i.id', 'DESC')
            ->setMaxResults($limit)
            ->getQuery()
            ->getArrayResult(); // Return plain array, lighter than Entities
    }
}
