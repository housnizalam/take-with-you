import express from "express";

import {
  createUser,
  getUserById,
  getAllUsers,
} from "../repositories/userRepository.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { id, name } = req.body;

    if (!id || !name) {
      return res.status(400).json({
        message: "User id and name are required",
      });
    }

    const user = await createUser({
      _id: id,
      name,
    });

    res.status(201).json(user);
  } catch (error) {
    console.error("Error creating user:", error);

    res.status(500).json({
      message: "Could not create user",
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const users = await getAllUsers();

    res.status(200).json(users);
  } catch (error) {
    console.error("Error loading users:", error);

    res.status(500).json({
      message: "Could not load users",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await getUserById(req.params.id);

    res.status(200).json(user);
  } catch (error) {
    console.error("Error loading user:", error);

    res.status(500).json({
      message: "Could not load user",
    });
  }
});

export default router;