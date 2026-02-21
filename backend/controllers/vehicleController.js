const Vehicle = require("../models/Vehicle");

// Create a new vehicle
const createVehicle = async (req, res) => {
    try {
        const vehicleData = req.body;
        const newVehicle = new Vehicle(vehicleData);
        await newVehicle.save();
        res.status(201).json(newVehicle);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// List vehicles
const listVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.find().sort({ name: 1 });
        res.json(vehicles);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get single vehicle
const getVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);
        if (!vehicle) return res.status(404).json({ message: 'Not found' });
        res.json(vehicle);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update vehicle
const updateVehicle = async (req, res) => {
    try {
        const updated = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ message: 'Not found' });
        res.json(updated);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete vehicle
const deleteVehicle = async (req, res) => {
    try {
        const removed = await Vehicle.findByIdAndDelete(req.params.id);
        if (!removed) return res.status(404).json({ message: 'Not found' });
        res.json({ message: 'Deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { createVehicle, listVehicles, getVehicle, updateVehicle, deleteVehicle };