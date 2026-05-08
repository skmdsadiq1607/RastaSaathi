import { configureStore } from '@reduxjs/toolkit';
import { configureApiClient, apiClient } from '../config/api';
import authReducer, { setCredentials, clearCredentials } from '../features/auth/auth.slice';
import sosReducer from '../features/sos/sos.slice';
import incidentReducer from '../features/incident/incident.slice';
import hospitalReducer from '../features/hospital/hospital.slice';
import firstAidReducer from '../features/firstaid/firstaid.slice';
import timelineReducer from '../features/timeline/timeline.slice';
import alertsReducer from '../features/alerts/alerts.slice';
import languageReducer from '../features/language/language.slice';
import { authApi } from '../features/auth/auth.api';
import { sosApi } from '../features/sos/sos.api';
import { incidentApi } from '../features/incident/incident.api';
import { severityApi } from '../features/severity/severity.api';
import { hospitalApi } from '../features/hospital/hospital.api';
import { routingApi } from '../features/routing/routing.api';
import { firstAidApi } from '../features/firstaid/firstaid.api';
import { timelineApi } from '../features/timeline/timeline.api';
import { resourcesApi } from '../features/resources/resources.api';
import { insightsApi } from '../features/insights/insights.api';
import { dashboardApi } from '../features/dashboard/dashboard.api';
import { summaryApi } from '../features/summary/summary.api';
import { transparencyApi } from '../features/transparency/transparency.api';

const apis = [authApi, sosApi, incidentApi, severityApi, hospitalApi, routingApi, firstAidApi, timelineApi, resourcesApi, insightsApi, dashboardApi, summaryApi, transparencyApi];

export const store = configureStore({
  reducer: {
    auth: authReducer,
    sos: sosReducer,
    incident: incidentReducer,
    hospital: hospitalReducer,
    firstaid: firstAidReducer,
    timeline: timelineReducer,
    alerts: alertsReducer,
    language: languageReducer,
    ...Object.fromEntries(apis.map((api) => [api.reducerPath, api.reducer]))
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }).concat(apis.map((api) => api.middleware))
});

configureApiClient({
  getAccessToken: () => store.getState().auth.accessToken,
  onRefresh: async () => {
    try {
      const response = await apiClient.post('/api/auth/refresh', {});
      store.dispatch(setCredentials(response.data.data));
      return response.data.data.accessToken;
    } catch (_error) {
      store.dispatch(clearCredentials());
      return null;
    }
  },
  onForbidden: () => { window.location.assign('/unauthorized'); }
});
