import express from "express";
import { Membership } from "../models/membershipModel.js";
import { Subscription } from "../models/subscriptionModel.js";

const router = express.Router();

// Create a new membership plan
router.post("/", async (request, response) => {
  try {
    const { name, price, duration, features } = request.body;

    // Validations
    if (!name || typeof name !== 'string' || name.length < 3) {
      return response.status(400).send({
        message: "Invalid 'name'. Must be at least 3 characters.",
      });
    }
    if (!price || typeof price !== 'number' || price <= 0) {
      return response.status(400).send({
        message: "Invalid 'price'. Must be a positive number.",
      });
    }
    if (!duration || typeof duration !== 'string' || duration.length < 3) {
      return response.status(400).send({
        message: "Invalid 'duration'. Must be at least 3 characters.",
      });
    }
    if (!features || typeof features !== 'string' || features.length < 10) {
      return response.status(400).send({
        message: "Invalid 'features'. Must be at least 10 characters.",
      });
    }

    const newMembership = {
      name,
      price,
      duration,
      features,
    };

    const membership = await Membership.create(newMembership);
    return response.status(201).send(membership);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Get all membership plans
router.get("/", async (request, response) => {
  try {
    const memberships = await Membership.find({});
    return response.status(200).json({
      count: memberships.length,
      data: memberships,
    });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Get membership plan by ID
router.get("/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const membership = await Membership.findById(id);

    if (!membership) {
      return response.status(404).send({ message: "Membership not found" });
    }

    return response.status(200).json(membership);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Update a membership plan
router.put("/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const { name, price, duration, features } = request.body;

    if (!name || !price || !duration || !features) {
      return response.status(400).send({
        message: "All fields are required: name, price, duration, and features",
      });
    }

    const result = await Membership.findByIdAndUpdate(id, request.body, {
      new: true,
    });

    if (!result) {
      return response.status(404).send({ message: "Membership not found" });
    }

    return response.status(200).send({ message: "Membership updated successfully", data: result });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Delete a membership plan
router.delete("/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const result = await Membership.findByIdAndDelete(id);

    if (!result) {
      return response.status(404).send({ message: "Membership not found" });
    }

    return response.status(200).send({ message: "Membership deleted successfully" });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

export default router;
