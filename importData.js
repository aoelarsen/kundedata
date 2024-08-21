const mongoose = require('mongoose');
const fs = require('fs');

// Tilkoblingsstrengen din til MongoDB Atlas
const uri = "mongodb+srv://sp1348:uzETy8kW83sXiHy4@cluster0.wtpcbrd.mongodb.net/rsData?retryWrites=true&w=majority&appName=Cluster0";


// Definer Mongoose-modellene dine
const customerSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    phoneNumber: String,
    email: String,
    registrationDate: String,
    lastModified: String
});

const Customer = mongoose.model('Customer', customerSchema);

const employeeSchema = new mongoose.Schema({
    navn: String,
    telefon: String,
    epost: String,
    tilgang: String
});

const Employee = mongoose.model('Employee', employeeSchema);

const orderSchema = new mongoose.Schema({
    Varemerke: String,
    Produkt: String,
    Størrelse: String,
    Farge: String,
    Status: String,
    Kommentar: String,
    Ansatt: String,
    Endretdato: String,
    RegistrertDato: String,
    kundeid: String,
    KundeTelefon: String
});

const Order = mongoose.model('Order', orderSchema);

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB Atlas');
}).catch(err => {
    console.error('Error connecting to MongoDB Atlas:', err);
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async function() {
    console.log("We're connected!");

    try {
        const data = JSON.parse(fs.readFileSync('./db.json', 'utf-8'));

        // Sett inn dataene dine i MongoDB
        await Customer.insertMany(data.customers);
        console.log('Customers inserted:', data.customers.length);

        await Employee.insertMany(data.employees);
        console.log('Employees inserted:', data.employees.length);

        await Order.insertMany(data.orders);
        console.log('Orders inserted:', data.orders.length);

        console.log('Data migrated successfully');
        mongoose.connection.close();
    } catch (err) {
        console.error('Error during data migration:', err);
        mongoose.connection.close();
    }
});
