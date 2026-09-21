import { useState } from "react";

import apiConfig from "../config/apiConfig.js";
import {
  setCurrentUser,
} from "../auth/currentUser.js";

function Auth() {
  const [mode, setMode] = useState("login");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] =
    useState(false);

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

    setError("");
    setIsSubmitting(true);

    try {
      const endpoint =
        mode === "register"
          ? "/api/auth/register"
          : "/api/auth/login";

      const body =
        mode === "register"
          ? {
              name: formData.name,
              email: formData.email,
              password: formData.password,
            }
          : {
              email: formData.email,
              password: formData.password,
            };

      const response = await fetch(
        `${apiConfig.baseUrl}${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Authentication failed",
        );
      }

      setCurrentUser(data);

      window.location.href = "/";
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <h1>Take With You</h1>

      <div>
        <button
          type="button"
          onClick={() => {
            setMode("login");
            setError("");
          }}
          disabled={mode === "login"}
        >
          Log In
        </button>

        <button
          type="button"
          onClick={() => {
            setMode("register");
            setError("");
          }}
          disabled={mode === "register"}
        >
          Register
        </button>
      </div>

      <h2>
        {mode === "login"
          ? "Log In"
          : "Register"}
      </h2>

      <form onSubmit={handleSubmit}>
        {mode === "register" && (
          <div>
            <label>Name:</label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
        )}

        <div>
          <label>Email:</label>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Password:</label>

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        {error && (
          <p>{error}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Please wait..."
            : mode === "login"
              ? "Log In"
              : "Register"}
        </button>
      </form>
    </div>
  );
}

export default Auth;