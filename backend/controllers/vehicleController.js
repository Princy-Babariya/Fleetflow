const Vehicle = require("../models/Vehicle"); // Ensure you have a Vehicle model

// Create a new vehicle
const createVehicle = async (req, res) => {
    try {
        const vehicleData = req.body; // Get vehicle data from the request body
        const newVehicle = new Vehicle(vehicleData); // Create a new vehicle instance
        await newVehicle.save(); // Save the vehicle to the database
        res.status(201).json(newVehicle); // Respond with the created vehicle
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" }); // Handle errors
    }
};

module.exports = { createVehicle };