<?php

namespace App\Dto\outgoing;

class ModeDto
{
    private ?int $mode_id;

    private ?string $mode_name;

    private ?int $time_limit;


    /**
     * @return int|null
     */
    public function getModeId(): ?int
    {
        return $this->mode_id;
    }

    /**
     * @param int|null $mode_id
     */
    public function setModeId(?int $mode_id): void
    {
        $this->mode_id = $mode_id;
    }

    /**
     * @return string|null
     */
    public function getModeName(): ?string
    {
        return $this->mode_name;
    }

    /**
     * @param string|null $mode_name
     */
    public function setModeName(?string $mode_name): void
    {
        $this->mode_name = $mode_name;
    }

    /**
     * @return int|null
     */
    public function getTimeLimit(): ?int
    {
        return $this->time_limit;
    }

    /**
     * @param int|null $time_limit
     */
    public function setTimeLimit(?int $time_limit): void
    {
        $this->time_limit = $time_limit;
    }

}
