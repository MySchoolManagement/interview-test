<?php
namespace App\Controller;

use Symfony\Component\Validator\Constraints as Assert;

readonly class PaymentDTO
{
    public function __construct(
        #[Assert\NotBlank]
        #[Assert\Positive]
        public float $amount,

        #[Assert\NotBlank]
        public int $invoice_id
    ) {}
}
