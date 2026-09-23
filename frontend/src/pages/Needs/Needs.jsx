import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import apiConfig from "../../config/apiConfig.js";
import { getCurrentUser } from "../../auth/currentUser.js";
import needsPhoto from "../../assets/images/needs_photo.png";
import "./Needs.css";

function Needs() {
  const [needs, setNeeds] = useState([]);
  const sortedNeeds = [...needs].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );

  const [expandedNeedId, setExpandedNeedId] = useState(null);

  const [matchesByNeed, setMatchesByNeed] = useState({});

  const [loadingNeedId, setLoadingNeedId] = useState(null);

  const [deletingNeedId, setDeletingNeedId] = useState(null);

  const currentUser = getCurrentUser();

  useEffect(() => {
    async function loadNeeds() {
      try {
        const response = await fetch(`${apiConfig.baseUrl}/api/needs`);

        if (!response.ok) {
          throw new Error("Could not load needs");
        }

        const data = await response.json();

        const ownNeeds = data.filter((need) => need.ownerId === currentUser.id);

        setNeeds(ownNeeds);
      } catch (error) {
        console.error("Error loading needs:", error);
      }
    }

    loadNeeds();
  }, []);

  async function handleNeedClick(needId) {
    if (expandedNeedId === needId) {
      setExpandedNeedId(null);
      return;
    }

    setExpandedNeedId(needId);

    if (matchesByNeed[needId]) {
      return;
    }

    setLoadingNeedId(needId);

    try {
      const response = await fetch(
        `${apiConfig.baseUrl}/api/matches/need/${needId}`,
      );

      if (!response.ok) {
        throw new Error("Could not load matching trips");
      }

      const matches = await response.json();

      setMatchesByNeed((previousMatches) => ({
        ...previousMatches,
        [needId]: matches,
      }));
    } catch (error) {
      console.error("Error loading matching trips:", error);
    } finally {
      setLoadingNeedId(null);
    }
  }

  async function handleDeleteNeed(needId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this need?",
    );

    if (!confirmed) {
      return;
    }

    if (deletingNeedId === needId) {
      return;
    }

    setDeletingNeedId(needId);

    try {
      const response = await fetch(`${apiConfig.baseUrl}/api/needs/${needId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Could not delete need");
      }

      setNeeds((previousNeeds) =>
        previousNeeds.filter((need) => need._id !== needId),
      );

      if (expandedNeedId === needId) {
        setExpandedNeedId(null);
      }

      setMatchesByNeed((previousMatches) => {
        const updatedMatches = {
          ...previousMatches,
        };

        delete updatedMatches[needId];

        return updatedMatches;
      });
    } catch (error) {
      console.error("Error deleting need:", error);
    } finally {
      setDeletingNeedId(null);
    }
  }

  return (
    <div
      className="requests-page"
      style={{
        backgroundImage: `
      linear-gradient(
        rgba(6, 15, 35, 0.1),
        rgba(6, 15, 35, 0.4)
      ),
      url(${needsPhoto})
    `,
      }}
    >
      <div className="requests-page__header">
        <div>
          <span className="requests-page__eyebrow">
            YOUR TRANSPORT REQUESTS
          </span>

          <h1>My Requests</h1>

          <p>Review your requests and check matching trips.</p>
        </div>

        <Link to="/needs/new" className="requests-page__create">
          + Find Transport
        </Link>
      </div>

      {needs.length === 0 ? (
        <div className="home-empty">
          <p>You have no requests yet.</p>
        </div>
      ) : (
        sortedNeeds.map((need) => {
          const isExpanded = expandedNeedId === need._id;

          const matches = matchesByNeed[need._id] || [];

          const isLoading = loadingNeedId === need._id;

          return (
            <div
              key={need._id}
              className={
                isExpanded
                  ? "request-card request-card--expanded"
                  : "request-card"
              }
            >
              <button
                type="button"
                className="request-card__main"
                onClick={() => handleNeedClick(need._id)}
              >
                <div>
                  <strong>
                    {need.from} → {need.to}
                  </strong>

                  <span>
                    {need.dateFrom} - {need.dateTo}
                  </span>
                </div>

                <span className="request-card__arrow">
                  {isExpanded ? "▼" : "▶"}
                </span>
              </button>

              <button
                type="button"
                className="request-card__delete"
                onClick={(event) => {
                  event.stopPropagation();
                  handleDeleteNeed(need._id);
                }}
                disabled={deletingNeedId === need._id}
              >
                {deletingNeedId === need._id ? "Deleting..." : "Delete"}
              </button>

              {isExpanded && (
                <div className="request-matches">
                  <h3>Matching Trips</h3>

                  {isLoading ? (
                    <p>Loading matches...</p>
                  ) : matches.length === 0 ? (
                    <p>No matching trips found.</p>
                  ) : (
                    matches.map((trip) => {
                      const hasCarImage = trip.carImages?.length > 0;

                      return (
                        <Link
                          key={trip._id}
                          to={`/trips/${trip._id}`}
                          className="request-match-card"
                        >
                          <div className="request-match-card__media">
                            {trip.carImages?.length > 0 ? (
                              <img
                                src={`${apiConfig.baseUrl}${trip.carImages[0]}`}
                                alt={`${trip.carType || "Car"} photo`}
                                className="request-match-card__photo"
                              />
                            ) : (
                              <div className="request-match-card__no-photo">
                                <strong>No car photo</strong>
                                <span>Driver did not upload a car photo</span>
                              </div>
                            )}
                          </div>

                          <div className="request-match-card__content">
                            <div className="request-match-card__route">
                              {trip.from} → {trip.to}
                            </div>

                            <div className="request-match-card__date">
                              {trip.date}
                            </div>

                            <div className="request-match-card__meta">
                              <span>{trip.availableSeats} seats</span>

                              <span>{trip.availableBoxes} boxes</span>
                            </div>

                            {trip.carType && (
                              <div className="request-match-card__car">
                                {trip.carType}
                              </div>
                            )}
                          </div>
                        </Link>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

export default Needs;
