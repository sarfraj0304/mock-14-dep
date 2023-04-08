const mongoose = require("mongoose");
const schema = mongoose.Schema({
  name: { type: String, required: true },
  gender: { type: String, required: true },
  dob: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: Number, required: true },
  initialBalance: { type: Number, required: true },
  aadhar: { type: String, required: true },
  pan: { type: String, required: true },
  amount: { type: Number },
});

const bankModel = mongoose.model("user", schema);
module.exports = { bankModel };
