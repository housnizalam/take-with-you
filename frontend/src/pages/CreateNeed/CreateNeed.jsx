import { useState } from "react";
import apiConfig from "../../config/apiConfig.js";
import { Link } from "react-router-dom";
import LoadingButton from "../../components/LoadingButton.jsx";
import { getCurrentUser } from "../../auth/currentUser.js";

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

    setIsSubmitting(true);

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

      console.log("Need created:", createdNeed);

      // 2. Find matching trips for this Need
      const matchesResponse = await fetch(
        `${apiConfig.baseUrl}/api/matches/need/${createdNeed._id}`,
      );

      const matchesData = await matchesResponse.json();

      // 3. Save matches in React state
      setMatches(matchesData);
    } catch (error) {
      console.error("Error creating need or loading matches:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <h1>Find Transport</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>From:</label>

          <input
            type="text"
            name="from"
            value={formData.from}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Search Radius from Start Location (km):</label>

          <input
            type="number"
            name="fromRadiusKm"
            min="0"
            value={formData.fromRadiusKm}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>To:</label>

          <input
            type="text"
            name="to"
            value={formData.to}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Date From:</label>

          <input
            type="date"
            name="dateFrom"
            value={formData.dateFrom}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Date To:</label>

          <input
            type="date"
            name="dateTo"
            value={formData.dateTo}
            onChange={handleChange}
          />
        </div>

        <hr />

        <div>
          <label>
            <input
              type="checkbox"
              checked={needsSeat}
              onChange={(event) => setNeedsSeat(event.target.checked)}
            />
            I need a seat
          </label>
        </div>

        {needsSeat && (
          <div>
            <label>Required Seats:</label>

            <input
              type="number"
              name="requiredSeats"
              min="1"
              value={formData.requiredSeats}
              onChange={handleChange}
            />
          </div>
        )}

        <div>
          <label>
            <input
              type="checkbox"
              checked={needsBoxes}
              onChange={(event) => setNeedsBoxes(event.target.checked)}
            />
            I want to transport packages
          </label>
        </div>

        {needsBoxes && (
          <div>
            <label>Required Boxes:</label>

            <input
              type="number"
              name="requiredBoxes"
              min="1"
              value={formData.requiredBoxes}
              onChange={handleChange}
            />
          </div>
        )}

        <div>
          <label>Description:</label>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <LoadingButton
          type="submit"
          loading={isSubmitting}
          loadingText="Finding Trips..."
        >
          Find Transport
        </LoadingButton>
      </form>

      <hr />

      <section>
        <h2>Matching Trips</h2>

        {matches.length === 0 ? (
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
      </section>
    </div>
  );
}

export default CreateNeed;
