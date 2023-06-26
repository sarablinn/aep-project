import { useEffect, useState } from 'react';
import { GameGrid, NumberSelection } from '../services/gameApi';

const GameComponent = () => {
  const [currentSelection, setSelection] = useState<NumberSelection | null>(
    null,
  );

  const [mode, setMode] = useState('');

  const initialGrid: GameGrid = { rows: [] };
  const [grid, setGrid] = useState(initialGrid);

  function handleClick(selection: NumberSelection) {
    setSelection(selection);
    console.log(selection);
  }

  // useEffect(() => {
  //   console.log(currentSelection);
  // }, [currentSelection]);

  const resetGrid = () => {
    setGrid(initialGrid);
  };

  const createGrid = (mode: string) => {
    resetGrid();
    addNewRows(grid, 9);
    setMode(mode);
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

  if (mode == '') {
    return (
      <div className="container-fluid p-5">
        <button
          className="m-1 bg-pink-500 p-3 font-bold text-white"
          onClick={() => {
            createGrid('NORMAL');
            // setMode('NORMAL');
          }}
        >
          NORMAL
        </button>
      </div>
    );
  }

  // ADD A CUSTOM HOOK FOR THE NUMBER BUTTONS

  return (
    <div className="container-fluid bg-red-500 p-5">
      <div className="container-fluid bg-green-500 p-5">
        {grid.rows.map((row: number[], rowIndex: number) => {
          return (
            <div>
              {row.map((column: number, colIndex: number) => {
                return (
                  <button
                    className={
                      currentSelection?.value === column &&
                      currentSelection.rowIndex === rowIndex &&
                      currentSelection.colIndex === colIndex
                        ? 'isActive m-1 rounded bg-pink-600 p-3 font-bold text-white shadow outline-none hover:shadow-lg focus:outline-none active:bg-pink-600'
                        : 'm-1 rounded bg-pink-500 p-3 font-bold text-white shadow outline-none hover:shadow-lg focus:outline-none active:bg-pink-600'
                    }
                    onClick={() =>
                      handleClick({
                        rowIndex: rowIndex,
                        colIndex: colIndex,
                        value: column,
                      })
                    }
                  >
                    {column}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// export const GridButton = (rowIndex, colIndex, value) => {
//   return (
//     <button
//       className="m-1 rounded bg-pink-500 p-3 font-bold text-white shadow outline-none hover:shadow-lg focus:outline-none active:bg-pink-600"
//       onClick={() =>
//         setSelection({
//           rowIndex: rowIndex,
//           colIndex: colIndex,
//           value: value,
//         })
//       }
//     >
//       {value}
//     </button>
//   );
// };

export default GameComponent;
