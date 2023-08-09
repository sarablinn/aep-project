import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { selectedUser } from '../services/Atoms';
import { useAtom } from 'jotai/index';
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

  const { mutate: getUserMutation, isLoading: loadingUser } = useMutation({
    mutationFn: (userToken: string) => getUserByToken(userToken),
    onMutate: () => console.log('AppContent: Mutate: getUserMutation'),
    onError: (err, variables, context) => {
      console.log(err, variables, context);
    },
    onSuccess: data => {
      if (data) {
        setCurrentUser(data);
        console.log('AppContent: Success: getUserMutation', currentUser);
      }
    },
    onSettled: () => {
      console.log('AppContent: Settled: getUserMutation');
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
  } else {
    return (
      <div>
        <div
          className="content-container container-fluid"
          style={{ backgroundColor: currentUser.backgroundColor }}
        >
          <RouterProvider router={router} />

          <ReactQueryDevtools />
        </div>
      </div>
    );
  }
};

export default AppContent;
