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
import GameDemo from './GameDemo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const GameSettingsPage = () => {
  const [selectedMode, setSelectedMode] = useState<ModeResource | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<
    EventResource | null | undefined
  >(undefined);
  const { user } = useAuth0();
  const [currentUser] = useAtom(selectedUser);

  const [showDemo, setShowDemo] = useState(false);
  const [startGame, setStartGame] = useState(false);

  const handleShowDemo = () => {
    setShowDemo(true);
  };
  const handleCloseDemo = () => {
    setShowDemo(false);
  };
  const handleStartGame = () => {
    setStartGame(true);
  };

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

  const isSelectedMode = (modeResource: ModeResource | null) => {
    return modeResource === selectedMode;
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
  } else if (modesData != undefined) {
    {
      // modes are loaded, allow USER to begin choosing settings
      // allow USER to select an event from current events
    }
    if (selectedMode && startGame) {
      return (
        <GameComponent
          selected_mode={selectedMode}
          selected_event={selectedEvent}
          user={user}
        />
      );
    } else if (user && currentEventsData && !startGame) {
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

          <div className="container-fluid flex justify-center">
            <div
              className="m-5 flex w-max flex-col justify-center p-5"
              style={{
                backgroundColor: currentUser.backgroundColor,
                border: '3px solid',
                borderRadius: '20px',
                borderColor: currentUser.foregroundColor,
              }}
            >
              <div className="p-10" style={{}}>
                {currentEventsData.map((eventResource, index) => (
                  <button
                    key={'mode-' + index}
                    value={index}
                    className={
                      isSelectedEvent(eventResource)
                        ? 'isActive m-1 rounded bg-pink-600 p-3 font-bold text-white hover:shadow-lg focus:outline-none active:bg-pink-600'
                        : 'm-1 rounded bg-pink-500 p-3 font-bold text-white hover:shadow-lg focus:outline-none active:bg-pink-600'
                    }
                    onClick={() => {
                      setSelectedEvent(eventResource);
                    }}
                  >
                    {eventResource.eventName}
                  </button>
                ))}
              </div>

              <div className="mt-2 flex justify-center pb-10">
                <button
                  className={
                    isSelectedEvent(null)
                      ? 'isActive m-1 rounded bg-pink-600 p-3 font-bold text-white hover:shadow-lg focus:outline-none active:bg-pink-600'
                      : 'm-1 rounded bg-pink-500 p-3 font-bold text-white hover:shadow-lg focus:outline-none active:bg-pink-600'
                  }
                  onClick={() => {
                    setSelectedEvent(null);
                  }}
                >
                  NO EVENT
                </button>
              </div>
            </div>
          </div>

          {
            // allow player to select a mode (selected event will be null for guest users)
          }
          {selectedEvent != undefined || selectedEvent === null ? (
            <div>
              <div
                className="mt-10 text-center font-bold"
                style={{
                  color: currentUser.foregroundColor,
                  fontSize: '2rem',
                }}
              >
                <h1>SELECT MODE / TIME LIMIT</h1>
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
                  {modesData.map((mode, index) => (
                    <button
                      key={'mode-' + index}
                      value={index}
                      className={
                        isSelectedMode(mode)
                          ? 'isActive m-1 rounded bg-pink-600 p-3 font-bold text-white hover:shadow-lg focus:outline-none active:bg-pink-600'
                          : 'm-1 rounded bg-pink-500 p-3 font-bold text-white hover:shadow-lg focus:outline-none active:bg-pink-600'
                      }
                      onClick={() => {
                        setSelectedMode(mode);
                      }}
                    >
                      {mode.modeName}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
          {
            // mode is selected, show option to see demo or to begin play
          }
          {selectedMode ? (
            <div className="mb-10 flex justify-center p-10">
              <button
                className="m-1 mr-20 rounded bg-pink-500 p-3 font-bold text-white shadow hover:shadow-lg"
                onClick={handleShowDemo}
              >
                learn how to play
              </button>
              <button
                className="m-1 rounded bg-pink-500 p-3 px-10 font-bold text-white shadow hover:shadow-lg"
                style={{ fontSize: '2em' }}
                onClick={handleStartGame}
              >
                PLAY
              </button>

              {showDemo ? (
                <div className="container-fluid">
                  <GameDemo showPopup={true} />
                  <div
                    style={{
                      position: 'fixed',
                      inset: '10% 80% 80% 95%',
                      zIndex: '51',
                    }}
                    className="flex items-start"
                  >
                    <div className="relative flex w-full flex-col">
                      <div className="flex self-center pb-3">
                        <FontAwesomeIcon
                          icon={faXmark}
                          beatFade
                          className="background-transparent mb-1 mr-1 px-6 py-2 text-5xl font-bold uppercase text-pink-300 outline-none transition-all duration-150 ease-linear focus:outline-none"
                          onClick={handleCloseDemo}
                        ></FontAwesomeIcon>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      );
    } else {
      {
        // guest can only choose mode
      }
      return (
        <div className="container-fluid m-5 p-5">
          <div
            className="mt-10 text-center font-bold"
            style={{
              color: currentUser.foregroundColor,
              fontSize: '2rem',
            }}
          >
            <h1>SELECT MODE / TIME LIMIT</h1>
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
              {modesData.map((mode, index) => (
                <button
                  key={'mode-' + index}
                  value={index}
                  className={
                    isSelectedMode(mode)
                      ? 'isActive m-1 rounded bg-pink-600 p-3 font-bold text-white hover:shadow-lg focus:outline-none active:bg-pink-600'
                      : 'm-1 rounded bg-pink-500 p-3 font-bold text-white hover:shadow-lg focus:outline-none active:bg-pink-600'
                  }
                  onClick={() => {
                    setSelectedMode(mode);
                  }}
                >
                  {mode.modeName}
                </button>
              ))}
            </div>
          </div>

          {selectedMode ? (
            <div className="mb-10 flex justify-center p-10">
              <button
                className="m-1 mr-20 rounded bg-pink-500 p-3 font-bold text-white shadow hover:shadow-lg"
                onClick={handleShowDemo}
              >
                learn how to play
              </button>
              <button
                className="m-1 rounded bg-pink-500 p-3 px-10 font-bold text-white shadow hover:shadow-lg"
                style={{ fontSize: '2em' }}
                onClick={handleStartGame}
              >
                PLAY
              </button>

              {showDemo ? (
                <div className="container-fluid">
                  <GameDemo showPopup={true} />
                  <div
                    style={{
                      position: 'fixed',
                      inset: '10% 80% 80% 95%',
                      zIndex: '51',
                    }}
                    className="flex items-start"
                  >
                    <div className="relative flex w-full flex-col">
                      <div className="flex self-center pb-3">
                        <FontAwesomeIcon
                          icon={faXmark}
                          beatFade
                          className="background-transparent mb-1 mr-1 px-6 py-2 text-5xl font-bold uppercase text-pink-300 outline-none transition-all duration-150 ease-linear focus:outline-none"
                          onClick={handleCloseDemo}
                        ></FontAwesomeIcon>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      );
    }
  }
  return <></>;
};

export default GameSettingsPage;
