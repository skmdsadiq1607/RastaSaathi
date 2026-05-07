import { lazy, Suspense, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { authApi } from '../features/auth/auth.api';
import { setCredentials } from '../features/auth/auth.slice';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import ProtectedRoute from '../components/shared/ProtectedRoute';
import RoleRoute from '../components/shared/RoleRoute';
import Layout from '../components/shared/Layout';
import ErrorBoundary from '../components/shared/ErrorBoundary';

const Login = lazy(() => import('../pages/auth/Login'));
const Register = lazy(() => import('../pages/auth/Register'));
const ForgotPassword = lazy(() => import('../pages/auth/ForgotPassword'));
const Home = lazy(() => import('../pages/victim/Home'));
const SOS = lazy(() => import('../pages/victim/SOS'));
const ActiveEmergency = lazy(() => import('../pages/victim/ActiveEmergency'));
const FirstAid = lazy(() => import('../pages/victim/FirstAid'));
const HospitalView = lazy(() => import('../pages/victim/HospitalView'));
const Timeline = lazy(() => import('../pages/victim/Timeline'));
const History = lazy(() => import('../pages/victim/History'));
const ResponderHome = lazy(() => import('../pages/responder/ResponderHome'));
const IncidentDetail = lazy(() => import('../pages/responder/IncidentDetail'));
const Navigation = lazy(() => import('../pages/responder/Navigation'));
const HandoffReport = lazy(() => import('../pages/responder/HandoffReport'));
const Dashboard = lazy(() => import('../pages/dashboard/Dashboard'));
const LiveMap = lazy(() => import('../pages/dashboard/LiveMap'));
const IncidentTable = lazy(() => import('../pages/dashboard/IncidentTable'));
const ResourceMonitor = lazy(() => import('../pages/dashboard/ResourceMonitor'));
const Insights = lazy(() => import('../pages/dashboard/Insights'));
const QueueMonitor = lazy(() => import('../pages/dashboard/QueueMonitor'));
const NotFound = lazy(() => import('../pages/shared/NotFound'));
const Unauthorized = lazy(() => import('../pages/shared/Unauthorized'));

function Page({ children }) { return <ErrorBoundary><Suspense fallback={<LoadingSpinner />}>{children}</Suspense></ErrorBoundary>; }
Page.propTypes = { children: PropTypes.node.isRequired };

export default function Router() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [refresh] = authApi.useRefreshMutation();
  useEffect(() => { refresh().unwrap().then((res) => dispatch(setCredentials(res.data))).catch(() => {}); }, [dispatch, refresh]);
  const home = user?.role === 'admin' ? '/dashboard' : user?.role === 'responder' ? '/responder' : '/home';
  return (
    <Routes>
      <Route path="/" element={<Navigate to={user ? home : '/login'} replace />} />
      <Route path="/login" element={<Page><Login /></Page>} />
      <Route path="/register" element={<Page><Register /></Page>} />
      <Route path="/forgot-password" element={<Page><ForgotPassword /></Page>} />
      <Route path="/unauthorized" element={<Page><Unauthorized /></Page>} />
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route element={<RoleRoute roles={['victim', 'admin']} />}>
            <Route path="/home" element={<Page><Home /></Page>} />
            <Route path="/sos" element={<Page><SOS /></Page>} />
            <Route path="/active/:incidentId?" element={<Page><ActiveEmergency /></Page>} />
            <Route path="/first-aid" element={<Page><FirstAid /></Page>} />
            <Route path="/hospital/:id" element={<Page><HospitalView /></Page>} />
            <Route path="/timeline/:incidentId" element={<Page><Timeline /></Page>} />
            <Route path="/history" element={<Page><History /></Page>} />
          </Route>
          <Route element={<RoleRoute roles={['responder', 'admin']} />}>
            <Route path="/responder" element={<Page><ResponderHome /></Page>} />
            <Route path="/responder/incident/:incidentId" element={<Page><IncidentDetail /></Page>} />
            <Route path="/responder/navigation/:incidentId" element={<Page><Navigation /></Page>} />
            <Route path="/responder/handoff/:incidentId" element={<Page><HandoffReport /></Page>} />
          </Route>
          <Route element={<RoleRoute roles={['admin']} />}>
            <Route path="/dashboard" element={<Page><Dashboard /></Page>} />
            <Route path="/dashboard/map" element={<Page><LiveMap /></Page>} />
            <Route path="/dashboard/incidents" element={<Page><IncidentTable /></Page>} />
            <Route path="/dashboard/resources" element={<Page><ResourceMonitor /></Page>} />
            <Route path="/dashboard/insights" element={<Page><Insights /></Page>} />
            <Route path="/dashboard/queues" element={<Page><QueueMonitor /></Page>} />
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<Page><NotFound /></Page>} />
    </Routes>
  );
}
