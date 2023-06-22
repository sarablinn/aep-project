<?php

namespace App\Service;

use App\Dto\incoming\CreateEventDto;
use App\Dto\incoming\UpdateEventDto;
use App\Dto\outgoing\EventDto;
use App\Entity\Event;
use App\Entity\Game;
use App\Exception\EntityNotFoundException;
use App\Repository\EventRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;

class EventService implements ObjectMapperInterface
{
    private EntityManagerInterface $entityManager;
    private EventRepository $eventRepository;
    private UserRepository $userRepository;
//    private GameRepository $gameRepository;
    private LoggerInterface $logger;

    function __construct(EntityManagerInterface $entityManager,
                        EventRepository $eventRepository,
                        UserRepository $userRepository,
//                         GameRepository $gameRepository,
                        LoggerInterface $logger)
    {
        $this->entityManager = $entityManager;
        $this->eventRepository = $eventRepository;
        $this->userRepository = $userRepository;
//        $this->gameRepository = $gameRepository;
        $this->logger = $logger;
    }

    /**
     * @param int $event_id
     * @return Event|null
     */
    public function getEventById(int $event_id): ?Event
    {
        return $this->eventRepository->find($event_id);
    }

    /**
     * @return Event[]
     */
    public function getAllEvents(): iterable
    {
        return $this->eventRepository->findAll();
    }

    /**
     * @param CreateEventDto $createEventDto
     * @return Event|null
     * @throws EntityNotFoundException
     */
    public function createEvent(CreateEventDto $createEventDto): ?Event
    {
        $newEvent = new Event();
        #empty event_games is set when new Event is created

        $newEvent->setEventName($createEventDto->getEventName());
        $newEvent->setStartDate($createEventDto->getStartDate());
        $newEvent->setEndDate($createEventDto->getEndDate());

        $event_creator = $this->userRepository->find($createEventDto->getEventCreatorUserId());
        if (!$event_creator) {
            throw new EntityNotFoundException('ERROR: Unable to create event, '
                . 'unable to find event creator.');
        }

        $newEvent->setEventCreator($event_creator);

        $this->eventRepository->save($newEvent, true);

        $created_event = $this->eventRepository->findOneBy([
            'start_date' => $createEventDto->getStartDate(),
            'event_name' => $createEventDto->getEventName()]
        );

        if ($created_event) {
            return $created_event;
        }

        return null;
    }

    /**
     * @param int $event_id
     * @param UpdateEventDto $updateEventDto
     * @return Event|null
     * @throws EntityNotFoundException
     */
    public function updateEvent(int $event_id, UpdateEventDto $updateEventDto): ?Event {
        $existing_event = $this->eventRepository->find($event_id);
        if (!$existing_event) {
            throw new EntityNotFoundException(
                'ERROR: Unable to update event. No existing event to update.'
            );
        }

        $event_name = $updateEventDto->getEventName();
        $start_date = $updateEventDto->getStartDate();
        $end_date = $updateEventDto->getEndDate();

        $event_creator_id = $updateEventDto->getEventCreatorUserId();
        $event_creator = $this->userRepository->find($event_creator_id);

        if ($event_name) {
            $existing_event->setEventName($event_name);
        }
        if ($start_date) {
            $existing_event->setStartDate($start_date);
        }
        if ($end_date) {
            $existing_event->setEndDate($end_date);
        }
        if ($event_creator) {
            $existing_event->setEventCreator($event_creator);
        }

        $this->eventRepository->save($existing_event, true);

        return $existing_event;
    }

    /**
     * @param int $event_id
     * @return bool
     */
    public function deleteEvent(int $event_id): bool
    {
        $event = $this->eventRepository->find($event_id);
        if (!$event) {
            return false;
        }

        $this->eventRepository->remove($event, true);
        return true;
    }



    ##################################################################################
    ####################### OBJECT MAPPER IMPLEMENTATIONS ############################
    ##################################################################################

    /**
     * @param Event $object
     * @return EventDto
     */
    public function mapToDto($object): EventDto
    {
        $eventDto = new EventDto();

        $eventDto->setEventId($object->getEventId());
        $eventDto->setEventName($object->getEventName());
        $eventDto->setStartDate($object->getStartDate());
        $eventDto->setEndDate($object->getEndDate());
        $eventDto->setEventCreator($object->getEventCreator());
        $eventDto->setEventGames($object->getEventGames());

        return $eventDto;
    }

    public function mapToDtos(array $events): array
    {
        $eventDtos = [];

        foreach ($events as $event) {
            $eventDtos[] = $this->mapToDto($event);
        }

        return $eventDtos;
    }

}
