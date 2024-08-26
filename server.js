const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Bruk Heroku's dynamisk tildelte port, eller 5000 som fallback lokalt
const port = process.env.PORT || 5000;

// Middleware
const corsOptions = {
  origin: ['https://rssport.netlify.app', 'http://localhost:3000'], // Tillater både produksjons- og lokal utviklingsopprinnelse
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());

// Bruk miljøvariabel for MongoDB Atlas URI
const uri = process.env.MONGO_URI || "mongodb+srv://sp1348:uzETy8kW83sXiHy4@cluster0.wtpcbrd.mongodb.net/rsData?retryWrites=true&w=majority&appName=Cluster0";

// Connect to MongoDB Atlas
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('Error connecting to MongoDB Atlas:', err));

// Schema and Model for Customers
const customerSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  phoneNumber: String,
  email: String,
  registrationDate: String,
  lastModified: String,
  customerNumber: Number, // Sørg for at dette feltet er riktig definert som Number
  status: { type: String, default: 'aktiv' } // Nytt felt for status
});

const Customer = mongoose.model('Customer', customerSchema);

// Schema and Model for Orders
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
  KundeTelefon: String,
});

const Order = mongoose.model('Order', orderSchema);

// Schema and Model for Employees
const employeeSchema = new mongoose.Schema({
  navn: String,
  telefon: String,
  epost: String,
  tilgang: String,
});

const Employee = mongoose.model('Employee', employeeSchema);

// Endpoint to get all employees
app.get('/employees', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Endpoint to get a single employee by ID
app.get('/employees/:id', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (employee == null) {
      return res.status(404).json({ message: 'Ansatt ikke funnet' });
    }
    res.json(employee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Endpoint to create a new employee
app.post('/employees', async (req, res) => {
  const employee = new Employee({
    navn: req.body.navn,
    telefon: req.body.telefon,
    epost: req.body.epost,
    tilgang: req.body.tilgang,
  });

  try {
    const newEmployee = await employee.save();
    res.status(201).json(newEmployee);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Endpoint to update an employee
app.patch('/employees/:id', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (employee == null) {
      return res.status(404).json({ message: 'Ansatt ikke funnet' });
    }

    if (req.body.navn != null) {
      employee.navn = req.body.navn;
    }
    if (req.body.telefon != null) {
      employee.telefon = req.body.telefon;
    }
    if (req.body.epost != null) {
      employee.epost = req.body.epost;
    }
    if (req.body.tilgang != null) {
      employee.tilgang = req.body.tilgang;
    }

    const updatedEmployee = await employee.save();
    res.json(updatedEmployee);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Endpoint to delete an employee
app.delete('/employees/:id', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (employee == null) {
      return res.status(404).json({ message: 'Ansatt ikke funnet' });
    }

    await employee.remove();
    res.json({ message: 'Ansatt slettet' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Endpoint to get all customers
app.get('/customers', async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Endpoint to get a single customer by ID
app.get('/customers/:id', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (customer == null) {
      return res.status(404).json({ message: 'Kunde ikke funnet' });
    }
    res.json(customer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Endpoint to create a new customer
app.post('/customers', async (req, res) => {
  try {
    // Finn høyeste eksisterende customerNumber og øk med 1
    const lastCustomer = await Customer.findOne().sort('-customerNumber');
    const nextCustomerNumber = lastCustomer ? lastCustomer.customerNumber + 1 : 1;

    const customer = new Customer({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phoneNumber: req.body.phoneNumber,
      email: req.body.email,
      registrationDate: req.body.registrationDate,
      lastModified: req.body.lastModified,
      customerNumber: nextCustomerNumber, // Setter customerNumber
      status: req.body.status // Setter status fra request body
    });

    console.log('Lagrer kunde med følgende data:', customer); // Logging for å inspisere data før lagring
    
    const newCustomer = await customer.save();
    res.status(201).json(newCustomer);
  } catch (err) {
    console.error('Feil ved opprettelse av kunde:', err);
    res.status(400).json({ message: err.message });
  }
});



// Endpoint to update a customer
app.patch('/customers/:id', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (customer == null) {
      return res.status(404).json({ message: 'Kunde ikke funnet' });
    }

    if (req.body.firstName != null) {
      customer.firstName = req.body.firstName;
    }
    if (req.body.lastName != null) {
      customer.lastName = req.body.lastName;
    }
    if (req.body.phoneNumber != null) {
      customer.phoneNumber = req.body.phoneNumber;
    }
    if (req.body.email != null) {
      customer.email = req.body.email;
    }
    if (req.body.registrationDate != null) {
      customer.registrationDate = req.body.registrationDate;
    }
    if (req.body.lastModified != null) {
      customer.lastModified = req.body.lastModified;
    }

    const updatedCustomer = await customer.save();
    res.json(updatedCustomer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Endpoint to delete a customer
app.delete('/customers/:id', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (customer == null) {
      return res.status(404).json({ message: 'Kunde ikke funnet' });
    }

    await customer.remove();
    res.json({ message: 'Kunde slettet' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Endpoint to get all orders
app.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Endpoint to get a single order by ID
app.get('/orders/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order == null) {
      return res.status(404).json({ message: 'Ordre ikke funnet' });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Endpoint to create a new order
app.post('/orders', async (req, res) => {
  const order = new Order({
    Varemerke: req.body.Varemerke,
    Produkt: req.body.Produkt,
    Størrelse: req.body.Størrelse,
    Farge: req.body.Farge,
    Status: req.body.Status,
    Kommentar: req.body.Kommentar,
    Ansatt: req.body.Ansatt,
    Endretdato: req.body.Endretdato,
    RegistrertDato: req.body.RegistrertDato,
    kundeid: req.body.kundeid,
    KundeTelefon: req.body.KundeTelefon,
  });

  try {
    const newOrder = await order.save();
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Endpoint to update an order
app.patch('/orders/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order == null) {
      return res.status(404).json({ message: 'Ordre ikke funnet' });
    }

    if (req.body.Varemerke != null) {
      order.Varemerke = req.body.Varemerke;
    }
    if (req.body.Produkt != null) {
      order.Produkt = req.body.Produkt;
    }
    if (req.body.Størrelse != null) {
      order.Størrelse = req.body.Størrelse;
    }
    if (req.body.Farge != null) {
      order.Farge = req.body.Farge;
    }
    if (req.body.Status != null) {
      order.Status = req.body.Status;
    }
    if (req.body.Kommentar != null) {
      order.Kommentar = req.body.Kommentar;
    }
    if (req.body.Ansatt != null) {
      order.Ansatt = req.body.Ansatt;
    }
    if (req.body.Endretdato != null) {
      order.Endretdato = req.body.Endretdato;
    }
    if (req.body.RegistrertDato != null) {
      order.RegistrertDato = req.body.RegistrertDato;
    }
    if (req.body.kundeid != null) {
      order.kundeid = req.body.kundeid;
    }
    if (req.body.KundeTelefon != null) {
      order.KundeTelefon = req.body.KundeTelefon;
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Endpoint to delete an order
app.delete('/orders/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order == null) {
      return res.status(404).json({ message: 'Ordre ikke funnet' });
    }

    await order.remove();
    res.json({ message: 'Ordre slettet' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
