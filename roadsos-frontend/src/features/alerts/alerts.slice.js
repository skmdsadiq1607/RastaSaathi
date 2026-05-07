import { createSlice } from '@reduxjs/toolkit';
const alertsSlice = createSlice({ name: 'alerts', initialState: { items: [] }, reducers: { pushAlert: (state, action) => { state.items.unshift(action.payload); state.items = state.items.slice(0, 10); }, dismissAlert: (state, action) => { state.items = state.items.filter((item) => item.id !== action.payload); } } });
export const { pushAlert, dismissAlert } = alertsSlice.actions;
export default alertsSlice.reducer;
