<?php

namespace App\EventListener;

use App\Event\InvoiceCreatedEvent;
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;
use Symfony\Component\Mercure\HubInterface;
use Symfony\Component\Mercure\Update;

#[AsEventListener]
final readonly class InvoiceNotificationListener
{
    public function __construct(
        private HubInterface $hub
    )
    {
    }

    public function __invoke(InvoiceCreatedEvent $event): void
    {
        $topic = 'https://api.yourapp.com/invoices';

        $update = new Update(
            topics: $topic,
            data: json_encode($event->getPayload(), JSON_THROW_ON_ERROR)
        );

        $this->hub->publish($update);
    }
}
