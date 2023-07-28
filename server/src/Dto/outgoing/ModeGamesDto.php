<?php

namespace App\Dto\outgoing;


class ModeGamesDto
{
    private array $modeGames;


    function __construct()
    {
        $this->modeGames = [];
    }

    /**
     * @return array
     */
    public function getModeGames(): array
    {
        return $this->modeGames;
    }

    /**
     * @param GameDto[] $games
     */
    public function addGames(array $games): void
    {
        $this->modeGames[] = $games;
    }

}
