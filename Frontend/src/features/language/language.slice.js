import { createSlice } from '@reduxjs/toolkit';
const storage =
  typeof window !== 'undefined' &&
  window.localStorage &&
  typeof window.localStorage.getItem === 'function'
    ? window.localStorage
    : null;
const browserLanguage =
  typeof navigator !== 'undefined' && navigator.language ? navigator.language.slice(0, 2) : 'en';
const languageSlice = createSlice({ name: 'language', initialState: { language: storage?.getItem('roadsos_language') || browserLanguage || 'en' }, reducers: { setLanguage: (state, action) => { state.language = action.payload; storage?.setItem('roadsos_language', action.payload); } } });
export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
