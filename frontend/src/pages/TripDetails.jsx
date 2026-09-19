import { useEffect, useState } from "react";
import apiConfig from "../config/apiConfig.js";
import { getCurrentUser } from "../auth/currentUser.js";
import { isTripOwner } from "../auth/permissions.js";
import { useNavigate, useParams } from "react-router-dom";
import LoadingButton from "../components/LoadingButton.jsx";

function TripDetails() {
  const { id } = useParams();

  const [trip, setTrip] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [editData, setEditData] = useState({
    from: "",
    to: "",
    date: "",
    carType: "",
    availableSeats: 0,
    availableBoxes: 0,
    description: "",
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

  if (!trip) {
    return <p>Loading trip...</p>;
  }

  const isOwner = isTripOwner(trip, currentUser);

  return (
    <div>
      {isEditing ? (
        <form onSubmit={handleSave}>
          <h1>Edit Trip</h1>

          <div>
            <label>From:</label>
            <input
              type="text"
              name="from"
              value={editData.from}
              onChange={handleEditChange}
            />
          </div>

          <div>
            <label>To:</label>
            <input
              type="text"
              name="to"
              value={editData.to}
              onChange={handleEditChange}
            />
          </div>

          <div>
            <label>Date:</label>
            <input
              type="date"
              name="date"
              value={editData.date}
              onChange={handleEditChange}
            />
          </div>

          <div>
            <label>Car Type:</label>
            <input
              type="text"
              name="carType"
              value={editData.carType}
              onChange={handleEditChange}
            />
          </div>

          <div>
            <label>Available Seats:</label>
            <input
              type="number"
              name="availableSeats"
              min="0"
              value={editData.availableSeats}
              onChange={handleEditChange}
            />
          </div>

          <div>
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
          <h1>
            {trip.from} → {trip.to}
          </h1>

          <p>Date: {trip.date}</p>
          <p>Driver: {trip.ownerName}</p>
          <p>Car: {trip.carType}</p>
          <p>Available Seats: {trip.availableSeats}</p>
          <p>Available Boxes: {trip.availableBoxes}</p>
          <p>Description: {trip.description}</p>

          <div>
            {trip.carImages?.map((imagePath) => (
              <img
                key={imagePath}
                src={`${apiConfig.baseUrl}${imagePath}`}
                alt={`${trip.carType} car`}
                width="300"
              />
            ))}
          </div>

          <hr />

          <section>
            <h2>Driver Information</h2>

            <p>Name: {trip.ownerName}</p>
            <p>Rating: Not available yet</p>
          </section>

          <hr />

          <section>
            <h2>Contact Driver</h2>

            <p>Messenger will be added later.</p>
          </section>

          {isOwner && (
            <>
              <hr />

              <section>
                <h2>Manage Trip</h2>

                <button type="button" onClick={() => setIsEditing(true)}>
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
              </section>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default TripDetails;
