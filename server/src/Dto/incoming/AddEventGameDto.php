<?php

namespace App\Dto\incoming;

use App\Entity\Game;
use Symfony\Component\Validator\Constraints\NotNull;
use Symfony\Component\Validator\Constraints\Type;

class AddEventGameDto
{
    #[NotNull]
    #[Type('int')]
    private int $event_id;

    #[NotNull]
    #[Type('int')]
    private int $game_id;

    public function __construct(int $eventId, int $gameId) {
        $this->event_id = $eventId;
        $this->game_id = $gameId;
    }

    /**
     * @return int
     */
    public function getEventId(): int
    {
        return $this->event_id;
    }

    /**
     * @param int $event_id
     */
    public function setEventId(int $event_id): void
    {
        $this->event_id = $event_id;
    }

    /**
     * @return int
     */
    public function getGameId(): int
    {
        return $this->game_id;
    }

    /**
     * @param int $game_id
     */
    public function setGameId(int $game_id): void
    {
        $this->game_id = $game_id;
    }

}
