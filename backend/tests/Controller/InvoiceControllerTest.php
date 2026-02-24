<?php
namespace App\Tests\Controller;

use App\Controller\FinanceController;
use App\Controller\InvoiceDTO;
use App\Entity\Invoice;
use App\Event\InvoiceCreatedEvent;
use Doctrine\ORM\EntityManagerInterface;
use PHPUnit\Framework\TestCase;
use Psr\Container\ContainerInterface;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Component\DependencyInjection\Container;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Contracts\EventDispatcher\EventDispatcherInterface;

class InvoiceControllerTest extends KernelTestCase
{
    public function testCreateInvoiceDispatchesEvent(): void
    {
        self::bootKernel();
        $container = static::getContainer();

        $controller = new FinanceController(
            $container->get(EntityManagerInterface::class),
            $container->get(EventDispatcherInterface::class)
        );

        $controller->setContainer($container);

        $request = new InvoiceDTO(150.00, 'TEST');

        $response = $controller->createInvoice($request);

        $this->assertEquals(201, $response->getStatusCode());
    }
}
