import { createSlice } from '@reduxjs/toolkit';

const storage =
  typeof window !== 'undefined' &&
  window.localStorage &&
  typeof window.localStorage.getItem === 'function'
    ? window.localStorage
    : null;
const storedUser = JSON.parse(storage?.getItem('roadsos_user') || 'null');
const initialState = { user: storedUser, accessToken: null, status: 'idle' };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action) { state.user = action.payload.user; state.accessToken = action.payload.accessToken; storage?.setItem('roadsos_user', JSON.stringify(action.payload.user)); },
    clearCredentials(state) { state.user = null; state.accessToken = null; storage?.removeItem('roadsos_user'); },
    setAuthStatus(state, action) { state.status = action.payload; }
  }
});
export const { setCredentials, clearCredentials, setAuthStatus } = authSlice.actions;
export default authSlice.reducer;
