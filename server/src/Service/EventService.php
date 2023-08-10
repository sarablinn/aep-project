<?php

namespace App\Service;

use App\Dto\incoming\AddEventGameDto;
use App\Dto\incoming\CreateEventDto;
use App\Dto\incoming\UpdateEventDto;
use App\Dto\outgoing\EventDto;
use App\Dto\outgoing\ModeGamesDto;
use App\Entity\Event;
use App\Entity\Game;
use App\Exception\DateFormatException;
use App\Exception\EntityNotFoundException;
use App\Repository\EventRepository;
use DateTime;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Psr\Log\LoggerInterface;

class EventService implements ObjectMapperInterface
{
    private EntityManagerInterface $entityManager;
    private EventRepository $eventRepository;
    private UserService $userService;
    private GameService $gameService;
    private ModeService $modeService;
    private LoggerInterface $logger;


    function __construct(EntityManagerInterface $entityManager,
                        EventRepository $eventRepository,
                        UserService $userService,
                        GameService $gameService,
                        ModeService $modeService,
                        LoggerInterface $logger)
    {
        $this->entityManager = $entityManager;
        $this->eventRepository = $eventRepository;
        $this->userService = $userService;
        $this->gameService = $gameService;
        $this->modeService = $modeService;
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
     * Returns an array of current Events.
     * @return Event[]
     */
    public function getCurrentEvents(): iterable
    {
        $today = new DateTime();
        return $this->eventRepository->findByCurrentDate($today);
    }

    /**
     * Returns an array of Events that ended within 1 week from today.
     * @return Event[]
     */
    public function getEventsEndedWeekPrior(): iterable
    {
        return $this->eventRepository->findEventsEndedWeekPrior();
    }

    /**
     * Returns an array of Events that start after today.
     * @return Event[]
     */
    public function getFutureEvents(): iterable
    {
        $today = new DateTime();
        return $this->eventRepository->findFutureEvents($today);
    }

    /**
     * Return an array of games from a given event, indexed by mode and in
     * descending score order, for a given event.
     * @param int $event_id
     * @param int $mode_id
     * @return Game[]
     * @throws EntityNotFoundException
     */
    public function getGamesByEventMode(int $event_id, int $mode_id): iterable {
        $games_by_event_mode = [];

        $mode = $this->modeService->getMode($mode_id);
        $event = $this->getEventById($event_id);
        $event_games = $event->getEventGames();

        if (!$mode) {
            throw new EntityNotFoundException(
                'ERROR: No mode by id ' . $mode_id);
        }

        if ($event_games->count() > 0) {
            $modeGames = $this->gameService->getGamesByMode($mode_id);

            foreach ($event_games as $event_game) {
                foreach ($modeGames as $mode_game) {
                    if ($mode_game->getGameId() === $event_game->getGameId()) {
                        $games_by_event_mode[] = $event_game;
                    }
                }
            }
        }

        return $games_by_event_mode;
    }


    /**
     * Return an array of games from a given event, indexed by mode and in
     * descending score order, for a given event.
     * @param int $event_id
     * @return ModeGamesDto[]
     * @throws EntityNotFoundException
     */
    public function getAllGamesByEventModes(int $event_id): iterable {
        $all_games_by_event_mode = [];

        $modeDtos = $this->modeService->mapToDtos(
            $this->modeService->getModes());

        foreach ($modeDtos as $modeDto) {
            $modeGames = $this->gameService->mapToDtos(
                $this->getGamesByEventMode($event_id, $modeDto->getModeId()));

            $eventModeGamesDto = new ModeGamesDto();
            $eventModeGamesDto->setMode($modeDto);
            $eventModeGamesDto->setModeGames($modeGames);

            $all_games_by_event_mode[] = $eventModeGamesDto;
        }

        return $all_games_by_event_mode;
    }

    public function getEventWithoutId(DateTime $start_date,
                                      DateTime $end_date,
                                      string $event_name): ?Event
    {
        return $this->eventRepository->findOneBy(
            [
                'start_date' => $start_date,
                'end_date' => $end_date,
                'event_name' => $event_name
            ]
        );
    }

    /**
     * @param CreateEventDto $createEventDto
     * @return Event|null
     * @throws EntityNotFoundException
     * @throws DateFormatException
     */
    public function createEvent(CreateEventDto $createEventDto): ?Event
    {
        $newEvent = new Event();
        # empty event_games is set when new Event is created

        $newEvent->setEventName($createEventDto->getEventName());

        # convert unix time string to DateTime
        try {
            $unix_start_date = $createEventDto->getStartDate() / 1000;
            $unix_end_date = $createEventDto->getEndDate() / 1000;
            $start_date = new DateTime("@{$unix_start_date}");
            $end_date = new DateTime("@{$unix_end_date}");
            $newEvent->setStartDate($start_date);
            $newEvent->setEndDate($end_date);
        } catch (Exception $exception) {
            throw new DateFormatException('ERROR: Unable to '
                . 'create new event, invalid date format.');
        }

        $event_creator = $this->userService->getUserById(
            $createEventDto->getEventCreatorUserId());
        if (!$event_creator) {
            throw new EntityNotFoundException(
                'ERROR: Unable to create event, '
                . 'unable to find event creator.');
        }

        $newEvent->setEventCreator($event_creator);

        $this->eventRepository->save($newEvent, true);

        // retrieve and return
        return $this->getEventWithoutId($start_date,
                    $end_date, $createEventDto->getEventName()
        );
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
        $event_creator = $this->userService->getUserById($event_creator_id);

        if ($event_name) {
            $existing_event->setEventName($event_name);
        }
        if ($start_date) {
            # convert unix time string to DateTime
            $unix_start_date = $updateEventDto->getStartDate() /1000;
            $converted_start_date = new DateTime("@{$unix_start_date}");
            $existing_event->setStartDate($converted_start_date);
        }
        if ($end_date) {
            # convert unix time string to DateTime
            $unix_end_date = $updateEventDto->getEndDate() /1000;
            $converted_end_date = new DateTime("@{$unix_end_date}");
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

    /**
     * @param AddEventGameDto $addEventGameDto
     * @return Event
     * @throws EntityNotFoundException
     */
    public function addGameToEvent(AddEventGameDto $addEventGameDto): Event
    {
        $event_id = $addEventGameDto->getEventId();
        $game_id = $addEventGameDto->getGameId();

        $existing_event = $this->getEventById($event_id);
        if (!$existing_event) {
            throw new EntityNotFoundException(
                'ERROR: No event by id ' . $event_id);
        }

        $existing_game = $this->gameService->getGame($game_id);
        if (!$existing_game) {
            throw new EntityNotFoundException(
                'ERROR: No game by id ' . $game_id);
        }

        if (!$existing_event->getEventGames()->contains($existing_game)) {
            $existing_event->addEventGame($existing_game);
            $this->eventRepository->save($existing_event, true);
        }

        return $this->getEventById($event_id);
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
        $eventDto->setEventCreatorUserId($object->getEventCreator()->getUserId());

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
