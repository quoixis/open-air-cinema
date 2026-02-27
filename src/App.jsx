import { useSelector, useDispatch } from "react-redux";
import { Routes, Route } from "react-router-dom";
import "./App.css";

import Header from "./components/Header";
import EventList from "./components/EventList";
import RegisterPage from "./components/RegisterPage";
import ParticipantsPage from "./components/ParticipantsPage";
import AnalyticsPage from "./components/AnalyticsPage";

import { setSearch, toggleRegistered, selectFilteredEvents } from "./store/eventsSlice";

function App() {
  const theme = useSelector((state) => state.theme.mode);

  return (
    <div className={`app app--${theme}`}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register/:eventId" element={<RegisterPage />} />
        <Route path="/participants/:eventId" element={<ParticipantsPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
      </Routes>
    </div>
  );
}

function HomePage() {
  const dispatch = useDispatch();
  const search = useSelector((state) => state.events.search);
  const registered = useSelector((state) => state.events.registered);
  const filteredEvents = useSelector(selectFilteredEvents);

  return (
    <>
      <Header
        search={search}
        setSearch={(val) => dispatch(setSearch(val))}
      />
      <EventList
        events={filteredEvents}
        registered={registered}
        toggleRegistered={(id) => dispatch(toggleRegistered(id))}
      />
    </>
  );
}

export default App;