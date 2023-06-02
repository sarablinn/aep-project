import { useAtom } from 'jotai/index';
import { selectedUser } from '../services/Atoms';

const Footer = () => {
  const [currentUser] = useAtom(selectedUser);

  return (
    <footer
      className="container-fluid"
      style={{
        backgroundColor: currentUser.foregroundColor,
      }}
    >
      <p></p>
    </footer>
  );
};

export default Footer;
