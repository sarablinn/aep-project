<?php

namespace App\Dto\incoming;

use DateTime;
use Symfony\Component\Validator\Constraints\NotNull;
use Symfony\Component\Validator\Constraints\Type;

class UpdateEventDto
{

    #[NotNull]
    #[Type('int')]
    private int $event_id;

    #[NotNull]
    #[Type('string')]
    private string $event_name;

    #[NotNull]
    #[Type('int')]
    private int $start_date;

    #[NotNull]
    #[Type('int')]
    private int $end_date;

    #[NotNull]
    #[Type('int')]
    private int $event_creator_user_id;

//    #[NotNull]
//    #[Type('array')]
//    private array $event_games;


    function __construct()
    {
//        $this->event_games = [];
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
     * @return int|null
     */
    public function getStartDate(): ?int
    {
        return $this->start_date;
    }

    /**
     * @param int $start_date
     */
    public function setStartDate(int $start_date): void
    {
        $this->start_date = $start_date;
    }

    /**
     * @return int|null
     */
    public function getEndDate(): ?int
    {
        return $this->end_date;
    }

    /**
     * @param int $end_date
     */
    public function setEndDate(int $end_date): void
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

}
