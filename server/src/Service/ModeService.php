<?php

namespace App\Service;

use App\Dto\incoming\CreateModeDto;
use App\Dto\incoming\UpdateModeDto;
use App\Dto\outgoing\ModeDto;
use App\Entity\Mode;
use App\Exception\EntityNotFoundException;
use App\Repository\ModeRepository;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;

class ModeService implements ObjectMapperInterface
{
    private EntityManagerInterface $entityManager;
    private ModeRepository $modeRepository;
    private LoggerInterface $logger;

    function __construct(EntityManagerInterface $entityManager,
                        ModeRepository $modeRepository,
                        LoggerInterface $logger)
    {
        $this->entityManager = $entityManager;
        $this->modeRepository = $modeRepository;
        $this->logger = $logger;
    }

    /**
     * @param int $mode_id
     * @return Mode|null
     */
    public function getMode(int $mode_id): ?Mode
    {
        return $this->modeRepository->find($mode_id);
    }

    /**
     * @return Mode[]
     */
    public function getModes(): iterable
    {
        return $this->modeRepository->findAll();
    }

    /**
     * @param CreateModeDto $createModeDto
     * @return Mode|null
     */
    public function createMode(CreateModeDto $createModeDto): ?Mode
    {
        $newMode = new Mode();
        $newMode->setModeName($createModeDto->getModeName());
        $this->modeRepository->save($newMode, true);

        return $this->modeRepository->findOneBy(['mode_name' => $createModeDto->getModeName()]);
    }

    /**
     * @param int $mode_id
     * @param UpdateModeDto $updateModeDto
     * @return Mode|null
     * @throws EntityNotFoundException
     */
    public function updateMode(int $mode_id, UpdateModeDto $updateModeDto): ?Mode
    {
        $existing_mode = $this->modeRepository->find($mode_id);
        if (!$existing_mode) {
            throw new EntityNotFoundException("ERROR: There is no mode with id ["
                . $mode_id . "] to update.");
        }

        $mode_name = $updateModeDto->getModeName();
        if ($mode_name) {
            $existing_mode->setModeName($mode_name);
        }

        $this->modeRepository->save($existing_mode, true);

        return $existing_mode;
    }

    /**
     * @param int $mode_id
     * @return bool
     */
    public function deleteMode(int $mode_id): bool
    {
        $existing_mode = $this->modeRepository->find($mode_id);
        if (!$existing_mode) {
            return false;
        }

        $this->modeRepository->remove($existing_mode, true);

        return true;
    }

    ##################################################################################
    ####################### OBJECT MAPPER IMPLEMENTATIONS ############################
    ##################################################################################

    /**
     * @param Mode $object
     * @return ModeDto
     */
    public function mapToDto($object): ModeDto
    {
        $modeDto = new ModeDto();

        $modeDto->setModeId($object->getModeId());
        $modeDto->setModeName($object->getModeName());
        $modeDto->setTimeLimit($object->getTimeLimit());

        return $modeDto;
    }

    /**
     * @param Mode[] $modes
     * @return array
     */
    public function mapToDtos(array $modes): array {
        $modeDtos = [];
        foreach ($modes as $mode) {
            $modeDtos[] = $this->mapToDto($mode);
        }

        return $modeDtos;
    }

}
