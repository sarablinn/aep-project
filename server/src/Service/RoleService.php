<?php

namespace App\Service;

use App\Dto\incoming\CreateRoleDto;
use App\Dto\incoming\UpdateRoleDto;
use App\Dto\outgoing\RoleDto;
use App\Entity\Role;
use App\Exception\EntityNotFoundException;
use App\Repository\RoleRepository;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;

class RoleService implements ObjectMapperInterface
{
    private EntityManagerInterface $entityManager;
    private RoleRepository $roleRepository;
    private LoggerInterface $logger;


    function __construct(EntityManagerInterface $entityManager,
                         RoleRepository $roleRepository,
                         LoggerInterface $logger)
    {
        $this->entityManager = $entityManager;
        $this->roleRepository = $roleRepository;
        $this->logger = $logger;
    }

    /**
     * @param int $role_id
     * @return Role|null
     */
    public function getRole(int $role_id): ?Role
    {
        return $this->roleRepository->find($role_id);
    }

    /**
     * @return Role[]
     */
    public function getRoles(): iterable
    {
        return $this->roleRepository->findAll();
    }

    /**
     * @param CreateRoleDto $createRoleDto
     * @return Role|null
     */
    public function createRole(CreateRoleDto $createRoleDto): ?Role
    {
        $newRole = new Role();
        $newRole->setRoleName($createRoleDto->getRoleName());
        $this->roleRepository->save($newRole, true);

        return $this->roleRepository->findOneBy(['role_name' => $createRoleDto->getRoleName()]);
    }

    /**
     * @param int $role_id
     * @param UpdateRoleDto $updateRoleDto
     * @return Role|null
     * @throws EntityNotFoundException
     */
    public function updateRole(int $role_id, UpdateRoleDto $updateRoleDto): ?Role
    {
        $existing_role = $this->roleRepository->find($role_id);
        if (!$existing_role) {
            throw new EntityNotFoundException("Error: There is no role with ID ["
                . $role_id . "] to update.");
        }

        $role_name = $updateRoleDto->getRoleName();
        if ($role_name) {
            $existing_role->setRoleName($role_name);
        }

        $this->roleRepository->save($existing_role, true);

        return $existing_role;
    }

    /**
     * @param int $role_id
     * @return bool
     */
    public function deleteRole(int $role_id): bool
    {
        $existing_role = $this->roleRepository->find($role_id);
        if (!$existing_role) {
            return false;
        }

        $this->roleRepository->remove($existing_role, true);

        return true;
    }

    ##################################################################################
    ####################### OBJECT MAPPER IMPLEMENTATIONS ############################
    ##################################################################################

    /**
     * @param Role $object
     * @return RoleDto
     */
    public function mapToDto($object): RoleDto
    {
        $roleDto = new RoleDto();

        $roleDto->setRoleId($object->getRoleId());
        $roleDto->setRoleName($object->getRoleName());

        return $roleDto;
    }

    /**
     * @param Role[] $roles
     * @return array
     */
    public function mapToDtos(array $roles): array
    {
        $roleDtos = [];
        foreach ($roles as $role) {
            $roleDtos[] = $role;
        }

        return $roleDtos;
    }

}
