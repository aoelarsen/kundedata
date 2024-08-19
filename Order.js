const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  Varemerke: String,
  Produkt: String,
  Størrelse: String,
  Farge: String,
  Status: String,
  Kommentar: String,
  Ansatt: String,
  kundeid: String,
  KundeTelefon: String,
  RegistrertDato: String,
  Endretdato: String,
});

module.exports = mongoose.model('Order', orderSchema);
