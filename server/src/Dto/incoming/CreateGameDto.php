<?php

namespace App\Dto\incoming;

use DateTime;
use Symfony\Component\Validator\Constraints\NotNull;
use Symfony\Component\Validator\Constraints\Type;

class CreateGameDto
{
    #[NotNull]
    #[Type('int')]
    private int $user_id;

    #[NotNull]
    #[Type('string')]
    private int $mode_id;

    #[NotNull]
    #[Type('DateTime')]
    private DateTime $timestamp;

    #[NotNull]
    #[Type('int')]
    private int $score;


    #TODO handle games that are part of events


    /**
     * @return int
     */
    public function getUserId(): int
    {
        return $this->user_id;
    }

    /**
     * @param int $user_id
     */
    public function setUserId(int $user_id): void
    {
        $this->user_id = $user_id;
    }

    /**
     * @return int
     */
    public function getModeId(): int
    {
        return $this->mode_id;
    }

    /**
     * @param int $mode_id
     */
    public function setModeId(int $mode_id): void
    {
        $this->mode_id = $mode_id;
    }

    /**
     * @return DateTime
     */
    public function getTimestamp(): DateTime
    {
        return $this->timestamp;
    }

    /**
     * @param DateTime $timestamp
     */
    public function setTimestamp(DateTime $timestamp): void
    {
        $this->timestamp = $timestamp;
    }

    /**
     * @return int
     */
    public function getScore(): int
    {
        return $this->score;
    }

    /**
     * @param int $score
     */
    public function setScore(int $score): void
    {
        $this->score = $score;
    }

}
