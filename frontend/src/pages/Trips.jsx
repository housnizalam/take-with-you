import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import apiConfig from "../config/apiConfig.js";
import { getCurrentUser } from "../auth/currentUser.js";

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
    <div>
      <h1>My Trips</h1>

      {trips.length === 0 ? (
        <p>You have no trips yet.</p>
      ) : (
        trips.map((trip) => (
          <div key={trip._id}>
            <Link to={`/trips/${trip._id}`}>
              {trip.from} → {trip.to} | {trip.date}
            </Link>
          </div>
        ))
      )}
    </div>
  );
}

export default Trips;
