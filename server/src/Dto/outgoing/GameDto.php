<?php

namespace App\Dto\outgoing;

use DateTime;

class GameDto
{
    private int $game_id;

    private UserDto $user;

    private ModeDto $mode;

    private DateTime $timestamp;

    private int $score;

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

    /**
     * @return UserDto
     */
    public function getUser(): UserDto
    {
        return $this->user;
    }

    /**
     * @param UserDto $user
     */
    public function setUser(UserDto $user): void
    {
        $this->user = $user;
    }

    /**
     * @return ModeDto
     */
    public function getMode(): ModeDto
    {
        return $this->mode;
    }

    /**
     * @param ModeDto $mode
     */
    public function setMode(ModeDto $mode): void
    {
        $this->mode = $mode;
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
