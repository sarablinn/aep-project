<?php

namespace App\Dto\incoming;
use Symfony\Component\Validator\Constraints\NotNull;
use Symfony\Component\Validator\Constraints\Type;

class UpdateModeDto
{
    #[NotNull]
    #[Type('string')]
    private string $mode_name;

    #[NotNull]
    #[Type('int')]
    private int $time_limit;


    /**
     * @return string
     */
    public function getModeName(): string
    {
        return $this->mode_name;
    }

    /**
     * @param string $mode_name
     */
    public function setModeName(string $mode_name): void
    {
        $this->mode_name = $mode_name;
    }

    /**
     * @return int
     */
    public function getTimeLimit(): int
    {
        return $this->time_limit;
    }

    /**
     * @param int $time_limit
     */
    public function setTimeLimit(int $time_limit): void
    {
        $this->time_limit = $time_limit;
    }

}
