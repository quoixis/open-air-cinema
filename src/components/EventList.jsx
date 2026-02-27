import EventCard from "./EventCard";

function EventList({ events, registered, toggleRegistered }) {
  return (
    <div className="event-list">
      {events.length === 0 && <p>Подій не знайдено</p>}

      {events.map(event => (
        <EventCard
          key={event.id}
          event={event}
          isRegistered={registered.includes(event.id)}
          toggleRegistered={toggleRegistered}
        />
      ))}
    </div>
  );
}

export default EventList;