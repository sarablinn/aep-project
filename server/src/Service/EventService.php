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
use DateTime;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Psr\Log\LoggerInterface;
use Symfony\Component\Validator\Constraints\Date;

class EventService implements ObjectMapperInterface
{
    private EntityManagerInterface $entityManager;
    private EventRepository $eventRepository;
    private UserRepository $userRepository;
    private GameService $gameService;
    private LoggerInterface $logger;

    function __construct(EntityManagerInterface $entityManager,
                        EventRepository $eventRepository,
                        UserRepository $userRepository,
                        GameService $gameService,
                        LoggerInterface $logger)
    {
        $this->entityManager = $entityManager;
        $this->eventRepository = $eventRepository;
        $this->userRepository = $userRepository;
        $this->gameService = $gameService;
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
     * @throws Exception caused by DateTime conversion
     */
    public function createEvent(CreateEventDto $createEventDto): ?Event
    {
        $newEvent = new Event();
        # empty event_games is set when new Event is created

        $newEvent->setEventName($createEventDto->getEventName());

        # convert unix time string to DateTime
        $start_date = new DateTime("@{$createEventDto->getStartDate()}");
        $end_date = new DateTime("@{$createEventDto->getEndDate()}");
        $newEvent->setStartDate($start_date);
        $newEvent->setEndDate($end_date);

        $event_creator = $this->userRepository->find($createEventDto->getEventCreatorUserId());
        if (!$event_creator) {
            throw new EntityNotFoundException('ERROR: Unable to create event, '
                . 'unable to find event creator.');
        }

        $newEvent->setEventCreator($event_creator);

        $this->eventRepository->save($newEvent, true);

        $created_event = $this->eventRepository->findOneBy([
            'start_date' => $start_date,
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
            # convert unix time string to DateTime
            $converted_start_date = new DateTime(
                "@{$updateEventDto->getStartDate()}");
            $existing_event->setStartDate($converted_start_date);
        }
        if ($end_date) {
            # convert unix time string to DateTime
            $converted_end_date = new DateTime(
                "@{$updateEventDto->getEndDate()}");
            $existing_event->setEndDate($converted_end_date);
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
        $eventDto->setEventCreatorId($object->getEventCreator()->getUserId());

        $event_games = $object->getEventGames();
        $eventDto_games = $this->gameService->mapToDtos($event_games->toArray());

        $eventDto->setEventGames($eventDto_games);

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
