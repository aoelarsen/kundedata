const mongoose = require('./db'); // Dette er din MongoDB-tilkobling
const Customer = require('./Customer');
const Employee = require('./Employee');
const Order = require('./Order');

const jsonData = require('./data.json'); // JSON-filen din

const importData = async () => {
  try {
    // Først tømmer du eksisterende data
    await Customer.deleteMany({});
    await Employee.deleteMany({});
    await Order.deleteMany({});

    // Importer kundedata
    await Customer.insertMany(jsonData.customers);
    console.log('Kundedata importert');

    // Importer ansattdata
    await Employee.insertMany(jsonData.employees);
    console.log('Ansattdata importert');

    // Importer ordredata
    await Order.insertMany(jsonData.orders);
    console.log('Ordredato importert');

    process.exit();
  } catch (error) {
    console.error('Feil under importering:', error);
    process.exit(1);
  }
};

importData();
