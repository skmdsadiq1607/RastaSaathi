import { BrowserRouter } from 'react-router-dom';
import Router from './Router';
import OfflineBanner from '../components/shared/OfflineBanner';
import AlertToast from '../components/alerts/AlertToast';
import ErrorBoundary from '../components/shared/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <OfflineBanner />
        <AlertToast />
        <Router />
      </BrowserRouter>
    </ErrorBoundary>
  );
}
