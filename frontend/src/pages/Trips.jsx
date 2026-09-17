import { useEffect, useState } from "react";
import apiConfig from "../config/apiConfig.js";

function Trips() {
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    async function loadTrips() {
      try {
        const response = await fetch(`${apiConfig.baseUrl}/api/trips`);
        const data = await response.json();

        setTrips(data);
      } catch (error) {
        console.error("Error loading trips:", error);
      }
    }

    loadTrips();
  }, []);

  return (
    <div>
      <h1>Trips</h1>

      {trips.map((trip) => (
        <div key={trip._id}>
          <h3>
            {trip.from} → {trip.to}
          </h3>

          <p>Driver: {trip.ownerName}</p>
          <p>Date: {trip.date}</p>
          <p>Seats: {trip.availableSeats}</p>
          <p>Boxes: {trip.availableBoxes}</p>
          {trip.carImages?.map((imagePath) => (
            <img
              key={imagePath}
              src={`${apiConfig.baseUrl}${imagePath}`}
              alt={`${trip.carType} car`}
              width="250"
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default Trips;
