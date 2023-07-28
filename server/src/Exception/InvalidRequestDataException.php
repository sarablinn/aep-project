<?php

namespace App\Exception;

use Exception;

class InvalidRequestDataException extends Exception
{
    private string $validationErrors;

    public function __construct(string $validationErrors, $code = 0, Exception $previous = null)
    {
        $this->validationErrors = $validationErrors;
        parent::__construct('Request data is invalid', $code, $previous);
    }

    public function getValidationErrors(): string
    {
        return $this->validationErrors;
    }
}