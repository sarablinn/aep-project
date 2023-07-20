import { Link } from '@tanstack/react-router';
import { useAtom } from 'jotai';
import { selectedUser } from './../services/Atoms';
import { routes } from './../utilities/Constants';
import UserIcon from './UserIcon';
import { useAuth0 } from '@auth0/auth0-react';

const Navbar = () => {
  const { isAuthenticated } = useAuth0();
  const [currentUser] = useAtom(selectedUser);

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
              style={{ color: currentUser.foregroundColor, fontWeight: 'bold' }}
              to={routes.BASE}
              search={{}}
              params={{}}
            >
              home
            </Link>
            <Link
              style={{ color: currentUser.foregroundColor, fontWeight: 'bold' }}
              to={routes.EVENTS}
              search={{}}
              params={{}}
            >
              events
            </Link>
            <Link
              style={{ color: currentUser.foregroundColor, fontWeight: 'bold' }}
              to={routes.LEADERSHIP_BOARD}
              search={{}}
              params={{}}
            >
              leadership board
            </Link>
            <Link
              style={{ color: currentUser.foregroundColor, fontWeight: 'bold' }}
              to={routes.PROFILE}
              search={{}}
              params={{}}
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
              style={{ color: currentUser.foregroundColor, fontWeight: 'bold' }}
              to={routes.BASE}
              search={{}}
              params={{}}
            >
              home
            </Link>
            <Link
              style={{ color: currentUser.foregroundColor, fontWeight: 'bold' }}
              to={routes.LEADERSHIP_BOARD}
              search={{}}
              params={{}}
            >
              leadership board
            </Link>
            {isAuthenticated ? (
              <Link
                style={{
                  color: currentUser.foregroundColor,
                  fontWeight: 'bold',
                }}
                to={routes.PROFILE}
                search={{}}
                params={{}}
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
