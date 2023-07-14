import { createEvent, EventDate, EventDto } from '../../services/eventApi';
import { useMutation } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { selectedUser } from '../../services/Atoms';
import { useAtom } from 'jotai';
import useDateRangeInput from '../../hooks/useDateRangeInput';
import useInput from '../../hooks/useInput';

export type CreateEventPopupProps = {
  showPopup: boolean;
};

const CreateEventPopup = ({ showPopup }: CreateEventPopupProps) => {
  const [currentUser] = useAtom(selectedUser);
  const [showModal, setShowModal] = useState(showPopup);

  const [eventName, setEventName] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<EventDate>({
    date: new Date(),
  });
  const [endDate, setEndDate] = useState<EventDate>({ date: new Date() });

  const [eventNameErrorState, setEventNameErrorState] = useState('hidden');
  const [dateRangeErrorState, setDateRangeErrorState] = useState('hidden');

  const handleEventNameChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setEventName(event.target.value);
  };

  const validateEventName = (initialValue: string, event_name: string) => {
    const errMsg = '';
    if (event_name.trim().length === 0) {
      return ' Event name required.';
    }

    return errMsg;
    // optionally add validation to check for duplicate events
  };

  const {
    input: eventNameInput,
    handleInputChange: handleEventNameInputChange,
    errorMessage: eventNameErrorMessage,
    isValid: isValidEventName,
  } = useInput(validateEventName, eventName || '');

  const {
    startDateInput,
    endDateInput,
    handleStartDateInputChange,
    handleEndDateInputChange,
    errorMessage: dateRangeErrorMessage,
    isValid: isValidDateRange,
  } = useDateRangeInput(startDate, endDate);

  useEffect(() => {
    if (isValidEventName) {
      setEventNameErrorState('hidden');
    } else if (!isValidEventName) {
      setEventNameErrorState('visible');
    }
  }, [isValidEventName]);

  useEffect(() => {
    if (dateRangeErrorMessage === '') {
      setDateRangeErrorState('hidden');
    } else if (dateRangeErrorMessage != '') {
      setDateRangeErrorState('visible');
    }
  }, [isValidDateRange]);

  const {
    data: createdEventResults,
    mutate: createEventMutation,
    isLoading: loadingCreateEvent,
  } = useMutation({
    mutationFn: (eventDto: EventDto) => createEvent(eventDto),
    onMutate: () => console.log('EventsPage: Mutate: createEventMutation'),
    onError: (err, variables, context) => {
      console.log(err, variables, context);
    },
    onSuccess: data => {
      console.log('EventsPage: Success: createEventMutation:', data);
    },
    onSettled: () => console.log('EventsPage: Settled: createEventMutation.'),
  });

  const saveChangesAndReload = () => {
    if (eventName && startDate && endDate) {
      const eventDto: EventDto = {
        eventName: eventName,
        startDate: startDateInput.date.getTime().toString(),
        endDate: endDateInput.date.getTime().toString(),
        eventCreatorUserId: currentUser.userId,
      };

      createEventMutation(eventDto);
    }

    window.location.reload();
  };

  return (
    <>
      {showModal ? (
        <div>
          <>
            <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none">
              <div className="relative mx-auto my-6 w-auto max-w-3xl">
                {/*content*/}
                <div className="relative flex w-full flex-col rounded-lg border-0 bg-white shadow-lg outline-none focus:outline-none">
                  {/*header*/}
                  <h2 className="mb-1 bg-pink-500 px-6 py-3 text-center text-sm font-bold uppercase text-white">
                    Create New Event
                  </h2>
                  <div className="m-3 p-3">
                    <form>
                      <div className="flex py-4">
                        <div className="w-40 min-w-max pr-3">
                          <label htmlFor="event-name-input">Event Name: </label>
                        </div>
                        <div>
                          <input
                            className={
                              eventNameErrorMessage != ''
                                ? 'rounded-sm border border-2 border-red-600'
                                : 'rounded-sm border border-gray-500'
                            }
                            type="text"
                            name="event-name-input"
                            value={eventNameInput || ''}
                            onChange={handleEventNameInputChange}
                            onBlur={handleEventNameChange}
                            required
                          ></input>
                          {eventNameErrorMessage != '' ? (
                            <span className="text-red-600"> *</span>
                          ) : (
                            <></>
                          )}
                        </div>
                      </div>

                      <div className="flex py-4">
                        <div className="w-40 min-w-max pr-3">
                          <label htmlFor="start-date-input">Start Date: </label>
                        </div>
                        <div>
                          <DatePicker
                            showIcon
                            className={
                              dateRangeErrorMessage != ''
                                ? 'rounded-sm border border-2 border-red-600'
                                : 'rounded-sm border border-gray-500'
                            }
                            name="start-date-input"
                            selected={startDateInput.date}
                            onChange={date => {
                              date ? handleStartDateInputChange(date) : null;
                            }}
                          />
                        </div>
                      </div>

                      <div className="flex py-4">
                        <div className="w-40 min-w-max pr-3">
                          <label htmlFor="end-date-input">End Date: </label>
                        </div>
                        <div>
                          <DatePicker
                            showIcon
                            className={
                              dateRangeErrorMessage != ''
                                ? 'rounded-sm border border-2 border-red-600'
                                : 'rounded-sm border border-gray-500'
                            }
                            name="end-date-input"
                            selected={endDateInput.date}
                            onChange={date => {
                              date ? handleEndDateInputChange(date) : null;
                            }}
                          />
                        </div>
                      </div>

                      <div className="flex flex-col py-4">
                        {dateRangeErrorMessage != '' ? (
                          <div
                            className="relative mb-1 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700"
                            role="alert"
                            style={{
                              visibility: eventNameErrorState || 'hidden',
                            }}
                          >
                            <strong className="font-bold">Error:</strong>
                            <span className="block sm:inline">
                              {eventNameErrorMessage}
                            </span>
                            <span className="absolute bottom-0 right-0 top-0 px-4 py-3">
                              <svg
                                className="h-6 w-6 fill-current text-red-500"
                                role="button"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                              ></svg>
                            </span>
                          </div>
                        ) : (
                          <></>
                        )}

                        {dateRangeErrorMessage != '' ? (
                          <div
                            className="relative mb-1 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700"
                            role="alert"
                            style={{
                              visibility: dateRangeErrorState || 'hidden',
                            }}
                          >
                            <strong className="font-bold">Error:</strong>
                            <span className="block sm:inline">
                              {dateRangeErrorMessage}
                            </span>
                            <span className="absolute bottom-0 right-0 top-0 px-4 py-3">
                              <svg
                                className="h-6 w-6 fill-current text-red-500"
                                role="button"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                              ></svg>
                            </span>
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>
                    </form>
                  </div>
                  <div className="flex self-center pb-3">
                    <button
                      className="background-transparent mb-1 mr-1 px-6 py-2 text-sm font-bold uppercase text-red-500 outline-none transition-all duration-150 ease-linear focus:outline-none"
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        window.location.reload();
                      }}
                    >
                      Close
                    </button>
                    <button
                      className="mb-1 mr-1 rounded bg-emerald-500 px-6 py-3 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-emerald-600"
                      type="button"
                      onClick={() => saveChangesAndReload()}
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
          </>
        </div>
      ) : null}
    </>
  );
};

export default CreateEventPopup;
