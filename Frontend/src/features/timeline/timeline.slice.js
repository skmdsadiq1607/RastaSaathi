import { createSlice } from '@reduxjs/toolkit';
const timelineSlice = createSlice({ name: 'timeline', initialState: { events: [] }, reducers: { setTimeline: (state, action) => { state.events = action.payload || []; }, appendTimelineEvent: (state, action) => { state.events.push(action.payload); } } });
export const { setTimeline, appendTimelineEvent } = timelineSlice.actions;
export default timelineSlice.reducer;
