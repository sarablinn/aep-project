import { GameResource } from '../../services/gameApi';
import { useAtom } from 'jotai/esm';
import { selectedUser } from '../../services/Atoms';
import { useState } from 'react';
import ReactPaginate from 'react-paginate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft, faCaretRight } from '@fortawesome/free-solid-svg-icons';

export type PaginatedGamesProps = {
  games: GameResource[];
  gamesPerPage: number;
};

const PaginatedGames = ({ games, gamesPerPage }: PaginatedGamesProps) => {
  const [currentUser] = useAtom(selectedUser);

  const [itemOffset, setItemOffset] = useState(0);
  const endOffset = itemOffset + gamesPerPage;
  const currentItems = games.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(games.length / gamesPerPage);

  // Invoke when user click to request another page.
  const handlePageClick = event => {
    const newOffset = (event.selected * gamesPerPage) % games.length;
    console.log(
      `User requested page number ${event.selected}, which is offset ${newOffset}`,
    );
    setItemOffset(newOffset);
  };

  return (
    <div>
      <ReactPaginate
        breakLabel="..."
        nextLabel={
          <FontAwesomeIcon
            className="fa-beat-fade fa-2x p-5 text-white"
            icon={faCaretRight}
          />
        }
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={pageCount}
        previousLabel={
          <FontAwesomeIcon
            className="fa-2x p-5 text-white"
            icon={faCaretLeft}
          />
        }
        renderOnZeroPageCount={null}
      />
    </div>
  );
};

export default PaginatedGames;
