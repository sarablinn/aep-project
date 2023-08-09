<?php

namespace App\Service;

use App\Dto\incoming\CreateUserDto;
use App\Dto\incoming\UpdateUserDto;
use App\Dto\outgoing\UserDto;
use App\Entity\User;
use App\Exception\EntityNotFoundException;
use App\Repository\RoleRepository;
use App\Repository\UserRepository;
use Doctrine\DBAL\Exception\UniqueConstraintViolationException;
use Doctrine\ORM\EntityManagerInterface;
use phpDocumentor\Reflection\Types\Boolean;
use Psr\Log\LoggerInterface;

class UserService implements ObjectMapperInterface
{
    private EntityManagerInterface $entityManager;
    private UserRepository $userRepository;
    private RoleService $roleService;

    private LoggerInterface $logger;


    function __construct(EntityManagerInterface $entityManager,
                         UserRepository $userRepository,
                         RoleService $roleService,
                         LoggerInterface $logger) {

        $this->entityManager = $entityManager;
        $this->userRepository = $userRepository;
        $this->roleService = $roleService;
        $this->logger = $logger;
    }


    /**
     * @param CreateUserDto $createUserDto
     * @return ?User
     */
    public function createUser(CreateUserDto $createUserDto): ?User
    {
        #NOTE: EMAIL IS REQUIRED, it is unique too.
        $newUser = new User();
        $newUser->setUsername($createUserDto->getUsername());
        $newUser->setUserToken($createUserDto->getUserToken());
        $newUser->setFirstName($createUserDto->getFirstName());
        $newUser->setLastName($createUserDto->getLastName());
        $newUser->setEmail($createUserDto->getEmail());
        $newUser->setRole($this->roleService->getRole($createUserDto->getRoleId()));
        $newUser->setBackgroundColor($createUserDto->getBackgroundColor());
        $newUser->setForegroundColor($createUserDto->getForegroundColor());

        # if the username is already in use, append a number to the end of the
        # default username to make it unique
        if (!$this->isAvailableUsername($newUser->getUsername())) {
            $index = 0;
            $newUsername = $newUser->getUsername() . ($index +1);
            while (!$this->isAvailableUsername($newUsername)) {
                $index++;
                $newUsername = $newUser->getUsername() + $index;
            }
            $newUser->setUsername($newUsername);
        }

        $this->userRepository->save($newUser, true);

        #retrieve the user, which should now have a userID value
        return $this->getUserByEmail($createUserDto->getEmail());
    }

    /**
     * @param int $user_id
     * @return User | null
     */
    public function getUserById(int $user_id): ?User
    {
        return $this->userRepository->find($user_id);
    }

    /**
     * @param string $username
     * @return User | null
     */
    public function getUserByUsername(string $username): ?User
    {
        return $this->userRepository->findOneBy(['username' => $username]);
    }

    /**
     * @param string $email
     * @return User | null
     */
    public function getUserByEmail(string $email): ?User
    {
        return $this->userRepository->findOneBy(['email' => $email]);
    }

    /**
     * @param string $userToken
     * @return User|null
     */
    public function getUserByToken(string $userToken): ?User
    {
        return $this->userRepository->findOneBy(['user_token' => $userToken]);
    }

    /**
     * @return User[]
     */
    public function getUsers(): iterable
    {
        return $this->userRepository->findAll();
    }

    /**
     * Updates a user, returns null if no user exists with the provided id.
     *
     * @param int $user_id
     * @param UpdateUserDto $updateUserDto
     * @return User|null
     * @throws EntityNotFoundException
     */
    public function updateUserByUserId(int $user_id, UpdateUserDto $updateUserDto): ?User
    {
        $email = $updateUserDto->getEmail();
        $username = $updateUserDto->getUsername() ?? null;
        $userToken = $updateUserDto->getUserToken() ?? null;
        $firstName = $updateUserDto->getFirstName() ?? null;
        $lastName = $updateUserDto->getLastName() ?? null;
        $role_id = $updateUserDto->getRoleId() ?? null;
        $backgroundColor = $updateUserDto->getBackgroundColor() ?? null;
        $foregroundColor = $updateUserDto->getForegroundColor() ?? null;

        $existing_user = $this->getUserById($user_id);
        if (!$existing_user) {
            throw new EntityNotFoundException(
                "ERROR: Unable to update user. User id #"
                . $user_id . " does not exist.");
        }

        $role = $this->roleService->getRole($role_id);

        if ($email) {
            $existing_user->setEmail($email);
        }
        if ($username) {
            $existing_user->setUsername($username);
        }
        if ($userToken) {
            $existing_user->setUserToken($userToken);
        }
        if ($firstName) {
            $existing_user->setFirstName($firstName);
        }
        if ($lastName) {
            $existing_user->setLastName($lastName);
        }
        if ($role) {
            $existing_user->setRole($role);
        }
        if ($backgroundColor) {
            $existing_user->setBackgroundColor($backgroundColor);
        }
        if ($foregroundColor) {
            $existing_user->setForegroundColor($foregroundColor);
        }

        $this->userRepository->save($existing_user, true);

        return $existing_user;
    }

