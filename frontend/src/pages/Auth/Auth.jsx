import { useState } from "react";

import apiConfig from "../../config/apiConfig.js";
import {
  setCurrentUser,
} from "../../auth/currentUser.js";

import loginPhoto from "../../assets/images/log_in_photo.png";

import "./Auth.css";

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

  function changeMode(newMode) {
    setMode(newMode);
    setError("");

    setFormData({
      name: "",
      email: "",
      password: "",
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
          data.message ||
            "Authentication failed",
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
    <main
      className="auth-page"
      style={{
        backgroundImage: `url(${loginPhoto})`,
      }}
    >
      <div className="auth-page__overlay" />

      <section className="auth-panel">
        <header className="auth-brand">
          <div className="auth-brand__logo">
            ▲
          </div>

          <div>
            <h2>Take With You</h2>
            <span>
              PEOPLE • PLACES • A BRIGHTER TOMORROW
            </span>
          </div>
        </header>

        <div className="auth-content">
          <div className="auth-heading">
            <span className="auth-heading__eyebrow">
              {mode === "login"
                ? "WELCOME BACK"
                : "JOIN THE JOURNEY"}
            </span>

            <h1>
              {mode === "login"
                ? (
                    <>
                      Good people
                      <br />
                      take you further.
                    </>
                  )
                : (
                    <>
                      Start a new
                      <br />
                      journey today.
                    </>
                  )}
            </h1>

            <p>
              {mode === "login"
                ? "Ridesharing for real life. Same roads. A brighter tomorrow."
                : "Create your account and connect with people going your way."}
            </p>
          </div>

          <div className="auth-mode-switch">
            <button
              type="button"
              className={
                mode === "login"
                  ? "active"
                  : ""
              }
              onClick={() =>
                changeMode("login")
              }
            >
              Log In
            </button>

            <button
              type="button"
              className={
                mode === "register"
                  ? "active"
                  : ""
              }
              onClick={() =>
                changeMode("register")
              }
            >
              Register
            </button>
          </div>

          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >
            {mode === "register" && (
              <div className="auth-field">
                <label htmlFor="name">
                  Name
                </label>

                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            <div className="auth-field">
              <label htmlFor="email">
                Email
              </label>

              <input
                id="email"
                type="email"
                name="email"
                placeholder="you@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="auth-field">
              <label htmlFor="password">
                Password
              </label>

              <input
                id="password"
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {error && (
              <div className="auth-error">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="auth-submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Please wait..."
                : mode === "login"
                  ? "Sign in →"
                  : "Create account →"}
            </button>
          </form>

          <p className="auth-footer-text">
            {mode === "login"
              ? "New here?"
              : "Already have an account?"}

            <button
              type="button"
              onClick={() =>
                changeMode(
                  mode === "login"
                    ? "register"
                    : "login",
                )
              }
            >
              {mode === "login"
                ? "Create an account"
                : "Log in"}
            </button>
          </p>
        </div>

        <div className="auth-quote">
          <span>More journeys.</span>
          <strong>Brighter people.</strong>
        </div>
      </section>

      <aside className="auth-photo-message">
        <span>Not just destinations.</span>
        <strong>Better humans.</strong>
      </aside>
    </main>
  );
}

export default Auth;