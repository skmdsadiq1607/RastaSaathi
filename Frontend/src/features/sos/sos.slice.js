import { createSlice } from '@reduxjs/toolkit';
const sosSlice = createSlice({ name: 'sos', initialState: { activeSOS: null, countdown: 0 }, reducers: { setActiveSOS: (state, action) => { state.activeSOS = action.payload; }, clearActiveSOS: (state) => { state.activeSOS = null; }, setCountdown: (state, action) => { state.countdown = action.payload; } } });
export const { setActiveSOS, clearActiveSOS, setCountdown } = sosSlice.actions;
export default sosSlice.reducer;
