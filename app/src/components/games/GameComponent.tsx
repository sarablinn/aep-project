import { useEffect, useState } from 'react';
import { createGame, GameDto } from '../../services/gameApi';
import { useMutation } from '@tanstack/react-query';
import { ModeResource } from '../../services/modeApi';
import { getUserByToken } from '../../services/userApi';
import useGame from '../../hooks/useGame';
import Countdown from 'react-countdown';
import UserEndGameResults from './UserEndGameResults';
import GuestEndGameResults from './GuestEndGameResults';
import {
  addEventGame,
  EventGameDto,
  EventResource,
} from '../../services/eventApi';
import { useAtom } from 'jotai';
import { selectedUser } from '../../services/Atoms';
import { changeColor, LightenColor } from '../../services/colorChanger';

export type GameComponentProps = {
  selected_mode: ModeResource;
  selected_event: EventResource | null | undefined;
  user: any | undefined;
};

const GameComponent = ({
  selected_mode,
  selected_event,
  user,
}: GameComponentProps) => {
  const [currentGame, setCurrentGame] = useState(null);
  const [currentUser] = useAtom(selectedUser);

  const lighten_bg_5 = LightenColor(currentUser.backgroundColor, 5);
  const [bgLighter_5] = useState(lighten_bg_5);

  const {
    data: createGameResults,
    mutate: createGameMutate,
    error: createGameError,
    isLoading: createGameLoading,
  } = useMutation({
    mutationFn: (gameDto: GameDto) => createGame(gameDto),
    onMutate: () => console.log('GameComponent: Mutate: createGame Mutation'),
    onError: (err, variables, context) => {
      console.log(err, variables, context);
    },
    onSuccess: data => {
      console.log('GameComponent: Success: createGame Mutation: ', data);
    },
  });

  const { data: getUserByTokenResults, mutate: getUserByTokenMutate } =
    useMutation({
      mutationFn: (userToken: string) => getUserByToken(userToken),
      onMutate: () =>
        console.log('GameComponent: Mutate: getUserByToken Mutation'),
      onError: (err, variables, context) => {
        console.log(err, variables, context);
      },
      onSuccess: data => {
        console.log('GameComponent: Success: getUserByToken Mutation: ', data);
      },
    });

  const {
    data: addEventGameResults,
    mutate: addEventGameMutate,
    isLoading: isLoadingGameEventMutation,
    error: addGameEventError,
  } = useMutation({
    mutationFn: (eventGameDto: EventGameDto) => addEventGame(eventGameDto),
    onMutate: () => console.log('GameComponent: Mutate: addEventGame Mutation'),
    onError: (err, variables, context) => {
      console.log(err, variables, context);
    },
    onSuccess: data => {
      setCurrentGame({ data });
      console.log('GameComponent: Success: addEventGame Mutation: ', data);
    },
  });

  const {
    gameGrid,
    start_time,
    beginGame,
    addRow,
    score,
    isComplete,
    isSelection,
    handleSelection,
  } = useGame(selected_mode);

  useEffect(() => {
    if (isComplete) {
      console.log('final score: ' + score);
      saveCompletedGame();
    }
  }, [isComplete]);

  useEffect(() => {
    if (!isComplete) {
      beginGame();
    }
  }, []);

  function saveCompletedGame() {
    if (user != undefined && user.sub && selected_mode) {
      const userToken = user.sub;

      const gameDto: GameDto = {
        userToken: userToken,
        modeId: selected_mode.modeId,
        timestamp: Math.round(new Date(Date.now()).getTime() / 1000),
        score: score,
      };
      console.log('GAME TO SAVE: ', gameDto);

      createGameMutate(gameDto);
    }
  }

  useEffect(() => {
    console.log(
      'GAME SHOULD BE ADDED TO EVENT: ',
      createGameResults,
      selected_event,
    );

    if (createGameResults && selected_event) {
      const eventGameDto: EventGameDto = {
        eventId: selected_event.eventId,
        gameId: createGameResults.gameId,
      };

      addEventGameMutate(eventGameDto);
      console.log('GAME ADDED TO EVENT?');
    }
  }, [createGameResults != undefined]);

  if (selected_mode && !isComplete) {
    return (
      <div className="container-fluid m-10 flex">
        <div className="container flex w-1/5 min-w-max p-5">
          <div
            className="flex h-max w-1/5 min-w-max flex-col items-center p-5"
            style={{
              backgroundColor: bgLighter_5,
              border: '3px solid',
              borderRadius: '20px',
              borderColor: currentUser.foregroundColor,
              position: 'fixed',
              top: '40vh',
            }}
          >
            <h3 className="font-bold text-white">Score</h3>
            <h2 className="pb-2 text-lg font-bold text-white">{score}</h2>
            <div className="font-bold text-white">
              <Countdown
                date={start_time.getTime() + selected_mode.timeLimit * 1000}
                zeroPadDays={undefined}
              />
            </div>
            <button
              onClick={addRow}
              className="m-5 rounded bg-pink-500 px-4 py-2 font-bold font-bold text-white text-white shadow outline-none hover:shadow-lg focus:outline-none active:bg-pink-600"
            >
              +
            </button>
          </div>
        </div>
        <div
          className="min-w-4/5 container flex w-4/5 flex-col items-center p-5"
          style={{ backgroundColor: currentUser.backgroundColor }}
        >
          {gameGrid.rows.map((row: number[], rowIndex: number) => {
            return (
              <div key={'row-' + rowIndex}>
                {row.map((column: number, colIndex: number) => {
                  return (
                    <button
                      key={rowIndex + '.' + colIndex}
                      className={
                        isSelection(rowIndex, colIndex, column)
                          ? 'isActive m-1 h-12 w-12 rounded bg-pink-600 p-3 font-bold text-white shadow outline-none hover:shadow-lg focus:outline-none active:bg-pink-600'
                          : 'm-1 h-12 w-12 rounded bg-pink-500 p-3 font-bold text-white shadow outline-none hover:shadow-lg focus:outline-none active:bg-pink-600'
                      }
                      style={{
                        color: isSelection(rowIndex, colIndex, column)
                          ? 'white'
                          : column === 0
                          ? '#DB2777'
                          : 'white',
                        backgroundColor: isSelection(rowIndex, colIndex, column)
                          ? '#DB2777'
                          : column === 0
                          ? '#DB2777'
                          : '#EC4899',
                      }}
                      onClick={() =>
                        handleSelection({
                          rowNum: rowIndex,
                          colNum: colIndex,
                          value: column,
                        })
                      }
                    >
                      {column != 0 ? column : '•'}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  } else if (isComplete && user && createGameResults) {
    return (
      <div className="container-fluid flex justify-center">
        <UserEndGameResults
          user={user}
          game={createGameResults}
          event={selected_event}
        />
      </div>
    );
  } else if (isComplete && !user) {
    return (
      <div className="container-fluid flex justify-center">
        <GuestEndGameResults
          game={{
            mode: selected_mode,
            timestamp: new Date(),
            score: score,
          }}
        />
      </div>
    );
  } else {
    return <></>;
  }
};

export default GameComponent;
