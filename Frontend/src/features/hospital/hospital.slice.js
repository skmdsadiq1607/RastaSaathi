import { createSlice } from '@reduxjs/toolkit';
const hospitalSlice = createSlice({ name: 'hospital', initialState: { selected: null, ranked: [] }, reducers: { setHospitalSelection: (state, action) => { state.selected = action.payload.selected; state.ranked = action.payload.ranked || []; } } });
export const { setHospitalSelection } = hospitalSlice.actions;
export default hospitalSlice.reducer;
