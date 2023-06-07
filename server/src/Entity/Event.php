<?php

namespace App\Entity;

use App\Repository\EventRepository;
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
    private ?\DateTimeInterface $start_date = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $end_date = null;

    #[ORM\JoinColumn(name: 'created_by_user_id',
        referencedColumnName: 'user_id',
        nullable: false)]
    private ?User $event_creator = null;

    #[ORM\ManyToMany(targetEntity: Game::class, mappedBy: 'Game')]
    #[ORM\JoinTable(name: 'game_event')]
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

    public function getStartDate(): ?\DateTimeInterface
    {
        return $this->start_date;
    }

    public function setStartDate(\DateTimeInterface $start_date): self
    {
        $this->start_date = $start_date;

        return $this;
    }

    public function getEndDate(): ?\DateTimeInterface
    {
        return $this->end_date;
    }

    public function setEndDate(\DateTimeInterface $end_date): self
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
        }

        return $this;
    }

    public function removeEventGame(Game $game): self
    {
        $this->event_games->removeElement($game);

        return $this;
    }

}
