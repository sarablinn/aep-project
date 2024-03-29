<?php

namespace App\Service;

use App\Dto\incoming\CreateGameDto;
use App\Dto\incoming\UpdateGameDto;
use App\Dto\outgoing\EventDto;
use App\Dto\outgoing\GameDto;
use App\Dto\outgoing\ModeGamesDto;
use App\Entity\Game;
use App\Exception\EntityNotFoundException;
use App\Repository\EventRepository;
use App\Repository\GameRepository;
use App\Repository\ModeRepository;
use App\Repository\UserRepository;
use DateTime;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Psr\Log\LoggerInterface;

class GameService implements ObjectMapperInterface
{
    private EntityManagerInterface $entityManager;
    private GameRepository $gameRepository;
    private UserRepository $userRepository;
    private ModeRepository $modeRepository;
    private EventRepository $eventRepository;
    private UserService $userService;
    private ModeService $modeService;
    private LoggerInterface $logger;

    function __construct(EntityManagerInterface $entityManager,
                         GameRepository $gameRepository,
                         UserRepository $userRepository,
                         ModeRepository $modeRepository,
                         EventRepository $eventRepository,
                         UserService $userService,
                         ModeService $modeService,
                         LoggerInterface $logger)
    {
        $this->entityManager = $entityManager;
        $this->gameRepository = $gameRepository;
        $this->userRepository = $userRepository;
        $this->modeRepository = $modeRepository;
        $this->eventRepository = $eventRepository;
        $this->userService = $userService;
        $this->modeService = $modeService;
        $this->logger = $logger;
    }

    /**
     * @param int $game_id
     * @return Game|null
     */
    public function getGame(int $game_id): ?Game
    {
        return $this->gameRepository->find($game_id);
    }

    /**
     * @return Game[]
     */
    public function getAllGames(): iterable
    {
        return $this->gameRepository->findAll();
    }

    /**
     * @param int $user_id
     * @return Game[]
     */
    public function getGamesByUser(int $user_id): iterable
    {
        return $this->gameRepository->findBy(['player_user_id' => $user_id]);
    }

    /**
     * @param CreateGameDto $createGameDto
     * @return Game|null
     * @throws EntityNotFoundException
     */
    public function createGame(CreateGameDto $createGameDto): ?Game
    {
        $newGame = new Game();

        $user_player = $this->userRepository->findOneBy(['user_token' => $createGameDto->getUserToken()]);
        if (!$user_player) {
            throw new EntityNotFoundException('ERROR: Unable to '
                . 'new Game. Player token #' . $createGameDto->getUserToken()
                . ' does not yet exist.');
        }

        $game_mode = $this->modeRepository->find($createGameDto->getModeId());
        if (!$game_mode) {
            throw new EntityNotFoundException('ERROR: Unable to '
                . 'new Game. Mode id #' . $createGameDto->getModeId());
        }

        $newGame->setUser($user_player);
        $newGame->setMode($game_mode);
        $newGame->setScore($createGameDto->getScore());

        $date = null;
        try {
            $unix_timestamp = strval($createGameDto->getTimestamp());
            $date = new DateTime("@{$unix_timestamp}");
            $newGame->setTimestamp($date);
        } catch (Exception $exception) {
            return null;
        }

        // check that the game doesn't already exist, if not, add it, retrieve it and return it
        $existing_game = $this->gameRepository->findOneBy([
                'timestamp' => $date,
                'score' => $createGameDto->getScore(),
                'user' => $user_player->getUserId(),
                'mode' => $createGameDto->getModeId()]
        );

        if ($existing_game) {
            return $existing_game;
        } else {
            $this->gameRepository->save($newGame, true);

            return $this->gameRepository->findOneBy([
                    'user' => $user_player->getUserId(),
                    'timestamp' => $date]
            );
        }
    }

    /**
     * @param int $game_id
     * @param UpdateGameDto $updateGameDto
     * @return Game|null
     * @throws EntityNotFoundException
     */
    public function updateGame(int $game_id, UpdateGameDto $updateGameDto): ?Game {
        $existing_game = $this->gameRepository->find($game_id);
        if (!$existing_game) {
            throw new EntityNotFoundException('ERROR: Unable to update game. '
                . 'No existing game to update.');
        }

        $user_player = $this->userRepository->find($updateGameDto->getUserId());
        $game_mode = $this->modeRepository->find($updateGameDto->getModeId());
        $timestamp = $updateGameDto->getTimestamp();
        $score = $updateGameDto->getScore();

        if ($user_player) {
            $existing_game->setUser($user_player);
        }
        if ($game_mode) {
            $existing_game->setMode($game_mode);
        }
        if ($timestamp) {
            $date = new DateTime();
            $date->setTimestamp($timestamp);
            $existing_game->setTimestamp($date);
        }
        if ($score) {
            $existing_game->setScore($score);
        }

        $this->gameRepository->save($existing_game, true);

        return $existing_game;
    }

    /**
     * @param int $game_id
     * @return bool
     */
    public function deleteGame(int $game_id): bool
    {
        $game = $this->gameRepository->find($game_id);
        if (!$game) {
            return false;
        }

        $this->gameRepository->remove($game, true);
        return true;
    }

    /**
     * @return Game[]
     */
    public function getGamesOrderedByScore(): iterable {
        return $this->gameRepository->findBy([], ['score' => 'DESC']);
    }

    /**
     * Returns a single array of games played in the specified mode,
     * by score in descending order.
     * @param int $mode_id
     * @return Game []
     */
    public function getGamesByMode(int $mode_id): iterable {
        return $this->gameRepository->findBy(
            ['mode' => $mode_id], ['score' => 'DESC']);
    }

    /**
     * Returns an associative array containing arrays of GameDtos,
     * indexed by mode ids, and ordered by score in descending order.
     * @return ModeGamesDto
     */
    public function getAllGamesByModes(): ModeGamesDto {
        $dto_games_by_mode = new ModeGamesDto();


        $modes = $this->modeRepository->findAll();
        if ($modes) {
            foreach ($modes as $mode) {
                $mode_id = $mode->getModeId();
                $modeGames = $this->gameRepository->findBy(
                    ['mode' => $mode_id], ['score' => 'DESC']);

                $dtoModeGames = $this->mapToDtos($modeGames);
                $dto_games_by_mode->addGames($dtoModeGames);
            }
        }

        return $dto_games_by_mode;
    }


    ##################################################################################
    ####################### OBJECT MAPPER IMPLEMENTATIONS ############################
    ##################################################################################


    /**
     * @param Game $object
     * @return GameDto
     */
    public function mapToDto($object): GameDto
    {
        $gameDto = new GameDto();

        $user = $object->getUser();
        $userDto = null;
        if ($user) {
            $userDto = $this->userService->mapToDto($user);
        }

        $mode = $object->getMode();
        $modeDto = null;
        if ($mode) {
            $modeDto = $this->modeService->mapToDto($mode);
        }

        $gameDto->setGameId($object->getGameId() ?? null);
        $gameDto->setUser($userDto);
        $gameDto->setMode($modeDto);
        $gameDto->setTimestamp($object->getTimestamp() ?? null);
        $gameDto->setScore($object->getScore() ?? null);

        return $gameDto;
    }

    /**
     * @param Game[] $games
     * @return GameDto[]
     */
    public function mapToDtos(array $games): array
    {
        $gameDtos = [];

        foreach ($games as $game) {
            $gameDtos[] = $this->mapToDto($game);
        }

        return $gameDtos;
    }

}
