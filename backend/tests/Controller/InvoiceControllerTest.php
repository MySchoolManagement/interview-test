<?php
namespace App\Tests\Controller;

use App\Controller\FinanceController;
use App\Entity\Invoice;
use App\Event\InvoiceCreatedEvent;
use Doctrine\ORM\EntityManagerInterface;
use PHPUnit\Framework\TestCase;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Contracts\EventDispatcher\EventDispatcherInterface;

class InvoiceControllerTest extends TestCase
{
    public function testCreateInvoiceDispatchesEvent(): void
    {
        // 1. Mock Dependencies
        $em = $this->createMock(EntityManagerInterface::class);
        $dispatcher = $this->createMock(EventDispatcherInterface::class);

        // 2. Set Expectations
        $em->expects($this->once())->method('persist');
        $em->expects($this->once())->method('flush');

        // The core requirement: Verify the event is dispatched with the correct name and type
        $dispatcher->expects($this->once())
            ->method('dispatch')
            ->with(
                $this->isInstanceOf(InvoiceCreatedEvent::class), 
                InvoiceCreatedEvent::NAME
            );

        // 3. Execute
        $controller = new FinanceController();
        $request = new Request([], [], [], [], [], [], json_encode(['amount' => 150.00]));
        
        $response = $controller->createInvoice($request, $em, $dispatcher);

        // 4. Assert Response
        $this->assertEquals(201, $response->getStatusCode());
    }
}
