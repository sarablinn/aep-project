import { useMutation, useQuery } from '@tanstack/react-query';
import { getAllGamesByModes } from '../services/gameApi';
import Loading from '../utilities/Loading';
import ErrorMessage from '../utilities/ErrorMessage';
import { getModes } from '../services/modeApi';
import PaginatedGames from './games/PaginatedGames';
import { useAtom } from 'jotai';
import { selectedUser } from '../services/Atoms';
import {
  EventResource,
  getAllEventModeGames,
  getCurrentEvents,
  ModeGamesDto,
} from '../services/eventApi';
import { useEffect, useState } from 'react';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const LeadershipBoard = () => {
  const [currentUser] = useAtom(selectedUser);

  const [showAllScores, setShowAllScores] = useState(true);
  const [showCurrentEventsOptions, setShowCurrentEventsOptions] =
    useState(false);
  const [showEventGames, setShowEventGames] = useState(false);

  const [selectedEvent, setSelectedEvent] = useState<EventResource | null>(
    null,
  );
  const [eventModeGames, setEventModeGames] = useState<ModeGamesDto[]>([]);

  const handleShowAllScores = () => {
    setShowAllScores(true);
    setSelectedEvent(null);
    setShowEventGames(false);
  };
  const handleEventSelection = (event: EventResource) => {
    setSelectedEvent(event);
    setShowAllScores(false);
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

  // const {
  //   isLoading: isLoadingPriorWeekEvents,
  //   error: priorWeekEventsError,
  //   data: priorWeekEventsData,
  // } = useQuery({
  //   queryKey: [`pastEvents`],
  //   queryFn: () => getPriorWeekEvents(),
  // });

  const {
    data: resultsFromGetAllEventModeGames,
    mutate: getAllEventModeGamesMutation,
    error: getAllEventModeGamesError,
    isLoading: isLoadingGetAllEventModeGames,
    onSuccess: isSuccessGetAllEventModeGames,
  } = useMutation({
    mutationFn: (eventId: number) => getAllEventModeGames(eventId),
    onMutate: () =>
      console.log('LeadershipBoard: Mutate: getAllEventModeGamesMutation'),
    onError: (err, variables, context) => {
      console.log(err, variables, context);
    },
    onSettled: data => {
      setEventModeGames(data!);
      console.log('LeadershipBoard: Settled: getAllEventModeGamesMutation');
    },
  });

  useEffect(() => {
    if (selectedEvent && modesData) {
      getAllEventModeGamesMutation(selectedEvent.eventId);
    }
  }, [selectedEvent, modesData]);

  useEffect(() => {
    console.log('SELECTEDEVENT: ', selectedEvent);
    if (resultsFromGetAllEventModeGames && eventModeGames != undefined) {
      setShowEventGames(true);
      setShowAllScores(false);
    }

    console.log('SHOWEVENTGAMES: ', showEventGames);
    console.log('EVENTMODEGAMES: ', eventModeGames);
  }, [eventModeGames]);

  if (
    isLoadingModes ||
    isLoadingGames ||
    isLoadingCurrentEvents ||
    isLoadingGetAllEventModeGames
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
    return (
      <div className="container-fluid p-5">
        <div className="">
          <h2 className="p-10 text-center text-3xl font-bold text-white">
            {showAllScores ? 'All Top Scores' : 'Event Scores'}
          </h2>
          <div className="w-50 flex justify-center text-center">
            <button
              className={
                showAllScores
                  ? 'm-1 rounded bg-pink-600 p-3 font-bold text-white shadow outline-none hover:shadow-lg focus:outline-none active:bg-pink-600'
                  : 'm-1 rounded bg-pink-500 p-3 font-bold text-white shadow outline-none hover:shadow-lg focus:outline-none active:bg-pink-600'
              }
              onClick={handleShowAllScores}
            >
              ALL SCORES
            </button>

            <div
              className="dropdown flex flex-col text-white"
              onMouseLeave={handleBlurCurrentEventsOptions}
            >
              <label className="pr-2" htmlFor="events-dropdown">
                <button
                  className={
                    selectedEvent
                      ? 'm-1 rounded bg-pink-600 p-3 font-bold text-white shadow outline-none hover:shadow-lg focus:outline-none active:bg-pink-600'
                      : 'm-1 rounded bg-pink-500 p-3 font-bold text-white shadow outline-none hover:shadow-lg focus:outline-none active:bg-pink-600'
                  }
                  onClick={handleShowCurrentEventsOptions}
                >
                  {showAllScores ? 'EVENT SCORES' : 'EVENTS'}
                  <FontAwesomeIcon
                    className="fa-beat-fade fa-xl pl-5 text-white"
                    icon={faCaretDown}
                  />
                </button>
              </label>
              {showCurrentEventsOptions ? (
                <div className="container-fluid relative flex justify-center">
                  <div className="absolute z-50">
                    <div className="flex w-max flex-col">
                      {currentEventsData?.map((currentEvent, index) => {
                        return (
                          <button
                            key={currentEvent.eventName + '-' + index}
                            name="events-dropdown"
                            className={
                              selectedEvent &&
                              selectedEvent.eventId === currentEvent.eventId
                                ? 'h-min rounded-sm border-pink-600 bg-pink-600 px-2 py-1'
                                : 'h-min rounded-sm border-pink-600 bg-pink-500 px-2 py-1'
                            }
                            onClick={() => {
                              handleEventSelection(currentEvent);
                            }}
                          >
                            {currentEvent.eventName}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {showAllScores ? (
          <div className="container-fluid flex flex-wrap justify-center self-stretch px-10 py-5">
            {gamesData.modeGames.map((games, mode_id) => {
              return (
                <div
                  key={'modeId-' + mode_id}
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
        ) : null}

        {showEventGames && selectedEvent && eventModeGames ? (
          <div className="container-fluid flex flex-wrap justify-center self-stretch px-10 py-5">
            {eventModeGames.map((modeGamesDto, index) => {
              console.log('inside: ', modeGamesDto);
              return (
                <div
                  key={'modegamesdto-' + index}
                  className="container-fluid flex flex-col flex-wrap"
                >
                  <div
                    className="m-5 h-min w-fit p-5"
                    style={{
                      border: '3px solid',
                      borderRadius: '20px',
                      borderColor: currentUser.foregroundColor,
                    }}
                  >
                    <PaginatedGames
                      tableTitle={modeGamesDto.mode.modeName}
                      completedGame={null}
                      games={modeGamesDto.modeGames}
                      gamesPerPage={10}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    );
  }

  return <></>;
};

export default LeadershipBoard;
