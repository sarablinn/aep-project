<?php

namespace App\Entity;

use App\Repository\GameRepository;
use DateTime;
use Doctrine\Common\Collections\Collection;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Mapping\ManyToMany;

#[ORM\Entity(repositoryClass: GameRepository::class)]
#[ORM\Table(name: '`game`')]
class Game
{
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: 'SEQUENCE')]
    #[ORM\Column]
    private ?int $game_id = null;

    #[ORM\ManyToOne(targetEntity: 'User')]
    #[ORM\JoinColumn(name: 'player_user_id',
        referencedColumnName: 'user_id',
        nullable: false)]
    private ?User $user = null;

    #[ORM\ManyToOne(targetEntity: 'Mode')]
    #[ORM\JoinColumn(name: 'mode_id',
        referencedColumnName: 'mode_id',
        nullable: false)]
    private ?Mode $mode = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE,
        nullable: false)]
    private ?DateTime $timestamp = null;

    #[ORM\Column(nullable: false)]
    private ?int $score = null;

    /**
     * @var Collection<int, Event>
     */
    #[ManyToMany(targetEntity: Event::class, mappedBy: 'event_games')]
    private Collection $events;


    public function __construct() {
        $this->events = new ArrayCollection();
    }

    public function getGameId(): ?int
    {
        return $this->game_id;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(User $user): self
    {
        $this->user = $user;

        return $this;
    }

    public function getMode(): ?Mode
    {
        return $this->mode;
    }

    public function setMode(Mode $mode): self
    {
        $this->mode = $mode;

        return $this;
    }

    public function getTimestamp(): ?DateTime
    {
        return $this->timestamp;
    }

    public function setTimestamp(DateTime $timestamp): self
    {
        $this->timestamp = $timestamp;

        return $this;
    }

    public function getScore(): ?int
    {
        return $this->score;
    }

    public function setScore(int $score): self
    {
        $this->score = $score;

        return $this;
    }

    /**
     * @return Collection<int, Event>
     */
    public function getEvents(): Collection
    {
        return $this->events;
    }

    public function addEvent(Event $event): self
    {
        if (!$this->events->contains($event)) {
            $this->events->add($event);
            $event->addEventGame($this);
        }

        return $this;
    }

    public function removeEvent(Event $event): self
    {
        if ($this->events->contains($event)) {
            $this->events->removeElement($event);
            $event->removeEventGame($this);
        }

        return $this;
    }

}
