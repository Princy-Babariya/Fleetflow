const Fuel = require("../models/Fuel");

// Create a new fuel record
exports.createFuelRecord = async (req, res) => {
    try {
        const fuelData = req.body; // Get fuel data from the request body
        const newFuelRecord = new Fuel(fuelData); // Create a new fuel record instance
        await newFuelRecord.save(); // Save the fuel record to the database
        res.status(201).json(newFuelRecord); // Respond with the created fuel record
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" }); // Handle errors
    }
};

// Get all fuel records
exports.getFuelRecords = async (req, res) => {
    try {
        const fuelRecords = await Fuel.find(); // Retrieve all fuel records
        res.json(fuelRecords); // Respond with the list of fuel records
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" }); // Handle errors
    }
};

// Get a fuel record by ID
exports.getFuelRecordById = async (req, res) => {
    try {
        const fuelRecord = await Fuel.findById(req.params.id); // Find fuel record by ID
        if (!fuelRecord) return res.status(404).json({ message: "Fuel record not found" }); // Handle not found
        res.json(fuelRecord); // Respond with the fuel record
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" }); // Handle errors
    }
};

// Update a fuel record
exports.updateFuelRecord = async (req, res) => {
    try {
        const fuelRecord = await Fuel.findByIdAndUpdate(req.params.id, req.body, { new: true }); // Update fuel record
        if (!fuelRecord) return res.status(404).json({ message: "Fuel record not found" }); // Handle not found
        res.json(fuelRecord); // Respond with the updated fuel record
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" }); // Handle errors
    }
};

// Delete a fuel record
exports.deleteFuelRecord = async (req, res) => {
    try {
        const fuelRecord = await Fuel.findByIdAndDelete(req.params.id); // Delete fuel record
        if (!fuelRecord) return res.status(404).json({ message: "Fuel record not found" }); // Handle not found
        res.json({ message: "Fuel record deleted successfully" }); // Respond with success message
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" }); // Handle errors
    }
};