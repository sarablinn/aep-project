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
    #[Type('DateTime')]
    private DateTime $start_date;

    #[NotNull]
    #[Type('DateTime')]
    private DateTime $end_date;

    #[NotNull]
    #[Type('int')]
    private int $event_creator_user_id;



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
     * @return DateTime|null
     */
    public function getStartDate(): ?DateTime
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
     * @return DateTime|null
     */
    public function getEndDate(): ?DateTime
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

}
