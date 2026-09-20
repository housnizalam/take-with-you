import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import apiConfig from "../config/apiConfig.js";
import { getCurrentUser } from "../auth/currentUser.js";

function Needs() {
  const [needs, setNeeds] = useState([]);

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
    <div>
      <h1>My Needs</h1>

      {needs.length === 0 ? (
        <p>You have no needs yet.</p>
      ) : (
        needs.map((need) => {
          const isExpanded = expandedNeedId === need._id;

          const matches = matchesByNeed[need._id] || [];

          const isLoading = loadingNeedId === need._id;

          return (
            <div key={need._id}>
              <button type="button" onClick={() => handleNeedClick(need._id)}>
                {isExpanded ? "▼" : "▶"} {need.from} → {need.to} |{" "}
                {need.dateFrom} - {need.dateTo}
              </button>

              <button
                type="button"
                onClick={() => handleDeleteNeed(need._id)}
                disabled={deletingNeedId === need._id}
              >
                {deletingNeedId === need._id ? "Deleting..." : "Delete"}
              </button>

              {isExpanded && (
                <div>
                  <h3>Matching Trips</h3>

                  {isLoading ? (
                    <p>Loading matches...</p>
                  ) : matches.length === 0 ? (
                    <p>No matching trips found.</p>
                  ) : (
                    matches.map((trip) => (
                      <div key={trip._id}>
                        <Link to={`/trips/${trip._id}`}>
                          {trip.from} → {trip.to} | {trip.date}
                        </Link>
                      </div>
                    ))
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
