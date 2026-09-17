import { useState } from "react";
import apiConfig from "../config/apiConfig.js";

function CreateNeed() {
  const [needsSeat, setNeedsSeat] = useState(false);
  const [needsBoxes, setNeedsBoxes] = useState(false);

  const [formData, setFormData] = useState({
    ownerId: "",
    ownerName: "",
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

    dateFrom,
    dateTo,

    fromRadiusKm: Number(formData.fromRadiusKm),

    requiredSeats: needsSeat
      ? Number(formData.requiredSeats)
      : 0,

    requiredBoxes: needsBoxes
      ? Number(formData.requiredBoxes)
      : 0
  };

  try {
    const response = await fetch(
      `${apiConfig.baseUrl}/api/needs`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(needData)
      }
    );

    const result = await response.json();

    console.log("Need created:", result);
  } catch (error) {
    console.error("Error creating need:", error);
  }
}

  return (
    <div>
      <h1>Find Transport</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="ownerName"
            value={formData.ownerName}
            onChange={handleChange}
          />
        </div>

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

        <button type="submit">Find Transport</button>
      </form>
    </div>
  );
}

function getTodayDate() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default CreateNeed;
