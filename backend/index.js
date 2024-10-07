import express from "express";
import { PORT, mongoDBURL } from "./config.js";
import mongoose from "mongoose";
import eventRoute from "./routes/eventRoute.js";
import cors from "cors";
import eventParticipantRoute from "./routes/eventParticipentRoute.js";
import { fileURLToPath } from "url";
import path from "path";
import bookingEmail from "./routes/bookingEmail.js";
import adminRoute from "./routes/AdminRoute.js";

import productRoute from "./routes/productRoute.js";
import purchaseRoute from "./routes/purchaseRoute.js";

const app = express();

// Middleware for parsing request body
app.use(express.json());

// Middleware for handling CORS Policy
app.use(cors());

// Setup for ES module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files
app.use(
  "/uploads/eventPayment",
  express.static(path.join(__dirname, "uploads/eventPayment"))
);

app.use(
  "/uploads/productImage",
  express.static(path.join(__dirname, "uploads/productImage"))
);

app.use(
  "/uploads/purchasePayment",
  express.static(path.join(__dirname, "uploads/purchasePayment"))
);

app.get("/", (request, response) => {
  console.log(request);
  return response.status(234).send("MERN Testing");
});

// Event Routes
app.use("/events", eventRoute);
app.use("/eventViews", eventRoute);
app.use("/eventViews/eventParticipants", eventParticipantRoute);
app.use("/eventBookingList", eventParticipantRoute);
app.use("/sendEmail", bookingEmail);

//login
app.use("/admin", adminRoute);
app.use("/admin/register", adminRoute);

// Product Routes
app.use("/products", productRoute);
app.use("/productViews", productRoute);
app.use("/productViews/purchaseForm", purchaseRoute);
app.use("/purchaseList", purchaseRoute);


mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log("App connected to the Database");
    app.listen(PORT, () => {
      console.log(`App is listening to port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });