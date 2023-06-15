import { useAtom } from 'jotai/index';
import { selectedUser } from '../services/Atoms';
import Loading from '../utilities/Loading';

const LoadingPage = () => {
  const [currentUser] = useAtom(selectedUser);

  return (
    <div
      className="min-h-screen pt-10"
      style={{ backgroundColor: currentUser.backgroundColor }}
    >
      <Loading />
    </div>
  );
};

export default LoadingPage;
