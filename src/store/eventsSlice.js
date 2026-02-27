import { createSlice } from "@reduxjs/toolkit";
import eventsData from "../data/events";

const eventsSlice = createSlice({
  name: "events",
  initialState: {
    items: eventsData,

    search: "",
    registered: (() => {
      try {
        return JSON.parse(localStorage.getItem("registered")) ?? [];
      } catch {
        return [];
      }
    })(),
  },

  reducers: {
    setSearch(state, action) {
      state.search = action.payload;
    },

    toggleRegistered(state, action) {
      const id = action.payload;
      if (state.registered.includes(id)) {
        state.registered = state.registered.filter(item => item !== id);
      } else {
        state.registered.push(id);
      }

      localStorage.setItem("registered", JSON.stringify(state.registered));
    },
  },
});

export const { setSearch, toggleRegistered } = eventsSlice.actions;

export const selectFilteredEvents = (state) => {
  const { items, search } = state.events;
  return items.filter(event =>
    event.title.toLowerCase().includes(search.toLowerCase())
  );
};

export default eventsSlice.reducer;