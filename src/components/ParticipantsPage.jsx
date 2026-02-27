import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import eventsData from "../data/events";
import Header from "./Header";

import {
  fetchParticipants,
  setParticipantsSearch,
  selectFilteredParticipants
} from "../store/participantsSlice";

function ParticipantsPage() {
  const { eventId } = useParams();
  const dispatch = useDispatch();
  const event = eventsData.find(e => e.id === Number(eventId));

  const loading = useSelector((state) => state.participants.loading);
  const error = useSelector((state) => state.participants.error);
  const participants = useSelector(selectFilteredParticipants);
  const search = useSelector((state) => state.participants.search);

  useEffect(() => {
    dispatch(fetchParticipants(eventId));
  }, [eventId, dispatch]);

  if (!event) {
    return (
      <div className="app">
        <Header showSearch={false} />
        <div style={{ padding: "40px", textAlign: "center" }}>
          <p>Подію не знайдено</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <Header showSearch={false} />

      <div className="participants-page">
        <div className="participants-header">
          <h2>"{event.title}"</h2>
          <Link to={`/register/${eventId}`} className="btn btn-secondary">
            Зареєструватися
          </Link>
        </div>

        <input
          className="participants-search"
          type="text"
          placeholder="Пошук за іменем або email..."
          value={search}
          onChange={(e) => dispatch(setParticipantsSearch(e.target.value))}
        />

        {loading && (
          <div className="spinner-wrapper">
            <div className="spinner" />
            <p>Завантаження учасників...</p>
          </div>
        )}

        {error && (
          <div className="error-toast">
            Помилка: {error}
          </div>
        )}

        {!loading && !error && (
          <div className="participants-grid">
            {participants.map(participant => (
              <div key={participant.id} className="participant-card">
                <strong>{participant.name}</strong>
                <span>{participant.email}</span>
              </div>
            ))}
            {participants.length === 0 && (
              <p style={{ color: "#999" }}>Нікого не знайдено</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ParticipantsPage;