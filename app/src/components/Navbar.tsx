import { Link } from '@tanstack/react-router';
import { useAtom } from 'jotai';
import { selectedUser } from './../services/Atoms';
import { routes } from './../utilities/Constants';
import UserIcon from './UserIcon';
import { useAuth0 } from '@auth0/auth0-react';
import { LightenColor } from '../services/colorChanger';
import { useState } from 'react';

const Navbar = () => {
  const { isAuthenticated } = useAuth0();
  const [currentUser] = useAtom(selectedUser);

  const lighten_fg_5 = LightenColor(currentUser.foregroundColor, 5);
  const [fgLighter_5] = useState(lighten_fg_5);

  const [isHoverHome, setIsHoverHome] = useState(false);
  const [isHoverEvents, setIsHoverEvents] = useState(false);
  const [isHoverLBoard, setIsHoverLBoard] = useState(false);
  const [isHoverProfile, setIsHoverProfile] = useState(false);

  const handleMouseOverHome = () => {
    setIsHoverHome(true);
  };

  const handleMouseLeaveHome = () => {
    setIsHoverHome(false);
  };

  const handleMouseOverEvents = () => {
    setIsHoverEvents(true);
  };

  const handleMouseLeaveEvents = () => {
    setIsHoverEvents(false);
  };

  const handleMouseOverLBoard = () => {
    setIsHoverLBoard(true);
  };

  const handleMouseLeaveLBoard = () => {
    setIsHoverLBoard(false);
  };

  const handleMouseOverProfile = () => {
    setIsHoverProfile(true);
  };

  const handleMouseLeaveProfile = () => {
    setIsHoverProfile(false);
  };

  if (currentUser.roleId === 2) {
    return (
      <div className="container-fluid">
        <div className="justify-between space-x-8">
          <div
            className={`flex justify-evenly p-2 pt-5`}
            style={{
              backgroundColor: currentUser.backgroundColor,
            }}
          >
            <Link
              style={{
                color: isHoverHome ? fgLighter_5 : currentUser.foregroundColor,
                fontWeight: 'bold',
                height: 'fit-content',
              }}
              to={routes.BASE}
              search={{}}
              params={{}}
              onMouseOver={handleMouseOverHome}
              onMouseLeave={handleMouseLeaveHome}
            >
              home
            </Link>
            <Link
              style={{
                color: isHoverEvents
                  ? fgLighter_5
                  : currentUser.foregroundColor,
                fontWeight: 'bold',
                height: 'fit-content',
              }}
              to={routes.EVENTS}
              search={{}}
              params={{}}
              onMouseOver={handleMouseOverEvents}
              onMouseLeave={handleMouseLeaveEvents}
            >
              events
            </Link>
            <Link
              style={{
                color: isHoverLBoard
                  ? fgLighter_5
                  : currentUser.foregroundColor,
                fontWeight: 'bold',
                height: 'fit-content',
              }}
              to={routes.LEADERSHIP_BOARD}
              search={{}}
              params={{}}
              onMouseOver={handleMouseOverLBoard}
              onMouseLeave={handleMouseLeaveLBoard}
            >
              leadership board
            </Link>
            <Link
              style={{
                color: isHoverProfile
                  ? fgLighter_5
                  : currentUser.foregroundColor,
                fontWeight: 'bold',
                height: 'fit-content',
              }}
              to={routes.PROFILE}
              search={{}}
              params={{}}
              onMouseOver={handleMouseOverProfile}
              onMouseLeave={handleMouseLeaveProfile}
            >
              user profile
            </Link>
            <UserIcon />
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="container-fluid">
        <div className="justify-between space-x-8">
          <div
            className={`flex justify-evenly p-2 pt-5`}
            style={{
              backgroundColor: currentUser.backgroundColor,
            }}
          >
            <Link
              style={{
                color: isHoverHome ? fgLighter_5 : currentUser.foregroundColor,
                fontWeight: 'bold',
                height: 'fit-content',
              }}
              to={routes.BASE}
              search={{}}
              params={{}}
              onMouseOver={handleMouseOverHome}
              onMouseLeave={handleMouseLeaveHome}
            >
              home
            </Link>
            <Link
              style={{
                color: isHoverLBoard
                  ? fgLighter_5
                  : currentUser.foregroundColor,
                fontWeight: 'bold',
                height: 'fit-content',
              }}
              to={routes.LEADERSHIP_BOARD}
              search={{}}
              params={{}}
              onMouseOver={handleMouseOverLBoard}
              onMouseLeave={handleMouseLeaveLBoard}
            >
              leadership board
            </Link>
            {isAuthenticated ? (
              <Link
                style={{
                  color: isHoverProfile
                    ? fgLighter_5
                    : currentUser.foregroundColor,
                  fontWeight: 'bold',
                  height: 'fit-content',
                }}
                to={routes.PROFILE}
                search={{}}
                params={{}}
                onMouseOver={handleMouseOverProfile}
                onMouseLeave={handleMouseLeaveProfile}
              >
                user profile
              </Link>
            ) : null}
            <UserIcon />
          </div>
        </div>
      </div>
    );
  }
};

export default Navbar;
