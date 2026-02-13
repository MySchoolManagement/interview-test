<?php
namespace App\Controller;

use Symfony\Component\Validator\Constraints as Assert;

readonly class InvoiceDTO
{
    public function __construct(
        #[Assert\NotBlank]
        #[Assert\Positive]
        public float $amount,

        #[Assert\Length(min: 3)]
        public ?string $reference = null
    ) {}
}
