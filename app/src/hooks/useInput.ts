import { useEffect, useState } from 'react';
import React from 'react';

const useInput = (validateInput: any, startingValue: string) => {
  const [initialValue] = useState(startingValue || '');
  const [enteredValue, setEnteredValue] = useState(startingValue);
  const [errorMessage, setErrorMessage] = useState('');
  const [isValid, setIsValid] = useState(errorMessage === '');
  const [isFocused, setToFocused] = useState(false);

  const setStartValue = () => {
    // console.log('Starting value is set to ' + startingValue);
    setEnteredValue(startingValue);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // console.log('Input change is being handled: enteredValue: ' + enteredValue);
    setEnteredValue(event.target.value);
    // setErrorMessage(validateInput(initialValue, enteredValue));
    // setIsValid(errorMessage == '');
  };

  const setIsFocused = (focused: boolean) => {
    // console.log('Element has been set to focus.');
    console.log('Input in focus: ', isFocused);
    setToFocused(focused);
  };

  const reset = () => {
    setEnteredValue(initialValue);
    setToFocused(false);
  };

  useEffect(() => {
    setErrorMessage(validateInput(initialValue, enteredValue));
    // setIsValid(errorMessage === '');

    // console.log(
    //   'Input Validation useEffect: enteredValue: ' +
    //     enteredValue +
    //     ': error message set to: ' +
    //     errorMessage,
    // );
  }, [enteredValue]);

  useEffect(() => {
    setIsValid(errorMessage === '');
    // console.log('IsValid set to: ' + isValid);
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
