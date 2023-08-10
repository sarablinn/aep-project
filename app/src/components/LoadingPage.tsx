import { useAtom } from 'jotai/index';
import { selectedUser } from '../services/Atoms';
import Loading from '../utilities/Loading';

/**
 * Creates a whole page component with a Loading component and following the
 * current user theme.
 *
 * @constructor
 */
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
