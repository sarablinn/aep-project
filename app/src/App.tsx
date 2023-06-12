import Login from './components/Login';
import Footer from './components/Footer';
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

//tanstack router boiler-plate
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const queryClient = new QueryClient();

export default function App() {
  const [currentUser] = useAtom(selectedUser);
  const { isAuthenticated } = useAuth0();
  const [userInitials, setUserInitials] = useState('');

  useEffect(() => {
    if (isAuthenticated && currentUser.firstName && currentUser.lastName) {
      const firstInitial = currentUser.firstName.substring(0, 1);
      const lastInitial = currentUser.lastName.substring(0, 1);
      setUserInitials(firstInitial + lastInitial);
    } else {
      setUserInitials(currentUser.email.substring(0, 1));
    }
  }, [isAuthenticated, currentUser]);

  return (
    <div>
      <div
        className="content-container container-fluid"
        style={{ backgroundColor: currentUser.backgroundColor }}
      >
        {/*{showPopup()}*/}
        <QueryClientProvider client={queryClient}>
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
          </nav>

          <RouterProvider router={router} />
        </QueryClientProvider>
      </div>
      <Footer />
    </div>
  );
}
