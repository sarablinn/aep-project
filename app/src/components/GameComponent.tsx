import { useEffect, useState } from 'react';
import { createGame, GameDto } from '../services/gameApi';
import { useMutation } from '@tanstack/react-query';
import { ModeResource } from '../services/modeApi';
import { getUserByToken } from '../services/userApi';
import useGame from '../hooks/useGame';
import Countdown from 'react-countdown';

export type GameComponentProps = {
  selected_mode: ModeResource;
  user: any | undefined;
};

const GameComponent = ({ selected_mode, user }: GameComponentProps) => {
  const [currentGame, setCurrentGame] = useState<GameDto | null>(null);

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
    gameGrid,
    start_time,
    beginGame,
    score,
    isComplete,
    isSelection,
    handleSelection,
  } = useGame(selected_mode);

  // useEffect(() => {
  //   if (start_time) {
  //     const timer = setTimeout(() => {
  //       setShowGame(false);
  //     }, selected_mode.timeLimit * 1000 + 1000);
  //     return () => clearTimeout(timer);
  //   }
  // }, [start_time]);

  useEffect(() => {
    if (isComplete) {
      // build a gameDTO here
      console.log('final score: ' + score);
      saveCompletedGame();
      console.log('end of handleGameComplete()');
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
      getUserByTokenMutate(userToken);

      if (getUserByTokenResults) {
        const userId = getUserByTokenResults.userId;
        const gameDto: GameDto = {
          userId: userId,
          modeId: selected_mode.modeId,
          timestamp: Math.round(new Date(Date.now()).getTime() / 1000),
          score: score,
        };
        console.log('GAME TO SAVE: ', gameDto);

        // createGameMutate(gameDto);

        // reset gameboard
        // maybe create an isComplete state for game -- to determine when to show board
        // display end of game leadership board
      }
    }
  }

  if (selected_mode && !isComplete) {
    return (
      <div className="container-fluid flex">
        {/*<div className="container-fluid bg-blue-350 flex p-5">*/}
        <div className="min-w-1/5 container flex w-1/5 flex-col items-center bg-blue-300 p-5">
          <h3 className="font-bold text-white">Score</h3>
          <h2 className="pb-2 text-lg font-bold text-white">{score}</h2>
          <div className="font-bold text-white">
            <Countdown
              date={start_time.getTime() + selected_mode.timeLimit * 1000}
              zeroPadDays={undefined}
            />
          </div>
        </div>
        <div className="min-w-4/5 container flex w-4/5 flex-col items-center bg-blue-400 p-5">
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
        {/*</div>*/}
      </div>
    );
  } else {
    return <></>;
  }
};

export default GameComponent;
