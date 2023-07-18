import Loading from '../../utilities/Loading';
import ErrorMessage from '../../utilities/ErrorMessage';
import { useQuery } from '@tanstack/react-query';
import { getModes, ModeResource } from '../../services/modeApi';
import { useState } from 'react';
import GameComponent from './GameComponent';
import { useAuth0 } from '@auth0/auth0-react';
import { EventResource, getCurrentEvents } from '../../services/eventApi';
import { useAtom } from 'jotai';
import { selectedUser } from '../../services/Atoms';

const GameSettingsPage = () => {
  const [selectedMode, setSelectedMode] = useState<ModeResource | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<
    EventResource | null | undefined
  >(undefined);
  const { user } = useAuth0();
  const [currentUser] = useAtom(selectedUser);

  const {
    isLoading: isLoadingModes,
    error: modesError,
    data: modesData,
  } = useQuery({
    queryKey: [`modes`],
    queryFn: () => getModes(),
  });

  const {
    isLoading: isLoadingEvents,
    error: eventsError,
    data: currentEventsData,
  } = useQuery({
    queryKey: [`events`],
    queryFn: () => getCurrentEvents(),
  });

  const isSelectedEvent = (eventResource: EventResource | null) => {
    return eventResource === selectedEvent;
  };

  if (isLoadingModes || isLoadingEvents) {
    return (
      <div>
        <Loading />
      </div>
    );
  } else if (modesError || eventsError) {
    return (
      <div>
        <ErrorMessage
          errorMessage={'An error has occurred while loading game settings.'}
        />
      </div>
    );
  } else if (modesData != undefined && !selectedMode) {
    if (user && currentEventsData) {
      return (
        <div>
          <div
            className="mt-10 text-center font-bold"
            style={{
              color: currentUser.foregroundColor,
              fontSize: '2rem',
            }}
          >
            <h1>SELECT AN EVENT</h1>
          </div>
          <div className="container-fluid m-5 flex justify-center p-5">
            <div
              className="p-10"
              style={{
                backgroundColor: currentUser.backgroundColor,
                border: '3px solid',
                borderRadius: '20px',
                borderColor: currentUser.foregroundColor,
              }}
            >
              {currentEventsData.map((eventResource, index) => (
                <button
                  key={'mode-' + index}
                  value={index}
                  className={
                    isSelectedEvent(eventResource)
                      ? 'isActive m-1 bg-pink-600 p-3 font-bold text-white hover:shadow-lg focus:outline-none active:bg-pink-600'
                      : 'm-1 bg-pink-500 p-3 font-bold text-white hover:shadow-lg focus:outline-none active:bg-pink-600'
                  }
                  onClick={() => {
                    setSelectedEvent(eventResource);
                  }}
                >
                  {eventResource.eventName}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-2 flex justify-center">
            <button
              className={
                isSelectedEvent(null)
                  ? 'isActive m-1 bg-pink-600 p-3 font-bold text-white hover:shadow-lg focus:outline-none active:bg-pink-600'
                  : 'm-1 bg-pink-500 p-3 font-bold text-white hover:shadow-lg focus:outline-none active:bg-pink-600'
              }
              onClick={() => {
                setSelectedEvent(null);
              }}
            >
              NO EVENT
            </button>
          </div>
          {selectedEvent != undefined || selectedEvent === null ? (
            <div className="container-fluid m-5 flex justify-center p-5">
              <div
                className="p-10"
                style={{
                  backgroundColor: currentUser.backgroundColor,
                  border: '3px solid',
                  borderRadius: '20px',
                  borderColor: currentUser.foregroundColor,
                }}
              >
                {modesData.map((mode, index) => (
                  <button
                    key={'mode-' + index}
                    value={index}
                    className="m-1 bg-pink-500 p-3 font-bold text-white"
                    onClick={() => {
                      setSelectedMode(mode);
                    }}
                  >
                    {mode.modeName}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      );
    } else {
      return (
        <div className="container-fluid m-5 p-5">
          {modesData.map((mode, index) => (
            <button
              key={'mode-' + index}
              value={index}
              className="m-1 bg-pink-500 p-3 font-bold text-white"
              onClick={() => {
                setSelectedMode(mode);
              }}
            >
              {mode.modeName}
            </button>
          ))}
        </div>
      );
    }
  } else if (selectedMode) {
    return (
      <GameComponent
        selected_mode={selectedMode}
        selected_event={selectedEvent}
        user={user}
      />
    );
  }
  return <></>;
};

export default GameSettingsPage;
