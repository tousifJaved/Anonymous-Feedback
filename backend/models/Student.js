const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const StudentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  roll: { type: String, required: true },
  std_id: { type: String, unique: true, default: uuidv4 },
});

module.exports = mongoose.model("Student", StudentSchema);