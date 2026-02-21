const express = require("express");
const cors = require("cors");
require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
// Public / unauthenticated routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));

// Protected resource routes
app.use("/api/vehicles", require("./routes/vehicleRoutes"));
app.use("/api/drivers", require("./routes/driverRoutes"));
app.use("/api/trips", require("./routes/tripRoutes"));
app.use("/api/maintenance", require("./routes/maintenanceRoutes"));
app.use("/api/fuel", require("./routes/fuelRoutes"));

// Websocket POST endpoint to accept location updates from devices or services
app.use("/ws", require("./routes/wsRoutes"));

const PORT = process.env.PORT || 5000;

// Create HTTP server and attach Socket.IO
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Make io available to routes via app
app.set("io", io);

io.on("connection", (socket) => {
	console.log("Socket connected:", socket.id);

	socket.on("vehicleLocation", (data) => {
		// broadcast to all connected clients
		io.emit("vehicleLocationUpdate", data);
	});

	socket.on("disconnect", () => {
		console.log("Socket disconnected", socket.id);
	});
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));