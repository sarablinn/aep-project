import { useQuery } from '@tanstack/react-query';
import { getAllGamesByModes } from '../services/gameApi';
import Loading from '../utilities/Loading';
import ErrorMessage from '../utilities/ErrorMessage';
import { getModes } from '../services/modeApi';
import PaginatedGames from './games/PaginatedGames';
import { useAtom } from 'jotai';
import { selectedUser } from '../services/Atoms';
import {
  EventResource,
  getCurrentEvents,
  getPriorWeekEvents,
} from '../services/eventApi';
import { useState } from 'react';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import EventLeadershipBoard from './EventLeadershipBoard';

const LeadershipBoard = () => {
  const [currentUser] = useAtom(selectedUser);

  const [showAllScores, setShowAllScores] = useState(true);

  const [selectedEvent, setSelectedEvent] = useState<EventResource | null>(
    null,
  );
  const [showCurrentEventsOptions, setShowCurrentEventsOptions] =
    useState(false);

  const handleEventSelection = (event: EventResource) => {
    setSelectedEvent(event);
    console.log('selectedEvent: ', selectedEvent);
  };
  const handleShowCurrentEventsOptions = () => {
    setShowCurrentEventsOptions(true);
  };

  const handleBlurCurrentEventsOptions = () => {
    setShowCurrentEventsOptions(false);
  };

  // const lighten_bg_5 = LightenColor(currentUser.backgroundColor, 5);
  // const [bgLighter_5] = useState(lighten_bg_5);

  const {
    isLoading: isLoadingModes,
    error: modesError,
    data: modesData,
  } = useQuery({
    queryKey: [`modes`],
    queryFn: () => getModes(),
  });

  const {
    isLoading: isLoadingGames,
    error: gamesError,
    data: gamesData,
  } = useQuery({
    queryKey: [`gamesByModes`],
    queryFn: () => getAllGamesByModes(),
  });

  const {
    isLoading: isLoadingCurrentEvents,
    error: currentEventsError,
    data: currentEventsData,
  } = useQuery({
    queryKey: [`currentEvents`],
    queryFn: () => getCurrentEvents(),
  });

  const {
    isLoading: isLoadingPriorWeekEvents,
    error: priorWeekEventsError,
    data: priorWeekEventsData,
  } = useQuery({
    queryKey: [`pastEvents`],
    queryFn: () => getPriorWeekEvents(),
  });

  if (
    isLoadingModes ||
    isLoadingGames ||
    isLoadingCurrentEvents
    // isLoadingPriorWeekEvents
  ) {
    return (
      <div>
        <Loading />
      </div>
    );
  } else if (modesError || gamesError) {
    return (
      <div>
        <ErrorMessage errorMessage={'An error has occurred.'} />
      </div>
    );
  } else if (
    modesData &&
    gamesData &&
    gamesData.modeGames &&
    currentEventsData
  ) {
    if (!selectedEvent) {
      return (
        <div className="container-fluid p-5">
          <h2 className="text-center text-lg font-bold text-white">
            All Top Scores
          </h2>
          <div
            className="dropdown flex flex-col text-white"
            onMouseLeave={handleBlurCurrentEventsOptions}
          >
            <label className="mr-2" htmlFor="events-dropdown">
              <button className="" onClick={handleShowCurrentEventsOptions}>
                Event Scores
                <FontAwesomeIcon
                  className="fa-beat-fade fa-xl px-5 text-white"
                  icon={faCaretDown}
                />
              </button>
            </label>
            {showCurrentEventsOptions ? (
              <div>
                {currentEventsData?.map(currentEvent => {
                  return (
                    <button
                      name="events-dropdown"
                      className="h-min rounded-sm border-pink-500 bg-pink-500 px-2 py-1"
                      onClick={() => {
                        handleEventSelection(currentEvent);
                      }}
                    >
                      {currentEvent.eventName}
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>
          <div className="container-fluid flex flex-wrap justify-center self-stretch px-10 py-5">
            {gamesData.modeGames.map((games, mode_id) => {
              return (
                <div
                  className="container m-5 h-min w-fit items-center p-5"
                  style={{
                    border: '3px solid',
                    borderRadius: '20px',
                    borderColor: currentUser.foregroundColor,
                  }}
                >
                  <PaginatedGames
                    tableTitle={modesData?.at(mode_id)?.modeName}
                    games={games}
                    gamesPerPage={10}
                  />
                </div>
              );
            })}
          </div>
        </div>
      );
    } else if (selectedEvent) {
      return (
        <div className="container-fluid p-5">
          <h2 className="text-center text-lg font-bold text-white">
            Event Scores
          </h2>
          <div
            className="dropdown flex flex-col text-white"
            onMouseLeave={handleBlurCurrentEventsOptions}
          >
            <label className="mr-2" htmlFor="events-dropdown">
              <button className="" onClick={handleShowCurrentEventsOptions}>
                Event Scores
                <FontAwesomeIcon
                  className="fa-beat-fade fa-xl px-5 text-white"
                  icon={faCaretDown}
                />
              </button>
            </label>
            {showCurrentEventsOptions ? (
              <div>
                {currentEventsData?.map(currentEvent => {
                  return (
                    <button
                      name="events-dropdown"
                      className="h-min rounded-sm border-pink-500 bg-pink-500 px-2 py-1"
                      onClick={() => {
                        handleEventSelection(currentEvent);
                      }}
                    >
                      {currentEvent.eventName}
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>

          <div>
            <EventLeadershipBoard
              eventResource={selectedEvent}
              modeResources={modesData}
            />
          </div>
        </div>
      );
    }
  } else {
    return <></>;
  }
};

export default LeadershipBoard;
