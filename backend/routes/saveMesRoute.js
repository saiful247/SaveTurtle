import express from "express";
import { SaveMe } from "../models/saveMeModel.js";

const saveMeroute = express.Router();

//Route to Create a new saveMe
saveMeroute.post("/", async (request, response) => {
  try {
    if (
      !request.body.name ||
      !request.body.contact ||
      !request.body.location
    ) {
      return response.status(400).send({
        message: "Send all required fields: titles: name,contact,location",
      });
    }
    const newSaveMe = {
      name: request.body.name,
      contact: request.body.contact,
      location: request.body.location,
    };
    const saveMe = await SaveMe.create(newSaveMe);
    return response.status(201).send(saveMe);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

//Route to Read all saveMes from the DB
saveMeroute.get("/", async (request, response) => {
  try {
    const saveMes = await SaveMe.find({});
    return response.status(200).json({
      count: saveMes.length,
      data: saveMes,
    });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

//Route to Read all saveMes from the DB
saveMeroute.get("/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const saveMe = await SaveMe.findById(id);
    return response.status(200).json(saveMe);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

//Route to Update a saveMe
saveMeroute.put("/:id", async (request, response) => {
  try {
    if (
      !request.body.name ||
      !request.body.contact ||
      !request.body.location
    ) {
      return response.status(400).send({
        message: "Send all required fields: titles: name,contact,location",
      });
    }
    const { id } = request.params;
    const result = await SaveMe.findByIdAndUpdate(id, request.body);

    if (!result) {
      return response.status(400).json({ message: "SaveMe not found" });
    }
    return response.status(200).send({ message: "SaveMe updated succesfully" });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

//Route to Delete a SaveMe
saveMeroute.delete("/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const result = await SaveMe.findByIdAndDelete(id);

    if (!result) {
      return response.status(400).json({ message: "SaveMe not found" });
    }

    return response.status(200).send({ message: "SaveMe deleted succesfully" });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

export default saveMeroute;