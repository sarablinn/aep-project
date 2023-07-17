<?php

namespace App\Controller;

use App\Dto\incoming\CreateEventDto;
use App\Dto\incoming\UpdateEventDto;
use App\Exception\EntityNotFoundException;
use App\Exception\InvalidRequestDataException;
use App\Serialization\SerializationService;
use App\Service\EventService;
use Exception;
use JsonException;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class EventController extends ApiController
{
    private EventService $eventService;
    private SerializationService $serializationService;

    public function __construct(EventService $eventService,
                                SerializationService $serializationService)
    {
        parent::__construct($serializationService);

        $this->eventService = $eventService;
    }


    /**
     * @return Response
     */
    #[Route('/events', methods: ('GET'))]
    public function getAllEvents(): Response
    {
        $events = $this->eventService->getAllEvents();
        $eventDtos = $this->eventService->mapToDtos($events);
        return $this->json($eventDtos);
    }

    /**
     * @return Response
     */
    #[Route('/events/current_events', methods: ('GET'))]
    public function getCurrentEvents(): Response
    {
        $events = $this->eventService->getCurrentEvents();
        $eventDtos = $this->eventService->mapToDtos($events);
        return $this->json($eventDtos);
    }

    /**
     * @param string $event_id
     * @return Response
     */
    #[Route('/events/{event_id}', methods: ['GET'])]
    public function getEventById(string $event_id): Response
    {
        $event = $this->eventService->getEventById($event_id);
        $eventDto = $this->eventService->mapToDto($event);
        return $this->json($eventDto);
    }

    /**
     * @param Request $request
     * @return Response
     */
    #[Route('/events', methods: ('POST'))]
    public function createEvent(Request $request): Response
    {
        try {
            /** @var CreateEventDto $createEventDto */
            $createEventDto = $this->getValidatedDto($request, CreateEventDto::class);
            $event = $this->eventService->createEvent($createEventDto);
            $eventDto = $this->eventService->mapToDto($event);
        } catch (EntityNotFoundException $entityNotFoundException) {
            return $this->json($entityNotFoundException->getMessage());
        } catch (InvalidRequestDataException $invalidRequestDataException) {
            return $this->json($invalidRequestDataException->getMessage()
                . ' VALIDATION ERRORS: '
                . $invalidRequestDataException->getValidationErrors());
        } catch (JsonException $jsonException) {
            return $this->json($jsonException->getMessage());
        } catch (Exception $e) {
            return $this->json($e->getMessage()
                . ' Check DateTime conversions.');
        }

        return $this->json($eventDto);
    }

    /**
     * @param string $event_id
     * @param Request $request
     * @return Response
     * @throws InvalidRequestDataException
     * @throws JsonException
     */
    #[Route('/events/{event_id}', methods: ['PATCH', 'PUT'])]
    public function updateEvent(string $event_id, Request $request): Response
    {
        try {
            /** @var UpdateEventDto $updateEventDto */
            $updateEventDto = $this->getValidatedDto($request, UpdateEventDto::class);
            $event = $this->eventService->updateEvent($event_id, $updateEventDto);
            $eventDto = $this->eventService->mapToDto($event);
        } catch (EntityNotFoundException $entityNotFoundException) {
            return $this->json($entityNotFoundException->getMessage());
        }

        return $this->json($eventDto);
    }

    /**
     * @param string $event_id
     * @return Response
     */
    #[Route('/events/{event_id}', methods: ['DELETE'])]
    public function deleteEvent(string $event_id): Response
    {
        return $this->json($this->eventService->deleteEvent($event_id));
    }

}
