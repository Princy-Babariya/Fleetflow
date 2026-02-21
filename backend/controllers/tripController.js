const Trip = require("../models/Trip");
const Vehicle = require("../models/Vehicle");
const Driver = require("../models/Driver");

exports.createTrip = async (req, res) => {
    try {
        const { vehicleId, driverId, cargoWeight, revenue, startOdometer } = req.body;

        const vehicle = await Vehicle.findById(vehicleId);
        const driver = await Driver.findById(driverId);

        if (!vehicle || !driver)
            return res.status(404).json({ message: "Vehicle or Driver not found" });

        if (vehicle.status !== "Available")
            return res.status(400).json({ message: "Vehicle not available" });

        if (driver.status !== "OnDuty")
            return res.status(400).json({ message: "Driver not available" });

        if (new Date(driver.licenseExpiry) < new Date())
            return res.status(400).json({ message: "License expired" });

        if (cargoWeight > vehicle.maxCapacity)
            return res.status(400).json({ message: "Cargo exceeds capacity" });

        const trip = await Trip.create({
            vehicleId,
            driverId,
            cargoWeight,
            revenue,
            startOdometer,
            status: "Dispatched"
        });

        vehicle.status = "OnTrip";
        driver.status = "OnTrip";

        await vehicle.save();
        await driver.save();

        res.json(trip);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.completeTrip = async (req, res) => {
    try {
        const { tripId } = req.params;
        const { endOdometer } = req.body;

        const trip = await Trip.findById(tripId);

        if (!trip)
            return res.status(404).json({ message: "Trip not found" });

        if (trip.status === "Completed")
            return res.status(400).json({ message: "Trip already completed" });

        if (!endOdometer)
            return res.status(400).json({ message: "End odometer required" });

        if (endOdometer < trip.startOdometer)
            return res.status(400).json({ message: "Invalid odometer value" });

        const vehicle = await Vehicle.findById(trip.vehicleId);
        const driver = await Driver.findById(trip.driverId);

        // Calculate distance
        const distance = endOdometer - trip.startOdometer;

        // Update trip
        trip.endOdometer = endOdometer;
        trip.status = "Completed";
        await trip.save();

        // Update vehicle
        vehicle.odometer = endOdometer;
        vehicle.status = "Available";
        await vehicle.save();

        // Update driver
        driver.status = "OnDuty";
        await driver.save();

        res.json({
            message: "Trip completed successfully",
            distanceTravelled: distance
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};