<?php

namespace App\Dto\incoming;

use Symfony\Component\Validator\Constraints\NotNull;
use Symfony\Component\Validator\Constraints\Type;

class CreateEventDto
{
    #[NotNull]
    #[Type('string')]
    private string $event_name;

    #[NotNull]
    #[Type('string')]
    private string $start_date;

    #[NotNull]
    #[Type('string')]
    private string $end_date;

    #[NotNull]
    #[Type('int')]
    private int $event_creator_user_id;

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
     * @return string
     */
    public function getStartDate(): string
    {
        return $this->start_date;
    }

    /**
     * @param string $start_date
     */
    public function setStartDate(string $start_date): void
    {
        $this->start_date = $start_date;
    }

    /**
     * @return string
     */
    public function getEndDate(): string
    {
        return $this->end_date;
    }

    /**
     * @param string $end_date
     */
    public function setEndDate(string $end_date): void
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
