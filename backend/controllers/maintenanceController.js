const Maintenance = require("../models/Maintainance"); // Ensure the model name matches your file

// Create a new maintenance record
exports.createMaintenanceRecord = async (req, res) => {
    try {
        const maintenanceData = req.body; // Get maintenance data from the request body
        const newMaintenanceRecord = new Maintenance(maintenanceData); // Create a new maintenance record instance
        await newMaintenanceRecord.save(); // Save the maintenance record to the database
        res.status(201).json(newMaintenanceRecord); // Respond with the created maintenance record
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" }); // Handle errors
    }
};

// Get all maintenance records
exports.getMaintenanceRecords = async (req, res) => {
    try {
        const maintenanceRecords = await Maintenance.find(); // Retrieve all maintenance records
        res.json(maintenanceRecords); // Respond with the list of maintenance records
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" }); // Handle errors
    }
};

// Get a maintenance record by ID
exports.getMaintenanceRecordById = async (req, res) => {
    try {
        const maintenanceRecord = await Maintenance.findById(req.params.id); // Find maintenance record by ID
        if (!maintenanceRecord) return res.status(404).json({ message: "Maintenance record not found" }); // Handle not found
        res.json(maintenanceRecord); // Respond with the maintenance record
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" }); // Handle errors
    }
};

// Update a maintenance record
exports.updateMaintenanceRecord = async (req, res) => {
    try {
        const maintenanceRecord = await Maintenance.findByIdAndUpdate(req.params.id, req.body, { new: true }); // Update maintenance record
        if (!maintenanceRecord) return res.status(404).json({ message: "Maintenance record not found" }); // Handle not found
        res.json(maintenanceRecord); // Respond with the updated maintenance record
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" }); // Handle errors
    }
};

// Delete a maintenance record
exports.deleteMaintenanceRecord = async (req, res) => {
    try {
        const maintenanceRecord = await Maintenance.findByIdAndDelete(req.params.id); // Delete maintenance record
        if (!maintenanceRecord) return res.status(404).json({ message: "Maintenance record not found" }); // Handle not found
        res.json({ message: "Maintenance record deleted successfully" }); // Respond with success message
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" }); // Handle errors
    }
};