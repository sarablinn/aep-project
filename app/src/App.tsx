import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'jotai/index';
import { queryClientAtom } from 'jotai-tanstack-query';
import { useHydrateAtoms } from 'jotai/react/utils';

import './App.css';
import './styles/navbar.css';
import Footer from './components/Footer';
import AppContent from './components/AppContent';

const queryClient = new QueryClient();

export default function App() {
  const HydrateAtoms = ({ children }) => {
    useHydrateAtoms([[queryClientAtom, queryClient]]);
    return children;
  };

  return (
    <div className="min-h-screen">
      <QueryClientProvider client={queryClient}>
        <Provider>
          <HydrateAtoms>
            <AppContent />
            <Footer />
          </HydrateAtoms>
        </Provider>
      </QueryClientProvider>
    </div>
  );
}
