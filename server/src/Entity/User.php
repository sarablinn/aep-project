<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: '`user`')]
#[UniqueEntity('email', 'username')]
class User
{
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: 'SEQUENCE')]
    #[ORM\Column]
    private ?int $user_id = null;

    #[ORM\Column(length: 255, unique: true)]
    private ?string $email = null;

    #[ORM\Column(length: 50, unique: true, nullable: true)]
    private ?string $username = null;

    #[ORM\Column(length: 75, nullable: true)]
    private ?string $first_name = null;

    #[ORM\Column(length: 75, nullable: true)]
    private ?string $last_name = null;

    #[ORM\ManyToOne(inversedBy: 'users')]
    #[ORM\JoinColumn(name: 'role_id', referencedColumnName: 'role_id',
        nullable: false)]
    private ?Role $role = null;

    #[ORM\Column(length: 20, nullable: true)]
    private ?string $background_color = null;

    #[ORM\Column(length: 20, nullable: true)]
    private ?string $foreground_color = null;

    #TODO add AUTH0 User Authentication token


    public function getUserId(): ?int
    {
        return $this->user_id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    public function getUsername(): ?string
    {
        return $this->username;
    }

    public function setUsername(?string $username): self
    {
        $this->username = $username;

        return $this;
    }

    public function getFirstName(): ?string
    {
        return $this->first_name;
    }

    public function setFirstName(?string $first_name): self
    {
        $this->first_name = $first_name;

        return $this;
    }

    public function getLastName(): ?string
    {
        return $this->last_name;
    }

    public function setLastName(?string $last_name): self
    {
        $this->last_name = $last_name;

        return $this;
    }

    public function getRole(): ?Role
    {
        return $this->role;
    }

    public function setRole(?Role $role): self
    {
        $this->role = $role;

        return $this;
    }

    public function getBackgroundColor(): ?string
    {
        return $this->background_color;
    }

    public function setBackgroundColor(?string $background_color): self
    {
        $this->background_color = $background_color;

        return $this;
    }

    public function getForegroundColor(): ?string
    {
        return $this->foreground_color;
    }

    public function setForegroundColor(?string $foreground_color): self
    {
        $this->foreground_color = $foreground_color;

        return $this;
    }

}
