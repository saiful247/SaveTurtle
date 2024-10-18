import { SaveMe } from "../models/saveMeModel.js";
import dotenv from "dotenv";
import mongoose from "mongoose";

// Load environment variables
dotenv.config();

// Create a new SaveMe report
export const addSaveMe = async (req, res) => {
  const image_filename = req.file ? req.file.filename : null;

  const saveMe = new SaveMe({
    name: req.body.name,
    contact: req.body.contact,
    location: req.body.location,
    description: req.body.description,
    photo: image_filename,
    emergencyLevel: req.body.emergencyLevel,
  });

  try {
    await saveMe.save();

    res.json({
      success: true,
      message: "Report added successfully and SMS sent",
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to add report or send SMS" });
  }
};

// Get a SaveMe report by ID
export const getSaveMeById = async (req, res) => {
  try {
    const saveMe = await SaveMe.findById(req.params.id);
    if (!saveMe) {
      return res
        .status(404)
        .json({ success: false, message: "Report not found" });
    }
    res.json({ success: true, data: saveMe });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to get report" });
  }
};

// Update a SaveMe report by ID
export const updateSaveMe = async (req, res) => {
  try {
    const saveMe = await SaveMe.findById(req.params.id);

    if (!saveMe) {
      return res
        .status(404)
        .json({ success: false, message: "Report not found" });
    }

    saveMe.name = req.body.name || saveMe.name;
    saveMe.contact = req.body.contact || saveMe.contact;
    saveMe.location = req.body.location || saveMe.location;
    saveMe.description = req.body.description || saveMe.description;
    saveMe.emergencyLevel = req.body.emergencyLevel || saveMe.emergencyLevel;

    if (req.file) {
      saveMe.photo = req.file.filename; // Update photo if new file is uploaded
    }

    await saveMe.save();
    res.json({
      success: true,
      message: "Report updated successfully",
      data: saveMe,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to update report" });
  }
};

export const deleteSaveMe = async (req, res) => {
  try {
    // Validate the ID
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid report ID" });
    }

    // Use findByIdAndDelete to delete the document directly
    const deletedSaveMe = await SaveMe.findByIdAndDelete(req.params.id);

    // If the report is not found
    if (!deletedSaveMe) {
      return res
        .status(404)
        .json({ success: false, message: "Report not found" });
    }

    res.json({ success: true, message: "Report deleted successfully" });
  } catch (error) {
    console.error("Error deleting report:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete report" });
  }
};

// Get all SaveMe reports
export const getAllSaveMes = async (req, res) => {
  try {
    const saveMes = await SaveMe.find(); // Fetch all records from the database
    res.json({ success: true, data: saveMes });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to retrieve reports" });
  }
};
