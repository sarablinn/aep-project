<?php

namespace App\Dto\outgoing;

class UserDto
{
    #TODO should these UserDto fields have the option of being null?
    private int $user_id;
    private string $username;
    private string $first_name;
    private string $last_name;
    private string $email;
    private int $role_id;
    private string $background_color;
    private string $foreground_color;

    public function __construct() {

    }

    /**
     * @return int
     */
    public function getUserId(): int
    {
        return $this->user_id;
    }

    /**
     * @param int $user_id
     * @return void
     */
    public function setUserId(int $user_id): void
    {
        $this->user_id = $user_id;
    }

    /**
     * @return string|null
     */
    public function getUsername(): ?string
    {
        return $this->username;
    }

    /**
     * @param string|null $username
     */
    public function setUsername(?string $username): void
    {
        $this->username = $username;
    }

    /**
     * @return string|null
     */
    public function getFirstName(): ?string
    {
        return $this->first_name;
    }

    /**
     * @param string|null $first_name
     */
    public function setFirstName(?string $first_name): void
    {
        $this->first_name = $first_name;
    }

    /**
     * @return string|null
     */
    public function getLastName(): ?string
    {
        return $this->last_name;
    }

    /**
     * @param string|null $last_name
     */
    public function setLastName(?string $last_name): void
    {
        $this->last_name = $last_name;
    }

    /**
     * @return string
     */
    public function getEmail(): string
    {
        return $this->email;
    }

    /**
     * @param int $role_id
     */
    public function setRoleId(int $role_id): void
    {
        $this->role_id = $role_id;
    }

    /**
     * @return int
     */
    public function getRoleId(): int
    {
        return $this->role_id;
    }

    /**
     * @param string $email
     */
    public function setEmail(string $email): void
    {
        $this->email = $email;
    }

    /**
     * @return string|null
     */
    public function getBackgroundColor(): ?string
    {
        return $this->background_color;
    }

    /**
     * @param string|null $background_color
     */
    public function setBackgroundColor(?string $background_color): void
    {
        $this->background_color = $background_color;
    }

    /**
     * @return string|null
     */
    public function getForegroundColor(): ?string
    {
        return $this->foreground_color;
    }

    /**
     * @param string|null $foreground_color
     */
    public function setForegroundColor(?string $foreground_color): void
    {
        $this->foreground_color = $foreground_color;
    }

}
