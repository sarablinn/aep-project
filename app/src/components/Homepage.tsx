import { selectedUser } from './../services/Atoms';
import { useAtom } from 'jotai';

const Homepage = () => {
  const [user] = useAtom(selectedUser);

  return (
    <div
      className={`grid grid-cols-4 py-2`}
      style={{
        backgroundColor: user.foregroundColor,
        color: user.backgroundColor,
      }}
    ></div>
  );
};

export default Homepage;
