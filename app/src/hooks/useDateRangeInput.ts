import { useEffect, useState } from 'react';
import { EventDate } from '../services/eventApi';

const useDateRangeInput = (
  initialStartDate: EventDate,
  initialEndDate: EventDate,
) => {
  const [startDate, setStartDate] = useState<EventDate>({
    date: initialStartDate.date,
  });
  const [endDate, setEndDate] = useState<EventDate>({
    date: initialEndDate.date,
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [isValid, setIsValid] = useState(errorMessage === '');

  const handleStartDateInputChange = (date: Date) => {
    // console.log('input date: ' + date);
    setStartDate({ date: new Date(date) });
  };

  const handleEndDateInputChange = (date: Date) => {
    setEndDate({ date: new Date(date) });
  };

  /**
   * Checks that the dates are in the future and end date is a date following
   * the start date.
   */
  const validateDateRange = () => {
    let errMsg = '';
    if (startDate && endDate) {
      // remove time from start and end date
      const startDate_notime = new Date(startDate.date).toDateString();
      const endDate_notime = new Date(endDate.date).toDateString();

      const epoch_startDate = new Date(startDate_notime);
      const epoch_endDate = new Date(endDate_notime);
      const today = new Date();

      // console.log('today: ' + today);
      // console.log('epoch_startDate: ' + epoch_startDate);
      // console.log('epoch_endDate: ' + epoch_endDate);

      if (epoch_startDate <= today) {
        errMsg += ' Event dates must be future dates.';
      } else if (epoch_startDate >= epoch_endDate) {
        errMsg += '\n End date must be a date after the start date.';
      }

      setErrorMessage(errMsg);
    }
  };

  useEffect(() => {
    if (startDate || endDate) {
      validateDateRange();
    }
  }, [startDate, endDate]);

  useEffect(() => {
    setIsValid(errorMessage === '');
  }, [validateDateRange]);

  return {
    startDateInput: startDate,
    endDateInput: endDate,
    handleStartDateInputChange,
    handleEndDateInputChange,
    errorMessage,
    isValid,
  };
};

export default useDateRangeInput;
