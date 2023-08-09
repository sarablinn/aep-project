import { useEffect, useState } from 'react';
import React from 'react';

const useInput = (validateInput: any, startingValue: string) => {
  const [initialValue] = useState(startingValue || '');
  const [enteredValue, setEnteredValue] = useState(startingValue);
  const [errorMessage, setErrorMessage] = useState('');
  const [isValid, setIsValid] = useState(errorMessage === '');
  const [isFocused, setToFocused] = useState(false);

  const setStartValue = () => {
    setEnteredValue(startingValue);
    setEnteredValue(startingValue);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEnteredValue(event.target.value);
  };

  const setIsFocused = (focused: boolean) => {
    console.log('Input in focus: ', isFocused);
    setToFocused(focused);
  };

  const reset = () => {
    setEnteredValue(initialValue);
    setToFocused(false);
  };

  useEffect(() => {
    setErrorMessage(validateInput(initialValue, enteredValue));
  }, [enteredValue]);

  useEffect(() => {
    setIsValid(errorMessage === '');
  }, [errorMessage]);

  return {
    input: enteredValue,
    setStartValue,
    handleInputChange,
    setIsFocused,
    errorMessage,
    isValid,
    reset,
  };
};

export default useInput;
