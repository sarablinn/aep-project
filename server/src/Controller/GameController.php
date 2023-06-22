<?php

namespace App\Controller;

use App\Dto\incoming\CreateGameDto;
use App\Exception\EntityNotFoundException;
use App\Exception\InvalidRequestDataException;
use App\Serialization\SerializationService;
use App\Service\GameService;
use JsonException;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class GameController extends ApiController
{
    private GameService $gameService;
    private SerializationService $serializationService;

    public function __construct(GameService $gameService,
                                SerializationService $serializationService)
    {
        parent::__construct($serializationService);

        $this->gameService = $gameService;
    }


    /**
     * @return Response
     */
    #[Route('/games', methods: ['GET'])]
    public function getAllGames(): Response
    {
        $games = $this->gameService->getAllGames();
        $gameDtos = $this->gameService->mapToDtos($games);
        return $this->json($gameDtos);
    }

    /**
     * @param string $user_id
     * @return Response
     */
    #[Route('/games/user/{user_id}', methods: ['GET'])]
    public function getAllGamesByUser(string $user_id): Response
    {
        $games = $this->gameService->getGamesByUser($user_id);
        $gameDtos = $this->gameService->mapToDtos($games);
        return $this->json($gameDtos);
    }

    /**
     * @param Request $request
     * @return Response
     * @throws InvalidRequestDataException
     * @throws JsonException
     */
    #[Route('/games', methods: ['POST'])]
    public function createGame(Request $request): Response
    {
        try {
            /** @var CreateGameDto $createGameDto */
            $createGameDto = $this->getValidatedDto($request, CreateGameDto::class);
            $game = $this->gameService->createGame($createGameDto);
            $gameDto = $this->gameService->mapToDto($game);
        } catch (EntityNotFoundException $entityNotFoundException) {
            return $this->json($entityNotFoundException->getMessage());
        }

        return $this->json($gameDto);
    }

}
