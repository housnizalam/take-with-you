import { useState } from "react";
import { Link } from "react-router-dom";

import apiConfig from "../../config/apiConfig.js";
import LoadingButton from "../../components/LoadingButton.jsx";
import { getCurrentUser } from "../../auth/currentUser.js";

import createNeedPhoto from "../../assets/images/create_need_photo.png";

import "./CreateNeed.css";

function getTodayDate() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function CreateNeed() {
  const [needsSeat, setNeedsSeat] = useState(false);
  const [needsBoxes, setNeedsBoxes] = useState(false);

  const [matches, setMatches] = useState([]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentUser = getCurrentUser();

  const [formData, setFormData] = useState({
    from: "",
    to: "",
    dateFrom: "",
    dateTo: "",
    fromRadiusKm: 0,
    requiredSeats: 0,
    requiredBoxes: 0,
    description: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }
  async function handleSubmit(event) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    if (!needsSeat && !needsBoxes) {
      alert("Please select passenger, package, or both.");
      return;
    }

    const dateFrom = formData.dateFrom || getTodayDate();
    const dateTo = formData.dateTo || dateFrom;

    if (dateFrom > dateTo) {
      alert("Date From cannot be after Date To.");
      return;
    }

    setIsSubmitting(true);

    const needData = {
      ...formData,

      ownerId: currentUser.id,
      ownerName: currentUser.name,

      dateFrom,
      dateTo,

      fromRadiusKm: Number(formData.fromRadiusKm),

      requiredSeats: needsSeat ? Number(formData.requiredSeats) : 0,

      requiredBoxes: needsBoxes ? Number(formData.requiredBoxes) : 0,
    };

    try {
      // 1. Create the Need
      const response = await fetch(`${apiConfig.baseUrl}/api/needs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(needData),
      });

      const createdNeed = await response.json();

      if (!response.ok) {
        throw new Error(createdNeed.message || "Could not create need");
      }

      console.log("Need created:", createdNeed);

      // 2. Find matching trips for this Need
      const matchesResponse = await fetch(
        `${apiConfig.baseUrl}/api/matches/need/${createdNeed._id}`,
      );

      if (!matchesResponse.ok) {
        throw new Error(
          "Need created, but matching trips could not be loaded.",
        );
      }

      const matchesData = await matchesResponse.json();

      // 3. Preserve current matching behaviour
      setMatches(matchesData);
    } catch (error) {
      console.error("Error creating need or loading matches:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className="create-need-page"
      style={{
        backgroundImage: `
        linear-gradient(
          rgba(5, 14, 34, 0.1),
          rgba(5, 14, 34, 0.4)
        ),
        url(${createNeedPhoto})
      `,
      }}
    >
      <div className="create-need-page__header">
        <span className="create-need-page__eyebrow">FIND YOUR WAY</span>

        <h1>Find Transport</h1>

        <p>Tell us where you need to go and what you need to transport.</p>
      </div>

      <form className="create-need-form" onSubmit={handleSubmit}>
        <div className="create-need-form__section">
          <div className="create-need-form__section-header">
            <span>01</span>

            <div>
              <h2>Route</h2>
              <p>Where should the trip start and end?</p>
            </div>
          </div>

          <div className="create-need-form__grid">
            <div className="create-need-field">
              <label>From</label>

              <input
                type="text"
                name="from"
                value={formData.from}
                onChange={handleChange}
                placeholder="e.g. Kassel"
                required
              />
            </div>

            <div className="create-need-field">
              <label>To</label>

              <input
                type="text"
                name="to"
                value={formData.to}
                onChange={handleChange}
                placeholder="e.g. Berlin"
                required
              />
            </div>

            <div className="create-need-field create-need-field--full">
              <label>Search Radius from Start Location (km)</label>

              <input
                type="number"
                name="fromRadiusKm"
                min="0"
                value={formData.fromRadiusKm}
                onChange={handleChange}
              />

              <small>
                0 km means the trip should start from the same location.
              </small>
            </div>
          </div>
        </div>

        <div className="create-need-form__section">
          <div className="create-need-form__section-header">
            <span>02</span>

            <div>
              <h2>Date Range</h2>
              <p>Choose when you are available to travel.</p>
            </div>
          </div>

          <div className="create-need-form__grid">
            <div className="create-need-field">
              <label>Date From</label>

              <input
                type="date"
                name="dateFrom"
                min={getTodayDate()}
                value={formData.dateFrom}
                onChange={handleChange}
              />
            </div>

            <div className="create-need-field">
              <label>Date To</label>

              <input
                type="date"
                name="dateTo"
                min={formData.dateFrom || getTodayDate()}
                value={formData.dateTo}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="create-need-form__section">
          <div className="create-need-form__section-header">
            <span>03</span>

            <div>
              <h2>What do you need?</h2>

              <p>Passenger transport, packages, or both.</p>
            </div>
          </div>

          <div className="create-need-options">
            <label
              className={
                needsSeat
                  ? "create-need-option create-need-option--active"
                  : "create-need-option"
              }
            >
              <input
                type="checkbox"
                checked={needsSeat}
                onChange={(event) => setNeedsSeat(event.target.checked)}
              />

              <div>
                <strong>Passenger</strong>
                <span>I need one or more seats</span>
              </div>
            </label>

            <label
              className={
                needsBoxes
                  ? "create-need-option create-need-option--active"
                  : "create-need-option"
              }
            >
              <input
                type="checkbox"
                checked={needsBoxes}
                onChange={(event) => setNeedsBoxes(event.target.checked)}
              />

              <div>
                <strong>Package</strong>
                <span>I want to transport boxes</span>
              </div>
            </label>
          </div>

          {(needsSeat || needsBoxes) && (
            <div className="create-need-form__grid create-need-requirements">
              {needsSeat && (
                <div className="create-need-field">
                  <label>Required Seats</label>

                  <input
                    type="number"
                    name="requiredSeats"
                    min="1"
                    value={formData.requiredSeats}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}

              {needsBoxes && (
                <div className="create-need-field">
                  <label>Required Boxes</label>

                  <input
                    type="number"
                    name="requiredBoxes"
                    min="1"
                    value={formData.requiredBoxes}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}
            </div>
          )}
        </div>

        <div className="create-need-form__section">
          <div className="create-need-form__section-header">
            <span>04</span>

            <div>
              <h2>Additional Information</h2>
              <p>Add anything the driver should know.</p>
            </div>
          </div>

          <div className="create-need-field">
            <label>Description</label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Additional information..."
            />
          </div>
        </div>

        <div className="create-need-form__actions">
          <LoadingButton
            type="submit"
            loading={isSubmitting}
            loadingText="Finding Trips..."
          >
            Find Transport
          </LoadingButton>
        </div>
      </form>
      <section className="create-need-matches">
        <div className="create-need-matches__header">
          <span>MATCHING RESULTS</span>
          <h2>Matching Trips</h2>
        </div>

        {matches.length === 0 ? (
          <div className="create-need-matches__empty">
            No matching trips found.
          </div>
        ) : (
          <div className="create-need-matches__list">
            {matches.map((trip) => {
              const hasCarImage = trip.carImages?.length > 0;

              return (
                <Link
                  key={trip._id}
                  to={`/trips/${trip._id}`}
                  className="create-need-match-card"
                >
                  <div className="create-need-match-card__media">
                    {hasCarImage ? (
                      <img
                        src={`${apiConfig.baseUrl}${trip.carImages[0]}`}
                        alt={`${trip.carType || "Car"} photo`}
                      />
                    ) : (
                      <div className="create-need-match-card__no-photo">
                        <strong>No car photo</strong>

                        <span>Driver did not upload a car photo</span>
                      </div>
                    )}
                  </div>

                  <div className="create-need-match-card__content">
                    <strong className="create-need-match-card__route">
                      {trip.from} → {trip.to}
                    </strong>

                    <div className="create-need-match-card__date">
                      {trip.date}
                    </div>

                    <div className="create-need-match-card__meta">
                      <span>{trip.availableSeats} seats</span>

                      <span>{trip.availableBoxes} boxes</span>
                    </div>

                    {trip.carType && (
                      <div className="create-need-match-card__car">
                        {trip.carType}
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

export default CreateNeed;
