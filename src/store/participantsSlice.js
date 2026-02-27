import { createSlice, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";

const participantsAdapter = createEntityAdapter();

export const fetchParticipants = createAsyncThunk(
  "participants/fetchParticipants",
  async () => {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");

    if (!response.ok) {
      throw new Error("Не вдалося завантажити учасників");
    }

    const data = await response.json();

    return data.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
    }));
  }
);

const participantsSlice = createSlice({
  name: "participants",

  initialState: participantsAdapter.getInitialState({
    loading: false,
    error: null,
    search: "",
  }),

  reducers: {
    setParticipantsSearch(state, action) {
      state.search = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(fetchParticipants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchParticipants.fulfilled, (state, action) => {
        state.loading = false;

        participantsAdapter.setAll(state, action.payload);
      })

      .addCase(fetchParticipants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setParticipantsSearch } = participantsSlice.actions;

const adapterSelectors = participantsAdapter.getSelectors(
  (state) => state.participants
);

export const selectFilteredParticipants = (state) => {
  const all = adapterSelectors.selectAll(state);
  const search = state.participants.search.toLowerCase();

  if (!search) return all;

  return all.filter(p =>
    p.name.toLowerCase().includes(search) ||
    p.email.toLowerCase().includes(search)
  );
};

export default participantsSlice.reducer;