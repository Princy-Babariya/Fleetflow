const Driver = require("../models/Driver");

// Create a new driver
exports.createDriver = async (req, res) => {
    try {
        const driverData = req.body; // Get driver data from the request body
        const newDriver = new Driver(driverData); // Create a new driver instance
        await newDriver.save(); // Save the driver to the database
        res.status(201).json(newDriver); // Respond with the created driver
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" }); // Handle errors
    }
};

// Get all drivers
exports.getDrivers = async (req, res) => {
    try {
        const drivers = await Driver.find(); // Retrieve all drivers
        res.json(drivers); // Respond with the list of drivers
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" }); // Handle errors
    }
};

// Get a driver by ID
exports.getDriverById = async (req, res) => {
    try {
        const driver = await Driver.findById(req.params.id); // Find driver by ID
        if (!driver) return res.status(404).json({ message: "Driver not found" }); // Handle not found
        res.json(driver); // Respond with the driver
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" }); // Handle errors
    }
};

// Update a driver
exports.updateDriver = async (req, res) => {
    try {
        const driver = await Driver.findByIdAndUpdate(req.params.id, req.body, { new: true }); // Update driver
        if (!driver) return res.status(404).json({ message: "Driver not found" }); // Handle not found
        res.json(driver); // Respond with the updated driver
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" }); // Handle errors
    }
};

// Delete a driver
exports.deleteDriver = async (req, res) => {
    try {
        const driver = await Driver.findByIdAndDelete(req.params.id); // Delete driver
        if (!driver) return res.status(404).json({ message: "Driver not found" }); // Handle not found
        res.json({ message: "Driver deleted successfully" }); // Respond with success message
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" }); // Handle errors
    }
};