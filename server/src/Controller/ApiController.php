<?php

namespace App\Controller;

use App\Exception\InvalidRequestDataException;
use App\Serialization\SerializationService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use JsonException;

class ApiController extends AbstractController
{
    private SerializationService $serializationService;

    public function __construct(SerializationService $serializationService) {
        $this->serializationService = $serializationService;
    }

    /**
     * provides the dto validation service used by all the controllers
     * @throws InvalidRequestDataException
     * @throws JsonException
     */
    protected function getValidatedDto(Request $request, string $class): object
    {
        return $this->serializationService->getValidatedDto($request, $class);
    }
}
