<?php

namespace App\Service;

use App\Dto\incoming\CreateUserDto;
use App\Dto\incoming\UpdateUserDto;
use App\Dto\outgoing\UserDto;
use App\Entity\User;
use App\Exception\EntityNotFoundException;
use App\Repository\RoleRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;

class UserService implements ObjectMapperInterface
{
    private EntityManagerInterface $entityManager;
    private UserRepository $userRepository;
    private RoleRepository $roleRepository;
    private LoggerInterface $logger;


    function __construct(EntityManagerInterface $entityManager,
                         UserRepository $userRepository,
                         RoleRepository $roleRepository,
                         LoggerInterface $logger) {

        $this->entityManager = $entityManager;
        $this->userRepository = $userRepository;
        $this->roleRepository = $roleRepository;
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
        $newUser->setRole($this->roleRepository->find($createUserDto->getRoleId()));
        $newUser->setBackgroundColor($createUserDto->getBackgroundColor());
        $newUser->setForegroundColor($createUserDto->getForegroundColor());

        #TODO catch/throw exception for a non-unique email address
        $this->userRepository->save($newUser, true);

        #retrieve the user, which should now have a userID value
        $newUser = $this->userRepository->findOneBy(['email' => $createUserDto->getEmail()]);
        if ($newUser != null) {
            return $newUser;
        }
        #TODO should I just return $newuser, would it return null if it can't find it?
        return null;
    }

    /**
     * @param int $user_id
     * @return User
     */
    public function getUserById(int $user_id): User
    {
        return $this->userRepository->find($user_id);
    }

    /**
     * @param string $username
     * @return User
     */
    public function getUserByUsername(string $username): User
    {
        return $this->userRepository->findOneBy(['username' => $username]);
    }

    /**
     * @param string $email
     * @return User
     */
    public function getUserByEmail(string $email): User
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

    #TODO what to return when error encountered

    /**
     * Updates a user, returns null if no user exists with the provided id.
     *
     * @param int $user_id
     * @param UpdateUserDto $updateUserDto
     * @return User|null
     * @throws EntityNotFoundException
     */
    public function updateUser(int $user_id, UpdateUserDto $updateUserDto): ?User
    {
        $email = $updateUserDto->getEmail();
        $username = $updateUserDto->getUsername() ?? null;
        $firstName = $updateUserDto->getFirstName() ?? null;
        $lastName = $updateUserDto->getLastName() ?? null;
        $role_id = $updateUserDto->getRoleId() ?? null;
        $backgroundColor = $updateUserDto->getBackgroundColor() ?? null;
        $foregroundColor = $updateUserDto->getForegroundColor() ?? null;

        $existing_user = $this->userRepository->find($user_id);
        if (!$existing_user) {
            throw new EntityNotFoundException(
                "ERROR: Unable to update user. User id #"
                . $user_id . " does not exist.");
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
            $role = $this->roleRepository->find($updateUserDto->getRoleId());
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
        $user = $this->userRepository->find($user_id);
        if (!$user) {
            return false;
        }

        $this->userRepository->remove($user, true);
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
