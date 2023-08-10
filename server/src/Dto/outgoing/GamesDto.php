<?php

namespace App\Dto\outgoing;


/**
 * Data Transfer Object for expressing an array of GameDtos, especially when
 * Game data is sorted by fields such as game Mode.
 */
class GamesDto
{
    private array $games;


    function __construct()
    {
        $this->games = [];
    }

    /**
     * @return array
     */
    public function getGames(): array
    {
        return $this->games;
    }

    /**
     * @param GameDto[] $games
     */
    public function addGames(array $games): void
    {
        $this->games[] = $games;
    }

}
