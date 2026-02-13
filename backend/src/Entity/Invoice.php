<?php
namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
class Invoice
{
    #[ORM\Id, ORM\GeneratedValue, ORM\Column]
    public private(set) ?int $id = null;

    #[ORM\Column(type: 'decimal', precision: 10, scale: 2)]
    public float $amount {
        set(float $value) {
            if ($value < 0) {
                throw new \InvalidArgumentException("Invoice amount cannot be negative.");
            }
            $this->amount = $value;
        }
    }

    #[ORM\Column(length: 255)]
    public string $reference;

    public string $formattedAmount {
        get => '$' . number_format($this->amount, 2);
    }
}
