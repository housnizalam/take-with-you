import { useState } from "react";
import apiConfig from "../config/apiConfig.js";
import { getCurrentUser } from "../auth/currentUser.js";
import LoadingButton from "../components/LoadingButton.jsx";

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

      console.log("Trip created:", result);
    } catch (error) {
      console.error("Error creating trip:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <h1>Create Trip</h1>

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

        <LoadingButton
          type="submit"
          loading={isSubmitting}
          loadingText="Creating Trip..."
        >
          Create Trip
        </LoadingButton>
      </form>
    </div>
  );
}

export default CreateTrip;
