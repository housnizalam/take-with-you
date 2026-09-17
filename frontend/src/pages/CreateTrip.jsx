import { useState } from "react";
import apiConfig from "../config/apiConfig.js";

function CreateTrip() {
  const [formData, setFormData] = useState({
    ownerId: "",
    ownerName: "",
    from: "",
    to: "",
    date: "",
    carType: "",
    availableSeats: 0,
    availableBoxes: 0,
    description: "",
  });

  const [carImages, setCarImages] = useState([]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

async function handleSubmit(event) {
  event.preventDefault();

  const multipartData = new FormData();

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

    console.log("Trip created:", result);
  } catch (error) {
    console.error("Error creating trip:", error);
  }
}

  return (
    <div>
      <h1>Create Trip</h1>

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
          <label>To:</label>
          <input
            type="text"
            name="to"
            value={formData.to}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Date:</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Car Type:</label>
          <input
            type="text"
            name="carType"
            value={formData.carType}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Available Seats:</label>
          <input
            type="number"
            name="availableSeats"
            value={formData.availableSeats}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Available Boxes:</label>
          <input
            type="number"
            name="availableBoxes"
            value={formData.availableBoxes}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Car Images:</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(event) => {
              setCarImages(Array.from(event.target.files));
            }}
          />
        </div>

        <button type="submit">Create Trip</button>
      </form>
    </div>
  );
}

export default CreateTrip;
