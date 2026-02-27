import { Link } from "react-router-dom";

function EventCard({ event, isRegistered, toggleRegistered }) {
  return (
    <div className="event-card">
      <h2>{event.title}</h2>
      <p>{event.description}</p>
      <p><strong>Дата:</strong> {event.date}</p>
      <p><strong>Організатор:</strong> {event.organizer}</p>

      <div className="card-buttons">
        <button
          className="btn btn-primary"
          onClick={() => toggleRegistered(event.id)}
        >
          {isRegistered ? "Зняти бронь" : "Цікаво"}
        </button>

        <Link to={`/participants/${event.id}`} className="btn btn-secondary">
          Учасники
        </Link>
      </div>
    </div>
  );
}

export default EventCard;