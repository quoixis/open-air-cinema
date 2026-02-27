import { configureStore } from "@reduxjs/toolkit";
import eventsReducer from "./eventsSlice";
import participantsReducer from "./participantsSlice";
import themeReducer from "./themeSlice";
import analyticsReducer from "./analyticsSlice";

const store = configureStore({
  reducer: {
    events: eventsReducer,
    participants: participantsReducer,
    theme: themeReducer,
    analytics: analyticsReducer,
  },
});

export default store;