    /**
     * Updates a user, returns null if no user exists with the provided id.
     *
     * @param int $user_token
     * @param UpdateUserDto $updateUserDto
     * @return User|null
     * @throws EntityNotFoundException
     */
    public function updateUserByUserToken(int $user_token, UpdateUserDto $updateUserDto): ?User
    {
        $email = $updateUserDto->getEmail();
        $username = $updateUserDto->getUsername() ?? null;
        $userToken = $updateUserDto->getUserToken() ?? null;
        $firstName = $updateUserDto->getFirstName() ?? null;
        $lastName = $updateUserDto->getLastName() ?? null;
        $role_id = $updateUserDto->getRoleId() ?? null;
        $backgroundColor = $updateUserDto->getBackgroundColor() ?? null;
        $foregroundColor = $updateUserDto->getForegroundColor() ?? null;

        $existing_user = $this->getUserByToken($userToken);
        if (!$existing_user) {
            throw new EntityNotFoundException(
                "ERROR: Unable to update user. User token #"
                . $user_token . " does not exist.");
        }

        if ($email) {
            $existing_user->setEmail($email);
        }
        if ($username) {
            $existing_user->setUsername($username);
        }
        if ($firstName) {
            $existing_user->setFirstName($firstName);
        }
        if ($lastName) {
            $existing_user->setLastName($lastName);
        }
        if ($role_id) {
            $role = $this->roleService->getRole($updateUserDto->getRoleId());
            $existing_user->setRole($role);
        }
        if ($backgroundColor) {
            $existing_user->setBackgroundColor($backgroundColor);
        }
        if ($foregroundColor) {
            $existing_user->setForegroundColor($foregroundColor);
        }

        $this->userRepository->save($existing_user, true);

        return $existing_user;
    }

    /**
     * @param int $user_id
     * @return bool
     */
    public function deleteUser(int $user_id): bool
    {
        $user = $this->getUserById($user_id);
        if (!$user) {
            return false;
        }

        $this->userRepository->remove($user, true);
        return true;
    }

    /**
     * Checks if a given username is available or in use.
     * @param string $username
     * @return bool
     */
    public function isAvailableUsername(string $username): bool {
        $user = $this->getUserByUsername($username);

        if ($user) {
            return false;
        }
        return true;
    }


    ##################################################################################
    ####################### OBJECT MAPPER IMPLEMENTATIONS ############################
    ##################################################################################


    /**
     * @param User $object
     * @return UserDto
     */
    public function mapToDto($object): UserDto
    {
        $userDto = new UserDto;

        $userDto->setUserId($object->getUserId() ?? null);
        $userDto->setEmail($object->getEmail() ?? null);
        $userDto->setUserToken($object->getUserToken() ?? null);
        $userDto->setUsername($object->getUsername() ?? null);
        $userDto->setFirstName($object->getFirstName() ?? null);
        $userDto->setLastName($object->getLastName() ?? null);
        $userDto->setRoleId($object->getRole()->getRoleId() ?? null);
        $userDto->setBackgroundColor($object->getBackgroundColor() ?? null);
        $userDto->setForegroundColor($object->getForegroundColor() ?? null);


        return $userDto;
    }

    /**
     * @param User[] $users
     * @return UserDto[]
     */
    public function mapToDtos(array $users): array
    {
        $userDtos = [];

        foreach ($users as $user) {
            $userDtos[] = $this->mapToDto($user);
        }

        return $userDtos;
    }

}
