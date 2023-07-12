import { Link } from '@tanstack/react-router';
import { useAtom } from 'jotai';
import { selectedUser } from './../services/Atoms';
import { routes } from './../utilities/Constants';

const Navbar = () => {
  const [currentUser] = useAtom(selectedUser);

  if (currentUser.roleId === 2) {
    return (
      <div
        className={`flex justify-evenly p-2 text-white`}
        style={{ backgroundColor: currentUser.foregroundColor }}
      >
        <Link to={routes.BASE} search={{}} params={{}}>
          Home
        </Link>
        {/*<Link to={routes.USERS} search={{}} params={{}}>*/}
        {/*  Users Page*/}
        {/*</Link>*/}
        {/*<Link to={routes.ROLE} search={{}} params={{}}>*/}
        {/*  Roles*/}
        {/*</Link>*/}
        <Link to={routes.EVENTS} search={{}} params={{}}>
          Events
        </Link>
        <Link to={routes.LEADERSHIP_BOARD} search={{}} params={{}}>
          Leadership Board
        </Link>
        <Link to={routes.PROFILE} search={{}} params={{}}>
          User Profile
        </Link>
      </div>
    );
  } else {
    return (
      <div
        className={`flex justify-evenly p-2 text-white`}
        style={{ backgroundColor: currentUser.foregroundColor }}
      >
        <Link to={routes.BASE} search={{}} params={{}}>
          Home
        </Link>
        {/*<Link to={routes.USERS} search={{}} params={{}}>*/}
        {/*  Users Page*/}
        {/*</Link>*/}
        {/*<Link to={routes.ROLE} search={{}} params={{}}>*/}
        {/*  Roles*/}
        {/*</Link>*/}
        <Link to={routes.LEADERSHIP_BOARD} search={{}} params={{}}>
          Leadership Board
        </Link>
        <Link to={routes.PROFILE} search={{}} params={{}}>
          User Profile
        </Link>
      </div>
    );
  }
};

export default Navbar;
