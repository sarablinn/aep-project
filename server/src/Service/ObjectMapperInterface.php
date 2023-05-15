<?php

namespace App\Service;

/**
 *
 *  ObjectTransformer interface provides methods for converting objects.
 */
interface ObjectMapperInterface
{
    /**
     * Returns a DTO from an entity counterpart.
     * @param $object
     * @return mixed
     */
    public function mapToDto($object): mixed;

//    /**
//     * Returns an entity from a DTO.
//     * @param $object
//     * @return mixed
//     */
//    public function mapToEntity($object): mixed;

}
