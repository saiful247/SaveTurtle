// routes/bookingEmail.js
import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

// Email sending endpoint
router.post("/", async (req, res) => {
  const { email, status } = req.body; // Get email and status from the request body

  let subject, text;
  if (status === "approved") {
    subject = "SaveTurtle Event Refund is Approved";
    text = "Your SaveTurtle Refund is approved!";
  } else if (status === "disapproved") {
    subject = "SaveTurtle Event Refund Disapproved";
    text = "Your SaveTurtle Refund is disapproved!";
  }

  // Nodemailer transporter configuration
  const transporter = nodemailer.createTransport({
    service: "gmail", // or any email service provider like Outlook, Yahoo, etc.
    auth: {
      user: "saveturtlescaresl@gmail.com", // your email
      pass: "vsglcgmwxxtlmlbj", // your email password or app-specific password
    },
  });

  // Sending the email
  try {
    await transporter.sendMail({
      from: "saveturtlescaresl@gmail.com",
      to: email,
      subject: subject,
      text: text,
    });
    res.status(200).send("Email sent successfully");
  } catch (error) {
    res.status(500).send("Error sending email: " + error.message);
  }
});

// Export the router as default
export default router;
