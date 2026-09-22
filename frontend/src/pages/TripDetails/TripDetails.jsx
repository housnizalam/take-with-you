import { useEffect, useState } from "react";
import apiConfig from "../../config/apiConfig.js";
import { getCurrentUser } from "../../auth/currentUser.js";
import { isTripOwner } from "../../auth/permissions.js";
import { useNavigate, useParams } from "react-router-dom";
import LoadingButton from "../../components/LoadingButton.jsx";
import ChatBox from "../../components/ChatBox.jsx";
import { createConversationId } from "../../services/conversationService.js";
import {
  connectChatSocket,
  disconnectChatSocket,
} from "../../services/chatSocketService.js";
import tripDetailsPhoto from "../../assets/images/trip_details_photo.png";
import "./TripDetails.css";

function renderStars(ratingValue = 0) {
  const roundedRating = Math.round(ratingValue);

  return "★".repeat(roundedRating) + "☆".repeat(5 - roundedRating);
}

function TripDetails() {
  const { id } = useParams();

  const [trip, setTrip] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [conversations, setConversations] = useState([]);

  const [liveMessage, setLiveMessage] = useState(null);

  const [editData, setEditData] = useState({
    from: "",
    to: "",
    date: "",
    carType: "",
    availableSeats: 0,
    availableBoxes: 0,
    description: "",
  });

  const [liveTripCompletion, setLiveTripCompletion] = useState(null);

  const [driverRating, setDriverRating] = useState({
    averageRating: 0,
    ratingCount: 0,
  });

  const currentUser = getCurrentUser();

  const navigate = useNavigate();

  useEffect(() => {
    async function loadTrip() {
      try {
        const response = await fetch(`${apiConfig.baseUrl}/api/trips/${id}`);

        const data = await response.json();

        setTrip(data);

        setEditData({
          from: data.from,
          to: data.to,
          date: data.date,
          carType: data.carType,
          availableSeats: data.availableSeats,
          availableBoxes: data.availableBoxes,
          description: data.description,
        });
      } catch (error) {
        console.error("Error loading trip:", error);
      }
    }

    loadTrip();
  }, [id]);

  useEffect(() => {
    connectChatSocket(
      currentUser.id,

      (message) => {
        setLiveMessage(message);
      },

      (completion) => {
        setLiveTripCompletion(completion);
      },
    );

    return () => {
      disconnectChatSocket();
    };
  }, [currentUser.id]);

  function handleEditChange(event) {
    const { name, value } = event.target;

    setEditData({
      ...editData,
      [name]: value,
    });
  }

  async function handleSave(event) {
    event.preventDefault();

    if (isSaving) {
      return;
    }

    setIsSaving(true);

    const updatedData = {
      ...editData,
      availableSeats: Number(editData.availableSeats),
      availableBoxes: Number(editData.availableBoxes),
    };

    try {
      const response = await fetch(
        `${apiConfig.baseUrl}/api/trips/${trip._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        },
      );

      if (!response.ok) {
        throw new Error("Could not update trip");
      }

      const updatedTrip = await response.json();

      setTrip(updatedTrip);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating trip:", error);
    } finally {
      setIsSaving(false);
    }
  }

  function handleCancel() {
    setEditData({
      from: trip.from,
      to: trip.to,
      date: trip.date,
      carType: trip.carType,
      availableSeats: trip.availableSeats,
      availableBoxes: trip.availableBoxes,
      description: trip.description,
    });

    setIsEditing(false);
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this trip?",
    );

    if (!confirmed) {
      return;
    }

    if (isDeleting) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(
        `${apiConfig.baseUrl}/api/trips/${trip._id}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error("Could not delete trip");
      }

      navigate("/trips");
    } catch (error) {
      console.error("Error deleting trip:", error);

      setIsDeleting(false);
    }
  }

  async function loadConversations() {
    if (!trip) {
      return;
    }

    if (trip.ownerId !== currentUser.id) {
      return;
    }

    try {
      const response = await fetch(
        `${apiConfig.baseUrl}/api/messages/trip/${trip._id}/user/${currentUser.id}/conversations`,
      );

      if (!response.ok) {
        throw new Error("Could not load conversations");
      }

      const data = await response.json();

      setConversations(data);
    } catch (error) {
      console.error("Error loading conversations:", error);
    }
  }

  useEffect(() => {
    loadConversations();
  }, [trip, currentUser.id]);

  useEffect(() => {
    if (!liveMessage) {
      return;
    }

    if (!trip) {
      return;
    }

    if (trip.ownerId !== currentUser.id) {
      return;
    }

    if (liveMessage.tripId !== trip._id) {
      return;
    }

    loadConversations();
  }, [liveMessage]);

  useEffect(() => {
    async function loadDriverRating() {
      if (!trip?.ownerId) {
        return;
      }

      try {
        const response = await fetch(
          `${apiConfig.baseUrl}/api/ratings/user/${trip.ownerId}/summary`,
        );

        if (!response.ok) {
          throw new Error("Could not load driver rating");
        }

        const data = await response.json();

        setDriverRating(data);
      } catch (error) {
        console.error("Error loading driver rating:", error);
      }
    }

    loadDriverRating();
  }, [trip?.ownerId]);

  if (!trip) {
    return <p>Loading trip...</p>;
  }

  const isOwner = isTripOwner(trip, currentUser);

  let clientConversationId = null;

  if (!isOwner) {
    clientConversationId = createConversationId(
      trip._id,
      currentUser.id,
      trip.ownerId,
    );
  }

  return (
    <div
      className="trip-details-page"
      style={{
        backgroundImage: `
        linear-gradient(
          rgba(5, 14, 34, 0.5),
          rgba(5, 14, 34, 0.8)
        ),
        url(${tripDetailsPhoto})
      `,
      }}
    >
      {" "}
      {isEditing ? (
        <form className="trip-edit-card" onSubmit={handleSave}>
          <div className="trip-details-heading">
            <span>MANAGE YOUR JOURNEY</span>
            <h1>Edit Trip</h1>
          </div>
          <div className="trip-edit-field">
            {" "}
            <label>From:</label>
            <input
              type="text"
              name="from"
              value={editData.from}
              onChange={handleEditChange}
            />
          </div>

          <div className="trip-edit-field">
            {" "}
            <label>To:</label>
            <input
              type="text"
              name="to"
              value={editData.to}
              onChange={handleEditChange}
            />
          </div>

          <div className="trip-edit-field">
            {" "}
            <label>Date:</label>
            <input
              type="date"
              name="date"
              value={editData.date}
              onChange={handleEditChange}
            />
          </div>

          <div className="trip-edit-field">
            {" "}
            <label>Car Type:</label>
            <input
              type="text"
              name="carType"
              value={editData.carType}
              onChange={handleEditChange}
            />
          </div>

          <div className="trip-edit-field">
            {" "}
            <label>Available Seats:</label>
            <input
              type="number"
              name="availableSeats"
              min="0"
              value={editData.availableSeats}
              onChange={handleEditChange}
            />
          </div>

          <div className="trip-edit-field">
            {" "}
            <label>Available Boxes:</label>
            <input
              type="number"
              name="availableBoxes"
              min="0"
              value={editData.availableBoxes}
              onChange={handleEditChange}
            />
          </div>

          <div>
            <label>Description:</label>
            <textarea
              name="description"
              value={editData.description}
              onChange={handleEditChange}
            />
          </div>

          <LoadingButton
            type="submit"
            loading={isSaving}
            loadingText="Saving..."
          >
            Save
          </LoadingButton>

          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        </form>
      ) : (
        <>
          <div className="trip-details-hero">
            <span className="trip-details-hero__eyebrow">TRIP DETAILS</span>

            <h1>
              {trip.from} → {trip.to}
            </h1>

            <div className="trip-details-date">{trip.date}</div>

            <div className="trip-details-hero__meta">
              <span>{trip.carType}</span>
            </div>
          </div>

          <section className="trip-info-card">
            <div className="trip-info-grid">
              <div className="trip-info-item">
                <span>Driver</span>
                <strong>{trip.ownerName}</strong>
              </div>

              <div className="trip-info-item">
                <span>Car</span>
                <strong>{trip.carType}</strong>
              </div>

              <div className="trip-info-item">
                <span>Available Seats</span>
                <strong>{trip.availableSeats}</strong>
              </div>

              <div className="trip-info-item">
                <span>Available Boxes</span>
                <strong>{trip.availableBoxes}</strong>
              </div>
            </div>

            {trip.description && (
              <div className="trip-description">
                <span>Description</span>
                <p>{trip.description}</p>
              </div>
            )}
          </section>

          <section className="trip-car-gallery">
            <div className="trip-section-header">
              <h2>Vehicle</h2>
            </div>

            {trip.carImages?.length > 0 ? (
              <div className="trip-car-gallery__scroll">
                {trip.carImages.map((imagePath) => (
                  <img
                    key={imagePath}
                    src={`${apiConfig.baseUrl}${imagePath}`}
                    alt={`${trip.carType} car`}
                  />
                ))}
              </div>
            ) : (
              <div className="trip-no-car-photo">
                <strong>No car photo</strong>
                <span>The driver did not upload a photo of this vehicle.</span>
              </div>
            )}
          </section>
          <section className="trip-driver-card">
            <div className="trip-section-header">
              <h2>Driver Information</h2>
            </div>

            <div className="trip-driver-profile">
              <span className="trip-driver-name">{trip.ownerName}</span>

              {driverRating.ratingCount === 0 ? (
                <span className="trip-driver-no-rating">No ratings yet</span>
              ) : (
                <>
                  <span className="trip-driver-stars">
                    {"★".repeat(Math.round(driverRating.averageRating))}
                    {"☆".repeat(5 - Math.round(driverRating.averageRating))}
                  </span>

                  <span className="trip-driver-rating-count">
                    ({driverRating.ratingCount})
                  </span>
                </>
              )}
            </div>
          </section>
          <section className="trip-messages-card">
            <div className="trip-section-header">
              <h2>Messages</h2>
            </div>

            {!isOwner ? (
              <ChatBox
                tripId={trip._id}
                conversationId={clientConversationId}
                currentUser={currentUser}
                otherUser={{
                  id: trip.ownerId,
                  name: trip.ownerName,
                }}
                liveMessage={liveMessage}
                liveTripCompletion={liveTripCompletion}
                clientUserId={currentUser.id}
                driverUserId={trip.ownerId}
              />
            ) : conversations.length === 0 ? (
              <p>No messages for this trip yet.</p>
            ) : (
              conversations.map((conversation) => (
                <ChatBox
                  key={conversation.conversationId}
                  tripId={trip._id}
                  conversationId={conversation.conversationId}
                  currentUser={currentUser}
                  otherUser={{
                    id: conversation.otherUserId,
                    name: conversation.otherUserName,
                  }}
                  liveMessage={liveMessage}
                  liveTripCompletion={liveTripCompletion}
                  clientUserId={conversation.otherUserId}
                  driverUserId={currentUser.id}
                />
              ))
            )}
          </section>

          {isOwner && (
            <>
              <section className="trip-manage-card">
                <div className="trip-section-header">
                  <h2>Manage Trip</h2>
                </div>

                <div className="trip-manage-actions">
                  <button
                    type="button"
                    className="trip-edit-button"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Trip
                  </button>

                  <LoadingButton
                    type="button"
                    onClick={handleDelete}
                    loading={isDeleting}
                    loadingText="Deleting..."
                  >
                    Delete Trip
                  </LoadingButton>
                </div>
              </section>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default TripDetails;
