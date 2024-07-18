// server.js

const express = require("express");
const bodyParser = require("body-parser");
const ParkingLot = require("./ParkingLot"); // Adjust the path as necessary
const app = express();
const port = 3000;

// Body parser middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (e.g., Vue.js client-side code)
app.use(express.static("public"));

// Initialize a ParkingLot instance
let parkingLot = new ParkingLot();

// POST endpoint to handle parking actions

// park
// {
//   "vehicleSizes": [0, 0, 1, 2, 0, 0, 1, 2, 2, 0, 0]
// }
app.post("/api/park", (req, res) => {
  // Assuming request body contains vehicle sizes array
  let vehicleSizes = req.body.vehicleSizes;

  if (!vehicleSizes || !Array.isArray(vehicleSizes)) {
    return res.status(400).json({ error: "Invalid vehicle sizes array" });
  }

  let parkedSlots = parkingLot.parkVehicle(vehicleSizes);

  // Prepare the response object structured by slot types
  let response = {
    SP: [],
    MP: [],
    LP: [],
  };

  // Iterate through the parked slots and organize them by type
  parkedSlots.forEach((slot) => {
    let slotType = slot.slice(0, 2); // Extract slot type from slot name
    let vehicleType = parkingLot.slots[slotType][0].vehicleType; // Assuming first vehicle in slot type defines the type

    response[slotType].push({
      slot: slot,
      vehicleType: vehicleType,
      entryTime: new Date().getTime(), // Assuming entry time is current time for simplicity
    });
  });

  res.json(response);
});

// POST endpoint to handle unparking actions
//unpark
// {
//   "slot": "MP2"
// }
app.post("/api/unpark", (req, res) => {
  let slot = req.body.slot;

  if (!slot || typeof slot !== "string") {
    return res.status(400).json({ error: "Invalid slot name" });
  }

  parkingLot.unparkVehicle(slot);

  res.json({ message: `Vehicle unparked from slot ${slot}` });
});

app.get("/api/showall", (req, res) => {
  // Retrieve all parked vehicles from the ParkingLot instance
  let parkedVehicles = parkingLot.getAllParkedVehicles();

  // Prepare the response object structured by slot types
  let response = {
    SP: [],
    MP: [],
    LP: [],
  };

  // Iterate through the parked vehicles and organize them by slot type
  parkedVehicles.forEach((vehicle) => {
    let slotType = vehicle.slot.slice(0, 2); // Extract slot type from slot name

    response[slotType].push({
      slot: vehicle.slot,
      vehicleType: vehicle.vehicleType,
      entryTime: vehicle.entryTime,
    });
  });

  res.json(response);
});

app.get("/api/clear", (req, res) => {
  parkingLot.clearParking();
  res.json({ message: "All parking slots have been cleared." });
});
// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
