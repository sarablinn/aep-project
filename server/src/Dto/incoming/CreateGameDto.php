<?php

namespace App\Dto\incoming;

use DateTime;
use Symfony\Component\Validator\Constraints\NotNull;
use Symfony\Component\Validator\Constraints\Type;

class CreateGameDto
{
    #[NotNull]
    #[Type('string')]
    private string $user_token;

    #[NotNull]
    #[Type('int')]
    private int $mode_id;

    #[NotNull]
    #[Type('int')]
    private int $timestamp;

    #[NotNull]
    #[Type('int')]
    private int $score;


    #TODO handle games that are part of events


    /**
     * @return string
     */
    public function getUserToken(): string
    {
        return $this->user_token;
    }

    /**
     * @param string $user_token
     */
    public function setUserToken(string $user_token): void
    {
        $this->user_token = $user_token;
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
     * @return int
     */
    public function getTimestamp(): int
    {
        return $this->timestamp;
    }

    /**
     * @param int $timestamp
     */
    public function setTimestamp(int $timestamp): void
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
