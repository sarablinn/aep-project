<?php

namespace App\Entity;

use App\Repository\ModeRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ModeRepository::class)]
class Mode
{
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: 'SEQUENCE')]
    #[ORM\Column]
    private ?int $mode_id = null;

    #[ORM\Column(length: 20)]
    private ?string $mode_name = null;

    #[ORM\Column]
    private ?int $time_limit = null;


    public function getModeId(): ?int
    {
        return $this->mode_id;
    }

    public function getModeName(): ?string
    {
        return $this->mode_name;
    }

    public function setModeName(string $mode_name): self
    {
        $this->mode_name = $mode_name;

        return $this;
    }

    public function getTimeLimit(): ?int
    {
        return $this->time_limit;
    }

    public function setTimeLimit(int $time_limit): self
    {
        $this->time_limit = $time_limit;

        return $this;
    }
}
