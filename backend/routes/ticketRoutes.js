import express from "express";
import { Ticket } from "../models/ticketModel.js";

const ticketRouter = express.Router();

ticketRouter.post("/", async (request, response) => {
    try {
        if (
            !request.body.topic ||
            !request.body.description ||
            !request.body.email
        ) {
            return response.status(400).send({
                message: "Send all required fields",
            });
        }
        const newTicket = {
            topic: request.body.topic,
            description: request.body.description,
            phone: request.body.phone,
            email: request.body.email,
        };
        const ticket = await Ticket.create(newTicket);
        return response.status(201).send(ticket);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

ticketRouter.get("/:id", async (request, response) => {
    try {
        const { id } = request.params;
        const ticket = await Ticket.findById(id);
        return response.status(200).json(ticket);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

ticketRouter.put("/:id", async (request, response) => {
    try {
        if (
            !request.body.topic ||
            !request.body.description ||
            !request.body.email
        ) {
            return response.status(400).send({
                message: "Send all required fields",
            });
        }
        const { id } = request.params;
        const result = await Ticket.findByIdAndUpdate(id, request.body);

        if (!result) {
            return response.status(400).json({ message: "Ticket not found" });
        }
        return response
            .status(200)
            .send({ message: "Ticket updated successfully" });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

ticketRouter.delete("/:id", async (request, response) => {
    try {
        const { id } = request.params;
        const result = await Ticket.findByIdAndDelete(id);

        if (!result) {
            return response.status(400).json({ message: "Ticket not found" });
        }

        return response
            .status(200)
            .send({ message: "Ticket deleted successfully" });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

export default ticketRouter;
