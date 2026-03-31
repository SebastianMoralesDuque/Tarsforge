import { useApp } from './context/AppContext';
import SetupPage from './pages/SetupPage';
import ConfigPage from './pages/ConfigPage';
import RunPage from './pages/RunPage';
import ComparePage from './pages/ComparePage';


export default function App() {
  const { page } = useApp();

  return (
    <>
      {page === 'setup' && <SetupPage />}
      {page === 'config' && <ConfigPage />}
      {page === 'run' && <RunPage />}
      {page === 'compare' && <ComparePage />}
    </>
  );
}