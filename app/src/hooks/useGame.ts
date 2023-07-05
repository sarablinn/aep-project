import { GameDto, GameGrid, NumberSelection } from '../services/gameApi';
import { useEffect, useState } from 'react';
import { ModeResource } from '../services/modeApi';

const useGame = (gameMode: ModeResource) => {
  const [currentGame, setCurrentGame] = useState<GameDto | null>(null);

  const initialGameGrid: GameGrid = { rows: [] };
  const [gameGrid, setGameGrid] = useState(initialGameGrid);

  const [isComplete, setIsComplete] = useState(false);

  const [firstSelection, setFirstSelection] = useState<NumberSelection | null>(
    null,
  );
  const [secondSelection, setSecondSelection] =
    useState<NumberSelection | null>(null);

  const hasBothSelections = firstSelection != null && secondSelection != null;
  const [isValid, setIsValid] = useState(false);

  const [baseScore, setBaseScore] = useState<number>(0);
  const [rowScore, setRowScore] = useState<number>(0);
  const totalScore = baseScore + rowScore;

  const [start_time, setStartTime] = useState<Date>(new Date());
  const [end_time, setEndTime] = useState(null);
  const [hasBegun, setHasBegun] = useState(false);

  const createGameGrid = () => {
    resetGameGrid();
    addNewRows(9);
  };

  const resetGameGrid = () => {
    setGameGrid(initialGameGrid);
  };

  const updateGameGrid = () => {
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
        gameGrid.rows[firstRowNum][firstColNum] = 0;
        gameGrid.rows[secondRowNum][secondColNum] = 0;
        console.log('UPDATEGAMEGRID');

        resetSelections();
      }
    }
  };

  const addNewRows = (numberOfRows: number) => {
    for (let rowNum = 0; rowNum < numberOfRows; rowNum++) {
      const row = [];
      // fill the row with random ints
      for (let col = 0; col < 9; col++) {
        row[col] = Math.floor(Math.random() * 9) + 1;
      }
      // add row to the game grid
      gameGrid.rows[gameGrid.rows.length] = row;
    }

    setGameGrid(gameGrid);
  };

  /**
   * Determines whether to set selection states.
   * @param selection
   */
  const handleSelection = (selection: NumberSelection) => {
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
  };

  /**
   * Resets the selections to their initial value: null.
   */
  const resetSelections = () => {
    setFirstSelection(null);
    setSecondSelection(null);
  };

  /**
   * Validates the selections, returns true if valid matches.
   * If selections are invalid, selections are reset and false returned.
   */
  const validateSelections = (): boolean => {
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
              const currentRow = gameGrid.rows[firstRowNum]; // same row for both selections
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
                const row = gameGrid.rows[rowNum];
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
                const currentRow = gameGrid.rows[rowNum];
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
  };

  const updatePostValidation = () => {
    const isValid = validateSelections();
    console.log('SELECTIONS: ', firstSelection, secondSelection);
    console.log('ISVALID: ' + isValid);

    if (isValid) {
      updateGameGrid();
      setBaseScore(baseScore + 1);
      calculateAndSetRowScore();
      setIsValid(false);
    }
  };

  const calculateAndSetRowScore = () => {
    let rowScoreSum = 0;
    gameGrid.rows.forEach(row => {
      let rowScore = row.length - 1;
      row.forEach(item => {
        if (item != 0) {
          rowScore = 0;
        }
      });
      rowScoreSum += rowScore;
    });

    setRowScore(rowScoreSum);
  };

  /**
   * Indicates if the button is one of the two possible selected buttons.
   * @param rowIndex
   * @param colIndex
   * @param value
   */
  const isSelection = (rowIndex: number, colIndex: number, value: number) => {
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
  };

  const beginGame = () => {
    createGameGrid();
    setStartTime(new Date());
    setHasBegun(true);
  };

  /**
   * Updates the grid and the score after valid selections made.
   */
  useEffect(() => {
    if (firstSelection && secondSelection) {
      setIsValid(validateSelections);
    }
  }, [hasBothSelections]);

  useEffect(() => {
    if (isValid) {
      updatePostValidation();
    }
  }, [isValid]);

  useEffect(() => {
    if (hasBegun) {
      const timer = setTimeout(() => {
        setIsComplete(true);
      }, gameMode.timeLimit * 1000 + 1000);
      return () => clearTimeout(timer);
    }
  }, [hasBegun, gameMode.timeLimit]);

  return {
    gameGrid,
    firstSelection,
    secondSelection,
    start_time,
    beginGame,
    score: totalScore,
    isComplete,
    isSelection,
    handleSelection,
  };
};

export default useGame;
