import { useAtom } from 'jotai';
import { selectedUser } from '../services/Atoms';
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import { routes } from '../utilities/Constants';
import Login from './Login';
import UserInfoPopup from './UserInfoPopup';

const UserIcon = () => {
  const [currentUser] = useAtom(selectedUser);
  const { user, isAuthenticated } = useAuth0();
  const [userInitials, setUserInitials] = useState('');
  const [isVisible, setIsVisible] = useState('VISIBLE');

  useEffect(() => {
    if (
      isAuthenticated &&
      currentUser.firstName != '' &&
      currentUser.lastName != ''
    ) {
      const firstInitial = currentUser.firstName.substring(0, 1);
      const lastInitial = currentUser.lastName.substring(0, 1);
      setUserInitials((firstInitial + lastInitial).toUpperCase());
    } else {
      setUserInitials(currentUser.email.substring(0, 1).toUpperCase());
    }
    if (currentUser.firstName == '' || currentUser.lastName == '') {
      setIsVisible('VISIBLE');
    } else {
      setIsVisible('INVISIBLE');
    }
  }, [isAuthenticated, currentUser, user]);

  return (
    <div className="container-fluid">
      <div className="flex flex-col">
        <div className="flex flex-col place-items-center">
          <button
            id="user-icon"
            className="text-center"
            style={{
              backgroundColor: currentUser.foregroundColor,
              color: currentUser.backgroundColor,
            }}
            onClick={() => window.location.replace(routes.PROFILE)}
          >
            {userInitials}
          </button>
          <Login />
        </div>
      </div>
      <div className="flex flex-row justify-center">
        <UserInfoPopup userResource={currentUser} isVisible={isVisible} />
      </div>
    </div>
  );
};

export default UserIcon;
