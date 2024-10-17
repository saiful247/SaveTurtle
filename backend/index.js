import express from "express";
import { PORT, mongoDBURL } from "./config.js";
import mongoose from "mongoose";
import eventRoute from "./routes/eventRoute.js";
import cors from "cors";
import eventParticipantRoute from "./routes/eventParticipentRoute.js";
import { fileURLToPath } from "url";
import path from "path";
import bookingEmail from "./routes/bookingEmail.js";
import refundEmail from "./routes/refundEmail.js";
import adminRoute from "./routes/AdminRoute.js";
import { Refund } from "./models/refundModel.js";
import refundRoute from "./routes/refundRoutes.js"


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

app.get("/", (request, response) => {
  console.log(request);
  return response.status(234).send("MERN Testing");
});

// Routes
app.use("/events", eventRoute);
app.use("/eventViews", eventRoute);
app.use("/eventViews/eventParticipants", eventParticipantRoute);
app.use("/eventBookingList", eventParticipantRoute);
app.use("/sendEmail", bookingEmail);
app.use("/sendRefundEmail", refundEmail);
app.use("/refunds", refundRoute);
app.use("/userRefunds", refundRoute);

//login
app.use("/admin", adminRoute);
app.use("/admin/register", adminRoute);

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
