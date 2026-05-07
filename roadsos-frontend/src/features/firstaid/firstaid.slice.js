import { createSlice } from '@reduxjs/toolkit';
const storage =
  typeof window !== 'undefined' &&
  window.localStorage &&
  typeof window.localStorage.getItem === 'function'
    ? window.localStorage
    : null;
const firstAidSlice = createSlice({ name: 'firstaid', initialState: { session: null, cachedGuidance: storage?.getItem('roadsos_firstaid_cache') || '' }, reducers: { setFirstAidSession: (state, action) => { state.session = action.payload; if (action.payload?.guidance) { state.cachedGuidance = action.payload.guidance; storage?.setItem('roadsos_firstaid_cache', action.payload.guidance); } } } });
export const { setFirstAidSession } = firstAidSlice.actions;
export default firstAidSlice.reducer;
