import { selectedUser } from './../services/Atoms';
import { useAtom } from 'jotai';
import { routes } from '../utilities/Constants';
import { Link } from '@tanstack/react-router';

const Homepage = () => {
  const [user] = useAtom(selectedUser);

  return (
    <div>
      <div
        className={`grid grid-cols-4 py-2`}
        style={{
          backgroundColor: user.foregroundColor,
          color: user.backgroundColor,
        }}
      ></div>
      <div className="container-fluid p-10">
        <div className="container-fluid m-10 flex justify-center p-10">
          <button className="m-1 rounded bg-pink-500 p-3 font-bold text-white shadow outline-none hover:shadow-lg focus:outline-none active:bg-pink-600">
            <Link to={routes.GAMES} search={{}} params={{}}>
              START
            </Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
