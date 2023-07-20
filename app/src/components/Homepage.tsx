import { selectedUser } from './../services/Atoms';
import { useAtom } from 'jotai';
import { routes } from '../utilities/Constants';
import { Link } from '@tanstack/react-router';
import { changeColor, LightenColor } from '../services/colorChanger';
import { useState } from 'react';

const Homepage = () => {
  const [currentUser] = useAtom(selectedUser);

  // const darken_bg_10 = changeColor(currentUser.backgroundColor, -10);
  const darken_fg_10 = changeColor(currentUser.foregroundColor, -10);

  const lighten_bg_5 = LightenColor(currentUser.backgroundColor, 5);
  const lighten_fg_5 = LightenColor(currentUser.foregroundColor, 5);

  // const [bgDarker_10] = useState(darken_bg_10);
  const [fgDarker_10] = useState(darken_fg_10);
  const [bgLighter_5] = useState(lighten_bg_5);
  const [fgLighter_5] = useState(lighten_fg_5);

  return (
    <div
      style={{
        position: 'relative',
      }}
    >
      <div
        className="container"
        style={{
          minWidth: '100%',
          minHeight: '30%',
          height: '30vh',
          // backgroundColor: 'whitesmoke',
          zIndex: '1',
        }}
      >
        {/* main numbers title */}
        <Link to={routes.BASE} search={{}} params={{}}>
          <h1
            className="pl-10"
            style={{
              color: bgLighter_5,
              fontSize: '10rem',
              fontWeight: 'bolder',
              position: 'absolute',
              top: '4vh',
              zIndex: '9',
            }}
          >
            NUMBERS
          </h1>
        </Link>
        <div
          className="container"
          style={{
            minWidth: '100%',
            minHeight: '40%',
            maxHeight: '50%',
            height: '55vh',
            backgroundColor: fgDarker_10,
            position: 'absolute',
            top: '9vh',
            zIndex: '2',
          }}
        >
          {/* second numbers title */}
          <h1
            className="pl-20"
            style={{
              color: fgLighter_5,
              fontSize: '10em',
              fontWeight: 'bolder',
              position: 'relative',
              top: '8vh',
              zIndex: '9',
            }}
          >
            NUMBERS
          </h1>
        </div>
      </div>
      <div
        className="container-fluid p-10 pr-20"
        style={{ position: 'relative', zIndex: '10' }}
      >
        <div
          className="container-fluid m-10 flex justify-end p-10"
          style={{ backgroundColor: '' }}
        >
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
