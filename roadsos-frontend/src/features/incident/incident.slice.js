import { createSlice } from '@reduxjs/toolkit';
const incidentSlice = createSlice({ name: 'incident', initialState: { activeIncident: null, incidents: [] }, reducers: { setActiveIncident: (state, action) => { state.activeIncident = action.payload; }, upsertIncident: (state, action) => { const index = state.incidents.findIndex((item) => item._id === action.payload._id); if (index >= 0) state.incidents[index] = action.payload; else state.incidents.unshift(action.payload); } } });
export const { setActiveIncident, upsertIncident } = incidentSlice.actions;
export default incidentSlice.reducer;
