const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  navn: String,
  telefon: String,
  epost: String,
  tilgang: String,
});

module.exports = mongoose.model('Employee', employeeSchema);
