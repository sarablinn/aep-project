import { Link } from '@tanstack/react-router';
import { useAtom } from 'jotai';
import { selectedUser } from './../services/Atoms';
import { routes } from './../utilities/Constants';

const Navbar = () => {
  const [user] = useAtom(selectedUser);
  return (
    <div
      className={`flex justify-evenly border`}
      style={{ backgroundColor: user.backgroundColor }}
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
    </div>
  );
};

export default Navbar;
