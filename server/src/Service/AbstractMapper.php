<?php

namespace App\Service;

abstract class AbstractMapper implements ObjectMapperInterface
{

    public function mapFromEntities(iterable $objects): iterable
    {
        $dto =[];

        foreach ($objects as $object) {
            $dto[] = $this->mapFromEntity($object);
        }

        return $dto;
    }

    public function mapToEntities(iterable $objects): iterable
    {
        $entities =[];

        foreach ($objects as $object) {
            $dto[] = $this->mapToEntity($object);
        }

        return $entities;
    }
}
