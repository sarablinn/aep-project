<?php

namespace App\Serialization;

use JsonException;
use App\Exception\InvalidRequestDataException;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\Request;

class SerializationService
{
    private LoggerInterface $logger;
    private JsonSerializer $jsonSerializer;
    private ObjectValidator $objectValidator;

    public function __construct(
        LoggerInterface $logger,
        JsonSerializer $jsonSerializer,
        ObjectValidator $objectValidator
    ) {
        $this->logger = $logger;
        $this->jsonSerializer = $jsonSerializer;
        $this->objectValidator = $objectValidator;
    }


    /**
     * Returns a DTO, of a specified class, from the JSON content of a Request.
     *
     * @param Request $request
     * @param string $class
     * @return object
     * @throws InvalidRequestDataException
     * @throws JsonException
     */
    public function getValidatedDto(Request $request, string $class): object
    {
        /** @var string $requestContent */
        $requestContent = $request->getContent();
        $dto = $this->jsonSerializer->deserialize($requestContent, $class);

        if ($validationErrors = $this->objectValidator->getValidationErrorsJson($dto)) {
            throw new InvalidRequestDataException($validationErrors);
        }

        return $dto;
    }

}
