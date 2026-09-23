import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import apiConfig from "../../config/apiConfig.js";
import { getCurrentUser } from "../../auth/currentUser.js";

import loginPhoto from "../../assets/images/log_in_photo.png";

import "./Home.css";

function Home() {
  const currentUser = getCurrentUser();

  const [trips, setTrips] = useState([]);
  const [requests, setRequests] = useState([]);

  const [rating, setRating] = useState({
    averageRating: 0,
    ratingCount: 0,
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [tripsResponse, requestsResponse, ratingResponse] =
          await Promise.all([
            fetch(`${apiConfig.baseUrl}/api/trips`),
            fetch(`${apiConfig.baseUrl}/api/needs`),
            fetch(
              `${apiConfig.baseUrl}/api/ratings/user/${currentUser.id}/summary`,
            ),
          ]);

        const allTrips = await tripsResponse.json();
        const allRequests = await requestsResponse.json();
        const ratingData = await ratingResponse.json();

        setTrips(allTrips.filter((trip) => trip.ownerId === currentUser.id));

        setRequests(
          allRequests.filter((request) => request.ownerId === currentUser.id),
        );

        setRating(ratingData);
      } catch (error) {
        console.error("Error loading dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboard();
  }, [currentUser.id]);

  const sortedTrips = [...trips].sort(
    (a, b) => new Date(a.date) - new Date(b.date),
  );

  const nextTrip = sortedTrips[0] || null;

  const recentRequests = [...requests]
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
    .slice(0, 2);

  return (
    <div className="home-page">
      <section
        className="home-hero"
        style={{
          backgroundImage: `url(${loginPhoto})`,
        }}
      >
        <div className="home-hero__overlay" />

        <div className="home-hero__content">
          <span>Welcome back, {currentUser.name}</span>

          <h1>
            Different people.
            <br />
            Brighter destinations.
          </h1>

          <p>
            Find a ride, share your route, and move things with people going
            your way.
          </p>
        </div>
      </section>

      <section className="home-actions">
        <Link to="/trips/new" className="home-action-card">
          <strong>Create Trip</strong>
          <span>Offer your empty seats</span>
        </Link>

        <Link to="/needs/new" className="home-action-card">
          <strong>Find Transport</strong>
          <span>Find a ride or send a package</span>
        </Link>

        <Link to="/trips" className="home-action-card">
          <strong>My Trips</strong>
          <span>Manage your active trips</span>
        </Link>

        <Link to="/needs" className="home-action-card">
          <strong>My Requests</strong>
          <span>View your requests and matches</span>
        </Link>
      </section>

      <section className="home-stats">
        <div className="home-stat-card">
          <span>My Trips</span>
          <strong>{trips.length}</strong>
        </div>

        <div className="home-stat-card">
          <span>My Requests</span>
          <strong>{requests.length}</strong>
        </div>

        <div className="home-stat-card">
          <span>My Rating</span>

          <div className="home-rating-display">
            {rating.ratingCount === 0 ? (
              <span className="home-rating-empty">No ratings yet</span>
            ) : (
              <>
                <span className="home-rating-stars">
                  {"★".repeat(Math.round(rating.averageRating))}
                  {"☆".repeat(5 - Math.round(rating.averageRating))}
                </span>

                <span className="home-rating-count">
                  ({rating.ratingCount})
                </span>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="home-dashboard-grid">
        <div className="home-section">
          <div className="home-section__header">
            <h2>Up Next</h2>

            <Link to="/trips">View all</Link>
          </div>

          {isLoading ? (
            <p>Loading...</p>
          ) : nextTrip ? (
            <Link to={`/trips/${nextTrip._id}`} className="home-next-trip">
              <strong>
                {nextTrip.from}
                {" → "}
                {nextTrip.to}
              </strong>

              <span>{nextTrip.date}</span>

              <span>
                {nextTrip.availableSeats} seats
                {" • "}
                {nextTrip.availableBoxes} boxes
              </span>
            </Link>
          ) : (
            <div className="home-empty">
              <p>No upcoming trips.</p>

              <Link to="/trips/new">Create your first trip</Link>
            </div>
          )}
        </div>

        <div className="home-section">
          <div className="home-section__header">
            <h2>Recent Requests</h2>

            <Link to="/needs">View all</Link>
          </div>

          {isLoading ? (
            <p>Loading...</p>
          ) : recentRequests.length > 0 ? (
            <div className="home-request-list">
              {recentRequests.map((request) => (
                <Link
                  key={request._id}
                  to="/needs"
                  className="home-request-card"
                >
                  <strong>
                    {request.from}
                    {" → "}
                    {request.to}
                  </strong>

                  <span>
                    {request.dateFrom}
                    {" – "}
                    {request.dateTo}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="home-empty">
              <p>No requests yet.</p>

              <Link to="/needs/new">Find transport</Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Home;
