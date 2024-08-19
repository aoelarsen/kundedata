const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  phoneNumber: String,
  email: String,
  registrationDate: String,
  lastModified: String,
});

module.exports = mongoose.model('Customer', customerSchema);
