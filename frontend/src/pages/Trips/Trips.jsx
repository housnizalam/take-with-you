import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import apiConfig from "../../config/apiConfig.js";
import { getCurrentUser } from "../../auth/currentUser.js";
import loginPhoto from "../../assets/images/log_in_photo.png";
import tripsPhoto from "../../assets/images/trips_photo.png";
import "./Trips.css";

function Trips() {
  const [trips, setTrips] = useState([]);

  const currentUser = getCurrentUser();

  useEffect(() => {
    async function loadTrips() {
      try {
        const response = await fetch(`${apiConfig.baseUrl}/api/trips`);

        const data = await response.json();

        const ownTrips = data.filter((trip) => trip.ownerId === currentUser.id);

        setTrips(ownTrips);
      } catch (error) {
        console.error("Error loading trips:", error);
      }
    }

    loadTrips();
  }, []);

  return (
    <div
      className="trips-page"
      style={{
        backgroundImage: `
      linear-gradient(
        rgba(6, 15, 35, 0.1),
        rgba(6, 15, 35, 0.4)
      ),
      url(${tripsPhoto})
    `,
      }}
    >
      <div className="trips-page__header">
        <div>
          <span className="trips-page__eyebrow">YOUR JOURNEYS</span>

          <h1>My Trips</h1>

          <p>Manage the trips you are offering.</p>
        </div>

        <Link to="/trips/new" className="trips-page__create">
          + Create Trip
        </Link>
      </div>

      <div className="trips-grid">
        {trips.map((trip) => {
          const image =
            trip.carImages?.length > 0
              ? `${apiConfig.baseUrl}${trip.carImages[0]}`
              : loginPhoto;

          return (
            <Link
              key={trip._id}
              to={`/trips/${trip._id}`}
              className="trip-card"
            >
              <div
                className="trip-card__image"
                style={{
                  backgroundImage: `url(${image})`,
                }}
              />

              <div className="trip-card__content">
                <div className="trip-card__route">
                  {trip.from} → {trip.to}
                </div>

                <div className="trip-card__meta">
                  <span>{trip.date}</span>

                  <span>{trip.availableSeats} seats</span>

                  <span>{trip.availableBoxes} boxes</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default Trips;
