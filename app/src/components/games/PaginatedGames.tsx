import { GameResource, GuestGameDto } from '../../services/gameApi';
import { selectedUser } from '../../services/Atoms';
import { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft, faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { useAtom } from 'jotai';

export type PaginatedGamesProps = {
  tableTitle: string;
  completedGame: GameResource | GuestGameDto | null;
  games: GameResource[];
  gamesPerPage: number;
};

const PaginatedGames = ({
  tableTitle = '',
  completedGame,
  games = [],
  gamesPerPage,
}: PaginatedGamesProps) => {
  const [currentUser] = useAtom(selectedUser);

  const [itemOffset, setItemOffset] = useState(0);
  const endOffset = itemOffset + gamesPerPage;
  const [currentItems, setCurrentItems] = useState(
    games.slice(itemOffset, endOffset),
  );
  const pageCount = Math.ceil(games.length / gamesPerPage);

  // Invoke when user click to request another page.
  const handlePageClick = event => {
    const newOffset = (event.selected * gamesPerPage) % games.length;
    console.log(
      `User requested page number ${event.selected}, which is offset ${newOffset}`,
    );
    setItemOffset(newOffset);
  };

  useEffect(() => {
    setCurrentItems(games.slice(itemOffset, endOffset));
  }, [itemOffset]);

  if (currentItems.length > 0) {
    return (
      <div>
        <div>
          <table className="p-5">
            <caption className="m-4 p-4 text-center font-bold text-white">
              {tableTitle}
            </caption>
            <tbody>
              {currentItems.map((modeGame, index) => {
                if (completedGame && modeGame.gameId === completedGame.gameId) {
                  return (
                    <tr key={'modeGame-' + index}>
                      <td
                        className="rounded-sm bg-pink-500 py-2 pl-5 pr-10 font-bold text-white"
                        // style={{ backgroundColor: bgLighter_5 }}
                      >
                        {games.indexOf(modeGame) + 1}
                      </td>
                      <td
                        className="bg-pink-500 py-2 pr-5 font-bold text-white"
                        // style={{ backgroundColor: bgLighter_5 }}
                      >
                        {modeGame.user.username}
                      </td>
                      <td
                        className="bg-pink-500 py-2 pr-10 font-bold text-white"
                        // style={{ backgroundColor: bgLighter_5 }}
                      >
                        {modeGame.score}
                      </td>
                    </tr>
                  );
                } else {
                  return (
                    <tr key={'modeGame-' + index}>
                      <td className="py-2 pl-5 pr-10 text-white">
                        {games.indexOf(modeGame) + 1}
                      </td>
                      <td className="py-2 pr-5 font-bold text-white">
                        {modeGame.user.username}
                      </td>
                      <td className="py-2 pr-10 font-bold text-white">
                        {modeGame.score}
                      </td>
                    </tr>
                  );
                }
              })}
            </tbody>
          </table>
        </div>
        <div className="my-5" style={{}}>
          <ReactPaginate
            containerClassName="flex justify-between text-center text-white text-lg"
            activeClassName="flex justify-evenly text-center text-white bg-pink-500 px-2 mx-1 font-bold border rounded-xl border-pink-500"
            breakLabel="..."
            nextLabel={
              <FontAwesomeIcon
                className="fa-beat-fade fa-xl px-5 text-white"
                icon={faCaretRight}
              />
            }
            onPageChange={handlePageClick}
            pageRangeDisplayed={1}
            pageCount={pageCount}
            previousLabel={
              <FontAwesomeIcon
                className="fa-xl px-5 text-white"
                icon={faCaretLeft}
              />
            }
            renderOnZeroPageCount={null}
          />
        </div>
      </div>
    );
  } else if (currentItems.length === 0 && tableTitle && tableTitle != '') {
    return (
      <div className="m-4 p-5 text-center">
        <h2 className="mb-5 pb-2 font-bold text-white">{tableTitle}</h2>
        <p className="text-white">No Games Played Yet!</p>
      </div>
    );
  }

  return <></>;
};

export default PaginatedGames;
