<?php

namespace App\Dto\outgoing;

use DateTime;


class EventDto
{
    private int $event_id;

    private string $event_name;

    private DateTime $start_date;

    private DateTime $end_date;

    private int $event_creator_user_id;

    private array $event_games;


    public function __construct() {
        $this->event_games = [];
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
     * @return string
     */
    public function getEventName(): string
    {
        return $this->event_name;
    }

    /**
     * @param string $event_name
     */
    public function setEventName(string $event_name): void
    {
        $this->event_name = $event_name;
    }

    /**
     * @return DateTime
     */
    public function getStartDate(): DateTime
    {
        return $this->start_date;
    }

    /**
     * @param DateTime $start_date
     */
    public function setStartDate(DateTime $start_date): void
    {
        $this->start_date = $start_date;
    }

    /**
     * @return DateTime
     */
    public function getEndDate(): DateTime
    {
        return $this->end_date;
    }

    /**
     * @param DateTime $end_date
     */
    public function setEndDate(DateTime $end_date): void
    {
        $this->end_date = $end_date;
    }

    /**
     * @return int
     */
    public function getEventCreatorUserId(): int
    {
        return $this->event_creator_user_id;
    }

    /**
     * @param int $event_creator_user_id
     */
    public function setEventCreatorUserId(int $event_creator_user_id): void
    {
        $this->event_creator_user_id = $event_creator_user_id;
    }

    /**
     * @return GameDto[]
     */
    public function getEventGames(): array
    {
        return $this->event_games;
    }

    /**
     * @param GameDto[] $event_games
     */
    public function setEventGames(array $event_games): void
    {
        $this->event_games = $event_games;
    }

}
