import Login from './components/Login';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import { router } from './routes';
import './App.css';
import './styles/navbar.css';

//tanstack router boiler-plate
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const queryClient = new QueryClient();

export default function App() {
  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <nav id="navbar-main" className="container">
          <h1 className="title-text text-3xl font-bold">WELCOME</h1>
          <div className="navbar-btns container flex">
            <Login />
          </div>
        </nav>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </div>
  );
}
