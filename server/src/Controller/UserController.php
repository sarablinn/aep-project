<?php

namespace App\Controller;

use App\Dto\incoming\CreateRoleDto;
use App\Dto\incoming\CreateUserDto;
use App\Dto\incoming\UpdateRoleDto;
use App\Dto\incoming\UpdateUserDto;
use App\Dto\outgoing\UserDto;
use App\Exception\EntityNotFoundException;
use App\Exception\InvalidRequestDataException;
use App\Serialization\SerializationService;
use App\Service\RoleService;
use App\Service\UserService;
use JsonException;
use Symfony\Component\Config\Definition\Exception\DuplicateKeyException;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class UserController extends ApiController
{
    private UserService $userService;
    private RoleService $roleService;
    private SerializationService $serializationService;

    public function __construct(UserService $userService, RoleService $roleService,
                                SerializationService $serializationService)
    {
        parent::__construct($serializationService);

        $this->userService = $userService;
        $this->roleService = $roleService;
    }


    /**
     * @param string $user_id
     * @return Response
     */
    #[Route('/users/{user_id}', methods: ['GET'])]
    public function getInstance(string $user_id): Response
    {
        $user = $this->userService->getUserById($user_id);
        return $this->json($this->userService->mapToDto($user));
    }

    /**
     * @param string $userToken
     * @return Response
     */
    #[Route('/users/profile/{userToken}', methods: ['GET'])]
    public function getUserByToken(string $userToken): Response
    {
        $user = $this->userService->getUserByToken($userToken);
        return $this->json($this->userService->mapToDto($user));
    }

    /**
     * @return Response
     */
    #[Route('/users', methods: ('GET'))]
    public function getUsers(): Response
    {
        $users = $this->userService->getUsers();
        $userDtos = $this->userService->mapToDtos($users);
        return $this->json($userDtos);
    }

//    /**
//     * @throws InvalidRequestDataException|JsonException
//     */
//    #[Route('/users', methods: ('POST'))]
//    public function createUser(Request $request): Response
//    {
//        try {
//            /** @var CreateUserDto $createUserDto */
//            $createUserDto = $this->getValidatedDto($request, CreateUserDto::class);
//            $user = $this->userService->createUser($createUserDto);
//            $userDto = $this->userService->mapToDto($user);
//        } catch (DuplicateKeyException $exception) {
//            return $this->json("ERROR: Username or email already in use.",
//                409);
//        }
//
//        return $this->json($userDto);
//    }

    /**
     * @throws InvalidRequestDataException|JsonException
     */
    #[Route('/users', methods: ('POST'))]
    public function getOrCreateUser(Request $request): Response
    {
        /** @var CreateUserDto $createUserDto */
        $createUserDto = $this->getValidatedDto($request, CreateUserDto::class);
        $user = $this->userService->getUserByToken($createUserDto->getUserToken());

        if (!$user) {
            $user = $this->userService->createUser($createUserDto);
        }

        $userDto = $this->userService->mapToDto($user);
        return $this->json($userDto);
    }


    /**
     * Updates a user.
     *
     * Empty strings will be ignored but all fields must be present in the body of the request.
     *
     * @throws InvalidRequestDataException|JsonException
     */
    #[Route('/users/{user_id}', methods: ['PATCH', 'PUT'])]
    public function updateUser(string $user_id, Request $request): Response
    {
        try {
            /** @var UpdateUserDto $updateUserDto */
            $updateUserDto = $this->getValidatedDto($request, UpdateUserDto::class);
            $user = $this->userService->updateUser(intval($user_id), $updateUserDto);
            $userDto = $this->userService->mapToDto($user);

            return $this->json($userDto);
        } catch (EntityNotFoundException $exception) {
            return $this->json($exception->getMessage());
        }
    }

    /**
     * @param string $user_id
     * @return Response
     */
    #[Route('/users/{user_id}', methods: ['DELETE'])]
    public function deleteUser(string $user_id): Response
    {
        return $this->json($this->userService->deleteUser(intval($user_id)));
    }


    ###################################################################
    ############################  ROLE  ###############################
    ###################################################################

    /**
     * @param string $role_id
     * @return Response
     */
    #[Route('/roles/{role_id}', methods: ['GET'])]
    public function getRoleById(string $role_id): Response
    {
        $role = $this->roleService->getRole(intval($role_id));
        $roleDto = $this->roleService->mapToDto($role);
        return $this->json($roleDto);
    }

    /**
     * @return Response
     */
    #[Route('/roles', methods: ('GET'))]
    public function getRoles(): Response
    {
        $roles = $this->roleService->getRoles();
        $roleDtos = $this->roleService->mapToDtos($roles);
        return $this->json($roleDtos);
    }

    /**
     * @throws InvalidRequestDataException|JsonException
     */
    #[Route('/roles', methods: ('POST'))]
    public function createRole(Request $request): Response
    {
        /** @var CreateRoleDto $createRoleDto */
        $createRoleDto = $this->getValidatedDto($request, CreateRoleDto::class);

        return $this->json($this->roleService->createRole($createRoleDto));
    }

    /**
     * @throws EntityNotFoundException|InvalidRequestDataException|JsonException
     */
    #[Route('/roles/{role_id}', methods: ['PATCH', 'PUT'])]
    public function updateRole(string $role_id, Request $request): Response
    {
        /** @var UpdateRoleDto $updateRoleDto */
        $updateRoleDto = $this->getValidatedDto($request, UpdateRoleDto::class);
        $role = $this->roleService->updateRole(intval($role_id), $updateRoleDto);
        $roleDto = $this->roleService->mapToDto($role);

        return $this->json($roleDto);
    }

    /**
     * @param string $role_id
     * @return Response
     */
    #[Route('/roles/{role_id}', methods: ['DELETE'])]
    public function deleteRole(string $role_id): Response
    {
        return $this->json($this->roleService->deleteRole(intval($role_id)));
    }

}
