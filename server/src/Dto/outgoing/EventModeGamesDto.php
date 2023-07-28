<?php

namespace App\Dto\outgoing;

class EventModeGamesDto
{
    private ModeDto $mode;
    private array $modeGames;

    /**
     * @return ModeDto
     */
    public function getMode(): ModeDto
    {
        return $this->mode;
    }

    /**
     * @param ModeDto $mode
     */
    public function setMode(ModeDto $mode): void
    {
        $this->mode = $mode;
    }

    /**
     * @return GameDto[]
     */
    public function getModeGames(): array
    {
        return $this->modeGames;
    }

    /**
     * @param GameDto[] $modeGames
     */
    public function setModeGames(array $modeGames): void
    {
        $this->modeGames = $modeGames;
    }

}
