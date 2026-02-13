<?php
namespace App\Event;

use App\Entity\Invoice;
use Symfony\Contracts\EventDispatcher\Event;

final class InvoiceCreatedEvent extends Event
{
    public const string NAME = 'invoice.created';

    public function __construct(
        public Invoice $invoice
    ) {}

    public function getPayload(): array
    {
        return [
            'status' => 'created',
            'id' => $this->invoice->id,
            'amount' => $this->invoice->amount,
            'display' => $this->invoice->formattedAmount,
            'timestamp' => time(),
        ];
    }
}
