<?php

namespace App\Controller;

use App\Dto\incoming\CreateGameDto;
use App\Exception\EntityNotFoundException;
use App\Exception\InvalidRequestDataException;
use App\Serialization\SerializationService;
use App\Service\GameService;
use App\Service\ModeService;
use Exception;
use JsonException;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class GameController extends ApiController
{
    private GameService $gameService;
    private ModeService $modeService;
    private SerializationService $serializationService;

    public function __construct(GameService $gameService,
                                ModeService $modeService,
                                SerializationService $serializationService)
    {
        parent::__construct($serializationService);

        $this->gameService = $gameService;
        $this->modeService = $modeService;
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
     * @return Response
     */
    #[Route('/games/topscores', methods: ['GET'])]
    public function getAllGamesOrderedByScore(): Response
    {
        $games = $this->gameService->getGamesOrderedByScore();
        $gameDtos = $this->gameService->mapToDtos($games);
        return $this->json($gameDtos);
    }

    /**
     * Returns an associative array containing arrays of games,
     * indexed by mode ids, and ordered by score in descending order.
     * @param string $mode_id
     * @return Response
     */
    #[Route('/games/topscores/modes/{mode_id}', methods: ['GET'])]
    public function getGamesByMode(string $mode_id): Response
    {

        $games = $this->gameService->getGamesByMode($mode_id);
        $gameDtos = $this->gameService->mapToDtos($games);

        return $this->json($gameDtos);
    }

    /**
     * Returns an associative array containing arrays of GameDtos,
     * indexed by mode ids, and ordered by score in descending order.
     * @return Response
     */
    #[Route('/games/topscores/modes', methods: ['GET'])]
    public function getAllGamesByModes(): Response
    {
        $dtoModeGames = $this->gameService->getAllGamesByModes();
        return $this->json($dtoModeGames);
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

    /**
     * @return Response
     */
    #[Route('/modes', methods: ['GET'])]
    public function getModes(): Response {
        $modes = $this->modeService->getModes();
        $modeDtos = $this->modeService->mapToDtos($modes);
        return $this->json($modeDtos);
    }

}
