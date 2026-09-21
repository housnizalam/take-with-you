import express from "express";
import bcrypt from "bcryptjs";

import {
  createUser,
  getUserByEmail,
} from "../repositories/userRepository.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    const existingUser =
      await getUserByEmail(normalizedEmail);

    if (existingUser) {
      return res.status(409).json({
        message: "Email already exists",
      });
    }

    const passwordHash =
      await bcrypt.hash(password, 10);

    const user = await createUser({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
    });

    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error(
      "Error registering user:",
      error,
    );

    res.status(500).json({
      message: "Could not register user",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    const user =
      await getUserByEmail(normalizedEmail);

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const passwordMatches =
      await bcrypt.compare(
        password,
        user.passwordHash,
      );

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error(
      "Error logging in:",
      error,
    );

    res.status(500).json({
      message: "Could not log in",
    });
  }
});

export default router;