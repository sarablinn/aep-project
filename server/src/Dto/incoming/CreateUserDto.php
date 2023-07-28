<?php

namespace App\Dto\incoming;

use Symfony\Component\Validator\Constraints\NotNull;
use Symfony\Component\Validator\Constraints\Type;

class CreateUserDto
{

    #[NotNull]
    #[Type('string')]
    private ?string $username;

    #[NotNull]
    #[Type('string')]
    private ?string $email;

    #[Type('string')]
    private ?string $user_token;

    #[NotNull]
    #[Type('string')]
    private ?string $first_name;

    #[NotNull]
    #[Type('string')]
    private ?string $last_name;

    #[Type('int')]
    private ?int $role_id;

    #[Type('string')]
    private ?string $foreground_color;

    #[Type('string')]
    private ?string $background_color;


    /**
     * @return string
     */
    public function getUsername(): string
    {
        return $this->username;
    }

    /**
     * @param ?string $username
     */
    public function setUsername(?string $username): void
    {
        $this->username = $username;
    }

    /**
     * @return string
     */
    public function getEmail(): string
    {
        return $this->email;
    }

    /**
     * @param ?string $email
     */
    public function setEmail(?string $email): void
    {
        $this->email = $email;
    }

    /**
     * @return string|null
     */
    public function getUserToken(): ?string
    {
        return $this->user_token;
    }

    /**
     * @param string|null $userToken
     * @return $this
     */
    public function setUserToken(?string $userToken): self
    {
        $this->user_token = $userToken;

        return $this;
    }

    /**
     * @return string
     */
    public function getFirstName(): string
    {
        return $this->first_name;
    }

    /**
     * @param ?string $first_name
     */
    public function setFirstName(?string $first_name): void
    {
        $this->first_name = $first_name;
    }

    /**
     * @return string
     */
    public function getLastName(): string
    {
        return $this->last_name;
    }

    /**
     * @param ?string $last_name
     */
    public function setLastName(?string $last_name): void
    {
        $this->last_name = $last_name;
    }

    /**
     * @return int
     */
    public function getRoleId(): int
    {
        return $this->role_id;
    }

    /**
     * @param int $role_id
     */
    public function setRoleId(int $role_id): void
    {
        $this->role_id = $role_id;
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

}
