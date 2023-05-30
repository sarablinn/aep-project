import { Link } from '@tanstack/react-router';
import { useAtom } from 'jotai';
import { selectedUser } from './../services/Atoms';
import { routes } from './../utilities/Constants';

const Navbar = () => {
  const [user] = useAtom(selectedUser);
  return (
    <div
      className={`m-0 flex justify-evenly`}
      style={{ backgroundColor: user.foregroundColor }}
    >
      <Link to={routes.BASE} search={{}} params={{}}>
        Home
      </Link>
      <Link to={routes.USERS} search={{}} params={{}}>
        User Page
      </Link>
      <Link to={routes.ROLE} search={{}} params={{}}>
        Roles
      </Link>
      <Link to={routes.PROFILE} search={{}} params={{}}>
        User Profile
      </Link>
    </div>
  );
};

export default Navbar;
