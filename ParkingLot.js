class ParkingLot {
  constructor() {
    // Initialize parking slots for Small (SP), Medium (MP), and Large (LP) vehicles
    this.slots = {
      SP: [], // Small vehicle slots
      MP: [], // Medium vehicle slots
      LP: [], // Large vehicle slots
    };
    this.entryPoints = 3; // Number of entry points into the parking lot
  }

  // Increase the number of entry points
  addEntryPoint() {
    this.entryPoints++;
  }

  // Park multiple vehicles of different sizes
  parkVehicle(vehicleSizes) {
    let parkedSlots = []; // Array to store slots where vehicles are parked

    vehicleSizes.forEach((size, index) => {
      let vehicleType;
      switch (size) {
        case 0:
          vehicleType = "S"; // Small vehicle
          break;
        case 1:
          vehicleType = "M"; // Medium vehicle
          break;
        case 2:
          vehicleType = "L"; // Large vehicle
          break;
        default:
          console.log(`Invalid vehicle size: ${size}`);
          return;
      }

      // Find an available slot based on the vehicle type
      let availableSlot = this.findAvailableSlot(vehicleType);

      if (availableSlot !== null) {
        // Allocate the slot for the vehicle
        this.allocateSlot(availableSlot, vehicleType);
        parkedSlots.push(availableSlot); // Record the parked slot
        console.log(
          `Vehicle ${
            index + 1
          } (${vehicleType}) parked in slot ${availableSlot}`
        );
      } else {
        console.log(
          `No available slot for vehicle type ${vehicleType} at the moment.`
        );
      }
    });

    return parkedSlots; // Return array of parked slots
  }

  // Remove a vehicle from a specified slot
  unparkVehicle(slot) {
    let found = false; // Flag to indicate if the slot was found and vehicle was unparked

    // Iterate through each slot type (SP, MP, LP)
    for (let slotType of Object.keys(this.slots)) {
      // Find the index of the vehicle in the slot array
      let index = this.slots[slotType].findIndex(
        (vehicle) => vehicle.slot === slot
      );
      if (index !== -1) {
        let vehicle = this.slots[slotType][index];
        let entryTime = vehicle.entryTime; // Time when the vehicle was parked
        let exitTime = new Date().getTime(); // Current time when vehicle is unparked
        let fee = this.calculateParkingFee(slot, entryTime, exitTime); // Calculate parking fee
        console.log(
          `Vehicle unparked from slot ${slot}. Parking fee: ${fee} pesos`
        );
        this.slots[slotType].splice(index, 1); // Remove vehicle from the slot
        found = true;
        if (this.slots[slotType].length === 0) {
          this.slots[slotType].push({}); // If slot becomes empty, push an empty object to maintain structure
        }
        break; // Exit loop once vehicle is unparked
      }
    }
    if (!found) {
      console.log(`Slot ${slot} is already empty.`);
    }
  }

  // Calculate parking fee based on slot type, entry time, and exit time
  calculateParkingFee(slot, entryTime, exitTime) {
    const slotType = slot.slice(0, 2); // Extract slot type from slot name
    const entryHour = new Date(entryTime).getHours(); // Hour when vehicle was parked
    const exitHour = new Date(exitTime).getHours(); // Hour when vehicle is unparked
    let duration = Math.ceil((exitTime - entryTime) / (1000 * 60 * 60)); // Duration of parking in hours
    let fee = 40; // Minimum fee for parking

    // Calculate fee based on slot type and duration of parking
    switch (slotType) {
      case "SP":
        fee += duration > 3 ? (duration - 3) * 20 : 0;
        break;
      case "MP":
        fee += duration > 3 ? (duration - 3) * 60 : 0;
        break;
      case "LP":
        fee += duration > 3 ? (duration - 3) * 100 : 0;
        break;
      default:
        console.log(`Invalid slot type: ${slotType}`);
        return null; // Return null if slot type is invalid
    }

    // If parking duration exceeds 24 hours, calculate fee for each day and remaining hours

    if (duration > 24) {
      const fullDays = Math.floor(duration / 24); // Full days of parking
      const remainingHours = duration % 24; // Remaining hours after full days

      fee = fullDays * 5000; // Fee for full days
      console.log(fee, 4444);
      switch (slotType) {
        case "SP":
          fee += remainingHours * 20;
          break;
        case "MP":
          fee += remainingHours * 60;
          break;
        case "LP":
          fee += remainingHours * 100;
          break;
      }
    }

    // If vehicle parked for less than or equal to 1 hour, set fee to minimum

    return fee; // Return calculated parking fee
  }

  // Find an available slot based on vehicle type (S, M, L)
  findAvailableSlot(vehicleType) {
    switch (vehicleType) {
      case "S":
        return this.findAvailableSlotForType(["SP", "MP", "LP"]);
      case "M":
        return this.findAvailableSlotForType(["MP", "LP"]);
      case "L":
        return this.findAvailableSlotForType(["LP"]);
      default:
        console.log(`Invalid vehicle type: ${vehicleType}`);
        return null; // Return null if vehicle type is invalid
    }
  }

  // Find an available slot from preferred slot types in order
  findAvailableSlotForType(preferredOrder) {
    // Iterate through each preferred slot type
    for (let slotType of preferredOrder) {
      // Check if there is an available slot in the slot type
      if (this.slots[slotType].length < this.entryPoints) {
        // Iterate through each possible slot number within the slot type
        for (let i = 1; i <= this.entryPoints; i++) {
          let slotName = slotType + i; // Generate slot name
          // Check if slot number is not already occupied
          if (!this.slots[slotType].some((v) => v.slot === slotName)) {
            return slotName; // Return available slot name
          }
        }
      }
    }
    return null; // Return null if no available slot is found
  }

  // Allocate a slot for a vehicle of a specific type
  allocateSlot(slot, vehicleType) {
    let entryTime = new Date().getTime(); // Current time when vehicle is parked
    this.slots[slot.slice(0, 2)].push({ slot, vehicleType, entryTime }); // Add vehicle to the slot array
  }

  // Display current allocation of parking slots
  displaySlots() {
    console.log("Current parking slots allocation:");

    // Sort each type of slots based on slot value
    for (let slotType of Object.keys(this.slots)) {
      this.slots[slotType].sort((a, b) =>
        a.slot < b.slot ? -1 : a.slot > b.slot ? 1 : 0
      );
    }

    console.log(this.slots); // Output sorted slots
  }
  // Define this method inside your ParkingLot class
  clearParking() {
    // Iterate through each slot type (SP, MP, LP) and empty the array
    for (let slotType of Object.keys(this.slots)) {
      this.slots[slotType] = [];
    }
  }

  getAllParkedVehicles() {
    let parkedVehicles = [];

    // Iterate through each slot type (SP, MP, LP)
    for (let slotType of Object.keys(this.slots)) {
      // Iterate through vehicles in each slot type
      this.slots[slotType].forEach((vehicle) => {
        if (vehicle.slot) {
          // Check if slot is not empty (to avoid empty object)
          parkedVehicles.push({
            slot: vehicle.slot,
            vehicleType: vehicle.vehicleType,
            entryTime: vehicle.entryTime,
          });
        }
      });
    }

    return parkedVehicles;
  }
}

module.exports = ParkingLot;
