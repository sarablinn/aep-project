import { useEffect, useState } from 'react';
import {
  createGame,
  createGameAndAddToEvent,
  GameAndEventDto,
  GameDto,
} from '../../services/gameApi';
import { useMutation } from '@tanstack/react-query';
import { ModeResource } from '../../services/modeApi';
import useGame from '../../hooks/useGame';
import Countdown from 'react-countdown';
import UserEndGameResults from './UserEndGameResults';
import GuestEndGameResults from './GuestEndGameResults';
import { EventResource } from '../../services/eventApi';
import { useAtom } from 'jotai';
import { selectedUser } from '../../services/Atoms';
import { LightenColor } from '../../services/colorChanger';
import Loading from '../../utilities/Loading';

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
  const [currentUser] = useAtom(selectedUser);

  const lighten_bg_5 = LightenColor(currentUser.backgroundColor, 5);
  const [bgLighter_5] = useState(lighten_bg_5);

  const {
    data: createGameResults,
    mutate: createGameMutate,
    isLoading: isLoadingCreateGame,
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

  const {
    data: createGameWithEventResults,
    mutate: createGameWithEventMutate,
    isLoading: isLoadingCreateGameWithEvent,
  } = useMutation({
    mutationFn: (gameAndEventDto: GameAndEventDto) =>
      createGameAndAddToEvent(gameAndEventDto),
    onMutate: () =>
      console.log('GameComponent: Mutate: createGameWithEvent Mutation'),
    onError: (err, variables, context) => {
      console.log(err, variables, context);
    },
    onSuccess: data => {
      console.log(
        'GameComponent: Success: createGameWithEvent Mutation: ',
        data,
      );
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

      if (selected_event) {
        createGameWithEventMutate({
          gameDto: gameDto,
          eventResource: selected_event,
        });
      } else if (!selected_event) {
        createGameMutate(gameDto);
      }
    }
  }

  if (isLoadingCreateGame || isLoadingCreateGameWithEvent) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

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
  } else if (isComplete && user && createGameResults) {
    return (
      <div className="container-fluid flex justify-center">
        <UserEndGameResults game={createGameResults} event={selected_event} />
      </div>
    );
  } else if (isComplete && user && createGameWithEventResults) {
    return (
      <div className="container-fluid flex justify-center">
        <UserEndGameResults
          game={createGameWithEventResults}
          event={selected_event}
        />
      </div>
    );
  } else {
    return <></>;
  }
};

export default GameComponent;
