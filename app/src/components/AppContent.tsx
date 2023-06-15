import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { selectedUser } from '../services/Atoms';
import { useAtom } from 'jotai/index';
import { routes } from '../utilities/Constants';
import Login from './Login';
import UserInfoPopup from './UserInfoPopup';
import { RouterProvider } from '@tanstack/react-router';
import { router } from '../routes';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useMutation } from '@tanstack/react-query';
import { getUserByToken } from '../services/userApi';
import LoadingPage from './LoadingPage';

//tanstack router boiler-plate
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const AppContent = () => {
  const [currentUser, setCurrentUser] = useAtom(selectedUser);
  const { user, isAuthenticated } = useAuth0();
  const [userInitials, setUserInitials] = useState('');
  const [isVisible, setIsVisible] = useState('INVISIBLE');

  const [userToken, setUserToken] = useState(user?.sub || '');

  useEffect(() => {
    if (isAuthenticated && currentUser.firstName && currentUser.lastName) {
      const firstInitial = currentUser.firstName.substring(0, 1);
      const lastInitial = currentUser.lastName.substring(0, 1);
      // console.log('--SETTING INITIALS--');
      setUserInitials(firstInitial + lastInitial);
    } else {
      setUserInitials(currentUser.email.substring(0, 1));
    }
  }, [isAuthenticated, currentUser, user]);

  useEffect(() => {
    if (isAuthenticated && currentUser.firstName == '') {
      setIsVisible('VISIBLE');
    }
    if (currentUser.firstName != '') {
      setIsVisible('INVISIBLE');
    }
  }, [isAuthenticated, currentUser.firstName]);

  const {
    data: resultsFromGetUser,
    mutate: getUserMutation,
    isLoading: loadingUser,
  } = useMutation({
    mutationFn: (userToken: string) => getUserByToken(userToken),
    onMutate: () => console.log('mutate getUserByToken on AppContent'),
    onError: (err, variables, context) => {
      console.log(err, variables, context);
    },
    onSuccess: data => {
      if (data) {
        setCurrentUser(data);
        console.log(
          'getUserMutation on AppContent onSuccess REACHED!',
          currentUser,
        );
      }
    },
    onSettled: () => {
      console.log('getUserMutation on AppContent Settled.');
    },
  });

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.sub) {
        getUserMutation(user.sub);
      }
    }
  }, [isAuthenticated, user]);

  if (loadingUser) {
    return (
      <div className="min-h-100">
        <LoadingPage />
      </div>
    );
  }

  return (
    <div>
      <div
        className="content-container container-fluid"
        style={{ backgroundColor: currentUser.backgroundColor }}
      >
        {/*{showPopup()}*/}

        <nav
          id="navbar-main"
          className="container"
          style={{ backgroundColor: currentUser.foregroundColor }}
        >
          <div className="container-fluid">
            <div className="container p-6">
              <div className="">
                <h1 className="title-text text-3xl font-bold">NUMBERS</h1>
              </div>
              <div className="">
                <div className="flex flex-col items-end px-4 pt-4">
                  <button
                    id="user-icon"
                    className="text-center"
                    style={{
                      backgroundColor: currentUser.backgroundColor,
                      color: currentUser.foregroundColor,
                    }}
                    onClick={() => window.location.replace(routes.PROFILE)}
                  >
                    {userInitials}
                  </button>
                  <Login />
                </div>
              </div>
            </div>

            {/*<div className="">*/}
            {/*  <h1 className="title-text text-3xl font-bold">NUMBERS</h1>*/}
            {/*</div>*/}
          </div>
          <div className="flex flex-row justify-center">
            <UserInfoPopup userResource={currentUser} isVisible={isVisible} />
          </div>
        </nav>

        <RouterProvider router={router} />
        <ReactQueryDevtools />
      </div>
    </div>
  );
};

export default AppContent;
