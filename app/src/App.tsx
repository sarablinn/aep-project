import Login from './components/Login';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import { router } from './routes';
import './App.css';
import './styles/navbar.css';
import { useAtom } from 'jotai/index';
import { selectedUser } from './services/Atoms';
import { useAuth0 } from '@auth0/auth0-react';
import { routes } from './utilities/Constants';
import { useEffect, useState } from 'react';
import Loading from './utilities/Loading';

//tanstack router boiler-plate
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const queryClient = new QueryClient();

export default function App() {
  const [currentUser] = useAtom(selectedUser);
  const { isLoading, isAuthenticated } = useAuth0();
  const [userInitials, setUserInitials] = useState('');

  // const showPopup = () => {
  //   if (isAuthenticated) {
  //     console.log('IS AUTHENTICATED');
  //     if (currentUser.firstName == '' || currentUser.lastName == '') {
  //       console.log('EMPTY FIRSTNAME AND LASTNAME');
  //
  //       return (
  //         <div>
  //           <UserInfoPopup userResource={currentUser} isVisible="VISIBLE" />
  //         </div>
  //       );
  //     }
  //   }
  //   return <></>;
  // };

  useEffect(() => {
    console.log('CURRENT USER ON MAIN LOGIN', currentUser);
    if (currentUser.firstName && currentUser.lastName) {
      const firstInitial = currentUser.firstName.substring(0, 1);
      const lastInitial = currentUser.lastName.substring(0, 1);
      setUserInitials(firstInitial + lastInitial);
    } else {
      setUserInitials(currentUser.email.substring(0, 1));
    }
  }, [isAuthenticated, currentUser]);
  //
  // if (isLoading) {
  //   return <Loading />;
  // }

  return (
    <div>
      {/*{showPopup()}*/}
      <div
        className="container-fluid"
        style={{ backgroundColor: currentUser.backgroundColor }}
      >
        <QueryClientProvider client={queryClient}>
          <nav
            id="navbar-main"
            className="container"
            style={{ backgroundColor: currentUser.foregroundColor }}
          >
            <div className="">
              <button
                id="user-icon"
                className=""
                style={{
                  backgroundColor: currentUser.backgroundColor,
                  color: currentUser.foregroundColor,
                }}
                onClick={() => window.location.replace(routes.PROFILE)}
              >
                {userInitials}
              </button>
              <h1 className="title-text text-3xl font-bold">WELCOME</h1>
              <div className="navbar-btns container flex">
                <Login />
              </div>
            </div>
          </nav>

          <div className={`flex justify-evenly border`}></div>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </div>
    </div>
  );
}
