<?php

namespace App\Serialization;

use Doctrine\Common\Annotations\AnnotationReader;
use Symfony\Component\PropertyInfo\Extractor\PhpDocExtractor;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Mapping\ClassDiscriminatorFromClassMetadata;
use Symfony\Component\Serializer\Mapping\Factory\ClassMetadataFactory;
use Symfony\Component\Serializer\Mapping\Loader\AnnotationLoader;
use Symfony\Component\Serializer\Normalizer\AbstractObjectNormalizer;
use Symfony\Component\Serializer\Normalizer\ArrayDenormalizer;
use Symfony\Component\Serializer\Normalizer\DateTimeNormalizer;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;

/** @codeCoverageIgnore Copied from reference project */
class JsonSerializer
{
    private const FORMAT_JSON = 'json';

    private Serializer $serializer;

    public function __construct()
    {
        $classMetadataFactory = new ClassMetadataFactory(new AnnotationLoader(new AnnotationReader()));
        $classDiscriminator = new ClassDiscriminatorFromClassMetadata($classMetadataFactory);
        $objectNormalizer = new ObjectNormalizer(
            $classMetadataFactory,
            null,
            null,
            new PhpDocExtractor(),
            $classDiscriminator
        );

        $this->serializer = new Serializer(
            [new ArrayDenormalizer(), new DateTimeNormalizer(), $objectNormalizer],
            [new JsonEncoder()]
        );
    }

    /**
     * Returns a JSON string representation of the given object.
     * @param mixed $object
     * @return string
     */
    public function serialize(mixed $object): string
    {
        return $this->serializer->serialize(
            $object,
            self::FORMAT_JSON,
            [AbstractObjectNormalizer::SKIP_NULL_VALUES => true]
        );
    }

    /**
     * Returns the object deserialized from the JSON string.
     * @param string $json
     * @param string $class
     * @return object
     */
    public function deserialize(string $json, string $class): object
    {
        return $this->serializer->deserialize($json, $class, self::FORMAT_JSON);
    }
}
