<?php

namespace App\Dto\outgoing;

use App\Entity\User;
use DateTime;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;


class EventDto
{
    private int $event_id;

    private string $event_name;

    private DateTime $start_date;

    private User $event_creator;

    private Collection $event_games;


    public function __construct() {
        $this->event_games = new ArrayCollection();
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
     * @return User
     */
    public function getEventCreator(): User
    {
        return $this->event_creator;
    }

    /**
     * @param User $event_creator
     */
    public function setEventCreator(User $event_creator): void
    {
        $this->event_creator = $event_creator;
    }

    /**
     * @return Collection
     */
    public function getEventGames(): Collection
    {
        return $this->event_games;
    }

    /**
     * @param Collection $event_games
     */
    public function setEventGames(Collection $event_games): void
    {
        $this->event_games = $event_games;
    }

}
