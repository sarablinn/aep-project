<?php

namespace App\Dto\outgoing;


/**
 * Data Transfer Object for expressing an array of GameDtos, especially when
 * Game data is sorted by fields such as game Mode.
 *
 * Note: A better name for this DTO would simply be 'GamesDto' as it's use
 * is not limited to Game modes.
 */
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
