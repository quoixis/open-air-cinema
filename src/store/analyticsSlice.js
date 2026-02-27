import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchAnalytics = createAsyncThunk(
  "analytics/fetchAnalytics",
  async () => {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    if (!response.ok) throw new Error("Не вдалося завантажити дані аналітики");
    const posts = await response.json();

    const eventDates = [
      "2026-06-15", "2026-06-20", "2026-06-25",
      "2026-07-01", "2026-07-05", "2026-07-10",
      "2026-07-15", "2026-07-18", "2026-07-22", "2026-07-30"
    ];

    return posts.map((post, index) => ({
      id: post.id,
      eventId: post.userId,
      date: eventDates[index % eventDates.length],
      name: post.title.slice(0, 20),
    }));
  }
);

const analyticsSlice = createSlice({
  name: "analytics",
  initialState: {
    registrations: [],
    loading: false,
    error: null,
  },

  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.registrations = action.payload;
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const selectRegistrationsByDate = (state) => {
  const regs = state.analytics.registrations;

  const countByDate = {};
  regs.forEach((reg) => {
    countByDate[reg.date] = (countByDate[reg.date] || 0) + 1;
  });

  return Object.entries(countByDate)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));
};

export const selectRegistrationsByEvent = (state) => {
  const regs = state.analytics.registrations;

  const countByEvent = {};
  regs.forEach((reg) => {
    countByEvent[reg.eventId] = (countByEvent[reg.eventId] || 0) + 1;
  });

  const eventTitles = {
    1: "Inception", 2: "Interstellar", 3: "Dark Knight",
    4: "Blade Runner", 5: "Fight Club", 6: "Dune",
    7: "Matrix", 8: "Pulp Fiction", 9: "Avatar", 10: "LOTR"
  };

  return Object.entries(countByEvent)
    .map(([eventId, count]) => ({
      eventId: Number(eventId),
      title: eventTitles[eventId] || `Подія ${eventId}`,
      count,
    }))
    .sort((a, b) => a.eventId - b.eventId);
};

export default analyticsSlice.reducer;