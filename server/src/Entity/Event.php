<?php

namespace App\Entity;

use App\Repository\EventRepository;
use DateTime;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: EventRepository::class)]
#[ORM\Table(name: '`event`')]
class Event
{
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: 'SEQUENCE')]
    #[ORM\Column]
    private ?int $event_id = null;

    #[ORM\Column(length: 30)]
    private ?string $event_name = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?DateTime $start_date = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?DateTime $end_date = null;

    #[ORM\ManyToOne(targetEntity: 'user')]
    #[ORM\JoinColumn(name: 'created_by_user_id',
        referencedColumnName: 'user_id',
        nullable: false)]
    private ?User $event_creator = null;

    /**
     * @var Collection<int, Game>
     */
    #[ORM\ManyToMany(targetEntity: Game::class, inversedBy: 'games')]
    #[ORM\JoinTable(name: 'game_event')]
    #[ORM\JoinColumn(name: 'event_id', referencedColumnName: 'event_id')]
    #[ORM\InverseJoinColumn(name: 'game_id', referencedColumnName: 'game_id')]
    private Collection $event_games;


    public function __construct()
    {
        $this->event_games = new ArrayCollection();
    }

    public function getEventId(): ?int
    {
        return $this->event_id;
    }

    public function getEventName(): ?string
    {
        return $this->event_name;
    }

    public function setEventName(string $event_name): self
    {
        $this->event_name = $event_name;

        return $this;
    }

    public function getStartDate(): ?DateTime
    {
        return $this->start_date;
    }

    public function setStartDate(DateTime $start_date): self
    {
        $this->start_date = $start_date;

        return $this;
    }

    public function getEndDate(): ?DateTime
    {
        return $this->end_date;
    }

    public function setEndDate(DateTime $end_date): self
    {
        $this->end_date = $end_date;

        return $this;
    }

    public function getEventCreator(): ?User
    {
        return $this->event_creator;
    }

    public function setEventCreator(User $event_creator): self
    {
        $this->event_creator = $event_creator;

        return $this;
    }

    /**
     * @return Collection<int, Game>
     */
    public function getEventGames(): Collection
    {
        return $this->event_games;
    }

    public function addEventGame(Game $game): self
    {
        if (!$this->event_games->contains($game)) {
            $this->event_games->add($game);
            $game->addEvent($this);
        }

        return $this;
    }

    public function removeEventGame(Game $game): self
    {
        if ($this->event_games->contains($game)) {
            $this->event_games->removeElement($game);
            $game->removeEvent($this);
        }

        return $this;
    }

}
