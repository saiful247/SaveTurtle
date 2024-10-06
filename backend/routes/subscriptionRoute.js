import express from "express";
import { Subscription } from "../models/subscriptionModel.js";
import multer from "multer";
import path from 'path';

const router = express.Router();

// Setup for image upload (payment slip)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Path where files are stored
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Subscribe to a membership package
router.post("/subscribe", upload.single("paymentSlip"), async (request, response) => {
  try {
    const { userId, firstName, lastName, email, membershipId } = request.body;

    // Collect errors in an array
    const errors = [];

    // Validations
    if (!userId || typeof userId !== 'string' || userId.trim().length === 0) {
      errors.push("Invalid or missing 'userId'");
    }
    if (!firstName || typeof firstName !== 'string' || firstName.trim().length < 3) {
      errors.push("Invalid 'firstName'. Must be at least 3 characters.");
    }
    if (!lastName || typeof lastName !== 'string' || lastName.trim().length < 3) {
      errors.push("Invalid 'lastName'. Must be at least 3 characters.");
    }
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) { // Simple email regex validation
      errors.push("Invalid 'email' format");
    }
    if (!membershipId || typeof membershipId !== 'string' || membershipId.trim().length === 0) {
      errors.push("Invalid or missing 'membershipId'");
    }
    if (!request.file) {
      errors.push("Payment slip is required");
    }

    // If there are errors, return them
    if (errors.length > 0) {
      return response.status(400).json({
        success: false,
        message: "Validation errors",
        errors: errors
      });
    }

    const newSubscription = {
      userId,
      firstName,
      lastName,
      email,
      membershipId,
      paymentSlip: request.file.path, // Store payment slip image path
      status: 'pending' // Set initial status to pending
    };

    const subscription = await Subscription.create(newSubscription);
    return response.status(201).json({ message: "Subscription successful", data: subscription });
  } catch (error) {
    console.log(error.message);
    response.status(500).json({ message: error.message });
  }
});

// View All Subscriptions
router.get('/subscriptions', async (request, response) => {
  try {
    const subscriptions = await Subscription.find(); // Retrieve all subscriptions
    return response.status(200).json(subscriptions); // Send the list of subscriptions
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// View subscription by ID
router.get('/:id', async (request, response) => {
  try {
    const { id } = request.params;
    const subscription = await Subscription.findById(id);

    if (!subscription) {
      return response.status(404).send({ message: 'Subscription not found' });
    }

    return response.status(200).json(subscription);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

export default router;
