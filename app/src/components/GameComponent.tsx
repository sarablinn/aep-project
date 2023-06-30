import { useEffect, useState } from 'react';
import {
  createGame,
  GameDto,
  GameGrid,
  NumberSelection,
} from '../services/gameApi';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getModes, ModeResource } from '../services/modeApi';
import CountdownTimer from './CountdownTimer';
import Loading from '../utilities/Loading';
import ErrorMessage from '../utilities/ErrorMessage';
import { useAuth0 } from '@auth0/auth0-react';
import { getUserByToken } from '../services/userApi';

const GameComponent = () => {
  const { user } = useAuth0();

  const [firstSelection, setFirstSelection] = useState<NumberSelection | null>(
    null,
  );
  const [secondSelection, setSecondSelection] =
    useState<NumberSelection | null>(null);

  const [showGame, setShowGame] = useState(true);
  const [isComplete, setIsComplete] = useState(false);

  const [mode, setMode] = useState<ModeResource | null>(null);
  const [baseScore, setBaseScore] = useState<number>(0);
  const [finalScore, setFinalScore] = useState<number>(0);

  const initialGrid: GameGrid = { rows: [] };
  const [grid, setGrid] = useState(initialGrid);

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

  useEffect(() => {
    if (firstSelection && secondSelection) {
      const isValid = validateSelections();
      console.log('SELECTIONS: ', firstSelection, secondSelection);
      console.log('ISVALID: ' + isValid);
      if (isValid) {
        updateGameGrid();
        setBaseScore(baseScore + 1);
      }
    }
  }, [firstSelection, secondSelection]);

  // useEffect(() => {
  //   if (mode) {
  //     setMode(mode);
  //     createGrid(mode);
  //   }
  // }, [mode]);

  function handleClick(selection: NumberSelection) {
    let isDone = false;
    if (firstSelection === null) {
      setFirstSelection(selection);
      isDone = true;
    } else if (!isDone && firstSelection != null && secondSelection === null) {
      if (
        firstSelection.rowNum === selection.rowNum &&
        firstSelection.colNum === selection.colNum &&
        firstSelection.value === selection.value
      ) {
        resetSelections();
        console.log('SAME VALUE SELECTED TWICE');
      } else {
        setSecondSelection(selection);
      }
      isDone = true;
    } else if (!isDone && firstSelection != null && secondSelection != null) {
      resetSelections();
      setFirstSelection(selection);
    }
    console.log('SELECTED: ', selection);
  }

  const resetSelections = () => {
    setFirstSelection(null);
    setSecondSelection(null);
  };

  const resetGrid = () => {
    setGrid(initialGrid);
  };

  const createGrid = (mode: ModeResource) => {
    resetGrid();
    addNewRows(grid, 9);
    // setMode(mode);
  };

  function addNewRows(grid: GameGrid, numberOfRows: number) {
    for (let rowNum = 0; rowNum < numberOfRows; rowNum++) {
      const row = [];
      // fill the row with random ints
      for (let col = 0; col < 9; col++) {
        row[col] = Math.floor(Math.random() * 9) + 1;
      }
      // add row to the game grid
      grid.rows[grid.rows.length] = row;
    }

    setGrid(grid);
  }

  function validateSelections(): boolean {
    if (firstSelection && secondSelection) {
      const firstRowNum = firstSelection.rowNum;
      const firstColNum = firstSelection.colNum;
      const firstValue = firstSelection.value;
      const secondRowNum = secondSelection.rowNum;
      const secondColNum = secondSelection.colNum;
      const secondValue = secondSelection.value;

      // empty values
      if (firstValue === 0 || secondValue === 0) {
        console.log('CONTAINS ZERO');
        resetSelections();
        return false;
      } else if (
        firstValue != null &&
        secondValue != null &&
        firstRowNum != null &&
        secondRowNum != null &&
        firstColNum != null &&
        secondColNum != null
      ) {
        // check if the values match or equal sum of 10
        const sum = firstValue + secondValue;
        if (firstValue === secondValue || sum === 10) {
          // SAME ROW:
          if (firstRowNum === secondRowNum) {
            console.log('SAME ROW');
            // check if immediately adjacent (L/R - using column)
            if (
              firstColNum + 1 === secondColNum ||
              firstColNum - 1 === secondColNum
            ) {
              console.log('VALUES IMMEDIATELY ADJACENT - Horizontally');
              return true;
            } else {
              // determine which selection has the lower column index and the higher
              const lowestColNum =
                firstColNum < secondColNum ? firstColNum : secondColNum;
              const highestColNum =
                firstColNum > secondColNum ? firstColNum : secondColNum;
              // check that all numbers in between the selections are null
              const currentRow = grid.rows[firstRowNum]; // same row for both selections
              for (
                let colNum = lowestColNum + 1;
                colNum < highestColNum;
                colNum++
              ) {
                console.log(
                  'SAME ROW: ROW ITEM: colNum: ' +
                    colNum +
                    ', value: ' +
                    currentRow[colNum],
                );
                if (currentRow[colNum] != 0) {
                  console.log('SAME ROW BUT BLOCKED');
                  resetSelections();
                  return false;
                }
              }
            }
          }
          // SAME COLUMN:
          else if (firstColNum === secondColNum) {
            console.log('SAME COLUMN');
            // check if immediately adjacent (up/down - using row)
            if (
              firstRowNum + 1 === secondRowNum ||
              firstRowNum - 1 === secondRowNum
            ) {
              console.log('VALUES IMMEDIATELY ADJACENT - VERTICALLY');
              return true;
            } else {
              // determine which selection has the lower row index and the higher
              const lowestRowNum =
                firstRowNum < secondRowNum ? firstRowNum : secondRowNum;
              const highestRowNum =
                firstRowNum > secondRowNum ? firstRowNum : secondRowNum;
              console.log(
                'lowest row # = ' +
                  lowestRowNum +
                  ', highest row # = ' +
                  highestRowNum,
              );
              // check that all numbers in between the selections are null
              const currentCol = firstColNum; // same col for both selections
              for (
                let rowNum = lowestRowNum + 1;
                rowNum < highestRowNum;
                rowNum++
              ) {
                const row = grid.rows[rowNum];
                if (row[currentCol] != 0) {
                  console.log('SAME COLUMN BUT BLOCKED');
                  resetSelections();
                  return false;
                }
              }
            }
          } else {
            // check if the values are next to each other in line, separated by prev matches
            // determine lowest and highest row numbers
            const hasLowestRowNum =
              firstRowNum < secondRowNum ? firstSelection : secondSelection;
            const hasHighestRowNum =
              firstRowNum > secondRowNum ? firstSelection : secondSelection;

            const lowestRowNum = hasLowestRowNum.rowNum;
            const highestRowNum = hasHighestRowNum.rowNum;
            const firstRowColNum = hasLowestRowNum.colNum;
            const secondRowColNum = hasHighestRowNum.colNum;

            if (
              lowestRowNum != null &&
              highestRowNum != null &&
              firstRowColNum != null &&
              secondRowColNum != null
            ) {
              // iterate each row from lowestRowNum to highestRowNum
              for (
                let rowNum = lowestRowNum;
                rowNum < highestRowNum + 1;
                rowNum++
              ) {
                // iterate each row checking for non-zero values
                // iteration is different for:
                // starting row (lowestRowNum) and ending row (highestRowNum)
                const currentRow = grid.rows[rowNum];
                if (rowNum === lowestRowNum) {
                  for (
                    let colNum = firstRowColNum + 1;
                    colNum < currentRow.length;
                    colNum++
                  ) {
                    if (currentRow[colNum] === 0) {
                      return false;
                    }
                  }
                } else if (rowNum === highestRowNum) {
                  for (let colNum = 0; colNum < secondRowColNum; colNum++) {
                    if (currentRow[colNum] === 0) {
                      return false;
                    }
                  }
                } else {
                  for (let colNum = 0; colNum < currentRow.length; colNum++) {
                    if (currentRow[colNum] === 0) {
                      return false;
                    }
                  }
                }
              }
              console.log('VALUES NOT ADJACENT BUT SEPARATED ONLY BY MATCHES');
              return true;
            }
          }
          // else {
          //   console.log('NOT ADJACENT VERTICALLY OR HORIZONTALLY');
          //   resetSelections();
          //   return false;
          // }
        } else {
          console.log('VALUES DO NOT MATCH OR DO NOT EQUAL A SUM OF 10');
          resetSelections();
          return false;
        }
      }
    } else {
      console.log('INVALID NUMBERSELECTION OBJECT - NULL VALUES');
      resetSelections();
      return false;
    }
    console.log('VALUES MATCH');
    return true;
  }

  function calculateRowScores(): number {
    let rowScoreSum = 0;
    grid.rows.forEach(row => {
      let rowScore = row.length - 1;
      row.forEach(item => {
        if (item != 0) {
          rowScore = 0;
        }
      });
      rowScoreSum += rowScore;
    });
    return rowScoreSum;
    // setScore(score + addtlScore);
  }

  function calculateAndSetFinalScore() {
    setFinalScore(baseScore + calculateRowScores());
  }

  function updateGameGrid() {
    if (firstSelection && secondSelection) {
      const firstRowNum = firstSelection.rowNum;
      const firstColNum = firstSelection.colNum;
      const secondRowNum = secondSelection.rowNum;
      const secondColNum = secondSelection.colNum;

      if (
        firstRowNum != null &&
        secondRowNum != null &&
        firstColNum != null &&
        secondColNum != null
      ) {
        grid.rows[firstRowNum][firstColNum] = 0;
        grid.rows[secondRowNum][secondColNum] = 0;
        console.log('UPDATEGAMEGRID');

        resetSelections();
      }
    }
  }

  /**
   * Indicates if the button is one of the two possible selected buttons.
   * @param rowIndex
   * @param colIndex
   * @param value
   */
  function isSelectedBtn(rowIndex: number, colIndex: number, value: number) {
    const btn: NumberSelection = {
      rowNum: rowIndex,
      colNum: colIndex,
      value: value,
    };

    if (firstSelection) {
      if (
        btn.rowNum === firstSelection.rowNum &&
        btn.colNum === firstSelection.colNum &&
        btn.value === firstSelection.value
      ) {
        return true;
      }
    }

    if (secondSelection) {
      if (
        btn.rowNum === secondSelection.rowNum &&
        btn.colNum === secondSelection.colNum &&
        btn.value === secondSelection.value
      ) {
        return true;
      }
    } else {
      return false;
    }
  }

  const {
    isLoading: isLoadingModes,
    error: modesError,
    data: modesData,
  } = useQuery({
    queryKey: [`modes`],
    queryFn: () => getModes(),
  });

  useEffect(() => {
    if (mode && !isComplete) {
      setShowGame(true);
      const timer = setTimeout(() => {
        setShowGame(false);
        setIsComplete(true);
      }, mode.timeLimit * 1000 + 1000);
      return () => clearTimeout(timer);
    }
  }, [mode]);

  useEffect(() => {
    if (!showGame && isComplete) {
      calculateAndSetFinalScore();
      console.log('final score: ' + finalScore);
      saveCompletedGame();
      console.log('end of handleGameComplete()');
    }
  }, [showGame, isComplete]);

  // function handleGameComplete() {
  //   calculateAndSetFinalScore();
  //   console.log('final score: ' + finalScore);
  //   saveCompletedGame();
  //   console.log('end of handleGameComplete()');
  // }

  function saveCompletedGame() {
    if (user && user.sub && mode) {
      const userToken = user.sub;
      getUserByTokenMutate(userToken);

      if (getUserByTokenResults) {
        const userId = getUserByTokenResults.userId;
        const gameDto: GameDto = {
          userId: userId,
          modeId: mode.modeId,
          timestamp: Math.round(new Date(Date.now()).getTime() / 1000),
          score: finalScore,
        };
        console.log('GAME TO SAVE: ', gameDto);

        createGameMutate(gameDto);
        // reset gameboard
        // maybe create an isComplete state for game -- to determine when to show board
        // display end of game leadership board
      }
    }
  }

  if (isLoadingModes) {
    return (
      <div>
        <Loading />
      </div>
    );
  } else if (modesError) {
    return (
      <div>
        <ErrorMessage
          errorMessage={'An error has occurred while loading game settings.'}
        />
      </div>
    );
  } else if (mode === null && modesData != undefined) {
    return (
      <div className="container-fluid p-5">
        {modesData.map((mode, index) => (
          <button
            key={'mode-' + index}
            className="m-1 bg-pink-500 p-3 font-bold text-white"
            onClick={() => {
              setMode(mode);
              createGrid(mode);
            }}
          >
            {mode.modeName}
          </button>
        ))}
      </div>
    );
  } else if (mode && showGame) {
    return (
      <div className="container-fluid bg-blue-350 flex p-5">
        <div className="container w-20 bg-blue-300 p-5">
          <h3 className="font-bold text-white">Score</h3>
          <h2 className="font-bold text-white">{baseScore}</h2>
          <div>
            <CountdownTimer time_limit_in_seconds={mode.timeLimit} />
          </div>
        </div>
        <div className="container-fluid bg-blue-400 p-5">
          {grid.rows.map((row: number[], rowIndex: number) => {
            return (
              <div key={'row-' + rowIndex}>
                {row.map((column: number, colIndex: number) => {
                  return (
                    <button
                      key={rowIndex + '.' + colIndex}
                      className={
                        isSelectedBtn(rowIndex, colIndex, column)
                          ? 'isActive m-1 h-12 w-12 rounded bg-pink-600 p-3 font-bold text-white shadow outline-none hover:shadow-lg focus:outline-none active:bg-pink-600'
                          : 'm-1 h-12 w-12 rounded bg-pink-500 p-3 font-bold text-white shadow outline-none hover:shadow-lg focus:outline-none active:bg-pink-600'
                      }
                      onClick={() =>
                        handleClick({
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
  }
};

export default GameComponent;
