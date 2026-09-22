import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiConfig from "../../config/apiConfig.js";
import { getCurrentUser } from "../../auth/currentUser.js";
import LoadingButton from "../../components/LoadingButton.jsx";

import createTripPhoto from "../../assets/images/create_trip_photo.png";

import "./CreateTrip.css";

function CreateTrip() {
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    date: "",
    carType: "",
    availableSeats: 0,
    availableBoxes: 0,
    description: "",
  });

  const [carImages, setCarImages] = useState([]);

  const currentUser = getCurrentUser();

  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    const multipartData = new FormData();

    multipartData.append("ownerId", currentUser.id);
    multipartData.append("ownerName", currentUser.name);

    Object.entries(formData).forEach(([key, value]) => {
      multipartData.append(key, value);
    });

    carImages.forEach((file) => {
      multipartData.append("carImages", file);
    });

    try {
      const response = await fetch(`${apiConfig.baseUrl}/api/trips`, {
        method: "POST",
        body: multipartData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Could not create trip");
      }

      setFormData({
        from: "",
        to: "",
        date: "",
        carType: "",
        availableSeats: 0,
        availableBoxes: 0,
        description: "",
      });

      setCarImages([]);

      navigate("/trips");
    } catch (error) {
      console.error("Error creating trip:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <div
      className="create-trip-page"
      style={{
        backgroundImage: `
          linear-gradient(
            rgba(5, 14, 34, 0.1),
            rgba(5, 14, 34, 0.4)
          ),
          url(${createTripPhoto})
        `,
      }}
    >
      <div className="create-trip-page__header">
        <span className="create-trip-page__eyebrow">SHARE YOUR JOURNEY</span>

        <h1>Create Trip</h1>

        <p>Add your route, available space and vehicle information.</p>
      </div>

      <form className="create-trip-form" onSubmit={handleSubmit}>
        <div className="create-trip-form__section">
          <div className="create-trip-form__section-header">
            <span>01</span>

            <div>
              <h2>Route</h2>
              <p>Where are you going?</p>
            </div>
          </div>

          <div className="create-trip-form__grid">
            <div className="create-trip-field">
              <label htmlFor="trip-from">From</label>

              <input
                id="trip-from"
                type="text"
                name="from"
                value={formData.from}
                onChange={handleChange}
                placeholder="e.g. Kassel"
                required
              />
            </div>

            <div className="create-trip-field">
              <label htmlFor="trip-to">To</label>

              <input
                id="trip-to"
                type="text"
                name="to"
                value={formData.to}
                onChange={handleChange}
                placeholder="e.g. Berlin"
                required
              />
            </div>
          </div>
        </div>

        <div className="create-trip-form__section">
          <div className="create-trip-form__section-header">
            <span>02</span>

            <div>
              <h2>Trip Details</h2>
              <p>Date and vehicle information.</p>
            </div>
          </div>

          <div className="create-trip-form__grid">
            <div className="create-trip-field">
              <label htmlFor="trip-date">Date</label>

              <input
                id="trip-date"
                type="date"
                name="date"
                value={formData.date}
                min={today}
                onChange={handleChange}
              />
            </div>

            <div className="create-trip-field">
              <label htmlFor="trip-car-type">Car Type</label>

              <input
                id="trip-car-type"
                type="text"
                name="carType"
                value={formData.carType}
                onChange={handleChange}
                placeholder="e.g. SUV, Van, Taxi"
              />
            </div>
          </div>
        </div>

        <div className="create-trip-form__section">
          <div className="create-trip-form__section-header">
            <span>03</span>

            <div>
              <h2>Available Space</h2>
              <p>How many passengers and packages can you take?</p>
            </div>
          </div>

          <div className="create-trip-form__grid">
            <div className="create-trip-field">
              <label htmlFor="trip-seats">Available Seats</label>

              <input
                id="trip-seats"
                type="number"
                name="availableSeats"
                min="0"
                value={formData.availableSeats}
                onChange={handleChange}
              />
            </div>

            <div className="create-trip-field">
              <label htmlFor="trip-boxes">Available Boxes</label>

              <input
                id="trip-boxes"
                type="number"
                name="availableBoxes"
                min="0"
                value={formData.availableBoxes}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="create-trip-form__section">
          <div className="create-trip-form__section-header">
            <span>04</span>

            <div>
              <h2>Additional Information</h2>

              <p>Add useful details and photos of the car.</p>
            </div>
          </div>

          <div className="create-trip-field create-trip-field--full">
            <label htmlFor="trip-description">Description</label>

            <textarea
              id="trip-description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Anything passengers should know..."
            />
          </div>

          <div className="create-trip-field create-trip-field--full">
            <label htmlFor="trip-images">Car Images</label>

            <input
              id="trip-images"
              type="file"
              accept="image/*"
              multiple
              onChange={(event) => {
                setCarImages(Array.from(event.target.files));
              }}
            />

            <small>
              Upload clear photos so passengers can recognize your vehicle.
            </small>
          </div>
        </div>

        <div className="create-trip-form__actions">
          <LoadingButton
            type="submit"
            loading={isSubmitting}
            loadingText="Creating Trip..."
          >
            Create Trip
          </LoadingButton>
        </div>
      </form>
    </div>
  );
}

export default CreateTrip;
