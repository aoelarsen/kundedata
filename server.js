const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();


// Bruk Heroku's dynamisk tildelte port, eller 5000 som fallback lokalt
const port = process.env.PORT || 5001;

// Middleware for CORS-konfigurasjon
const corsOptions = {
  origin: ['https://rssport.netlify.app', 'http://localhost:3000', 'http://localhost:3001'], // Legg til localhost:3001 her
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'], // Tillater nødvendige HTTP-metoder
  allowedHeaders: ['Content-Type', 'Authorization'] // Spesifiser tillatte overskrifter
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
  kundeid: Number,
  KundeTelefon: String,
  ordreid: Number, // Definer som Number for riktig inkrementering
  butikkid: Number // Legg til butikkid som Number
});




const Order = mongoose.model('Order', orderSchema);

const serviceSchema = new mongoose.Schema({
  Varemerke: String,
  Produkt: String,
  Størrelse: String,
  Farge: String,
  Beskrivelse: String,
  status: { type: String, default: 'Aktiv' },
  ansatt: String,
  registrertDato: String,
  endretdato: String,
  kundeid: Number,
  KundeTelefon: String,
  serviceid: Number,
  butikkid: Number
});

const Service = mongoose.model('Service', serviceSchema);


app.get('/orders/last-order-id', async (req, res) => {
  try {
    const lastOrder = await Order.findOne().sort('-ordreid');
    const lastOrderId = lastOrder ? lastOrder.ordreid : 0; // Return 0 if no orders found
    console.log('Last order ID fetched:', lastOrderId); // Debug log
    res.json({ lastOrderId });
  } catch (err) {
    console.error('Feil ved henting av siste ordreid:', err);
    res.status(500).json({ message: 'Feil ved henting av siste ordreid' });
  }
});

// Endpoint to create a new order
app.post('/orders', async (req, res) => {
  console.log('POST request mottatt på /orders');
  console.log('Request body mottatt:', req.body);
  console.log('Promo: Mottatt POST request for ny ordre:', req.body); // Logg hele bodyen


  try {
    // Finn høyeste eksisterende ordreid og øk med 1
    const lastOrder = await Order.findOne().sort('-ordreid');
    const nextOrderId = lastOrder ? lastOrder.ordreid + 1 : 1;

    const orderData = {
      Varemerke: req.body.Varemerke,
      Produkt: req.body.Produkt,
      Størrelse: req.body.Størrelse,
      Farge: req.body.Farge,
      Status: req.body.Status || 'Aktiv',
      Kommentar: req.body.Kommentar,
      Ansatt: req.body.Ansatt,
      Endretdato: req.body.Endretdato,
      RegistrertDato: req.body.RegistrertDato || new Date().toLocaleString('no-NO', { timeZone: 'Europe/Oslo' }),
      kundeid: req.body.kundeid,
      KundeTelefon: req.body.KundeTelefon,
      ordreid: Number(nextOrderId), // Bruker inkrementert ordreid
      butikkid: req.body.butikkid // Legg til butikkid her

    };

    console.log('Fjert: Order data før lagring:', orderData);

    const order = new Order(orderData);
    const newOrder = await order.save();

    console.log('Ny ordre lagret:', newOrder);
    res.status(201).json(newOrder);
  } catch (err) {
    console.error('Feil ved lagring av ordre:', err);
    res.status(400).json({ message: err.message });
  }
});








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
  const { kundeid } = req.query;
  try {
    let orders;
    if (kundeid) {
      orders = await Order.find({ kundeid }); // Finn ordre med gitt kundeid
    } else {
      orders = await Order.find(); // Hent alle ordrer hvis ingen kundeid er spesifisert
    }
    res.json(orders);
  } catch (err) {
    console.error('Feil ved henting av ordrer:', err);
    res.status(500).json({ message: 'Feil ved henting av ordrer' });
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

// Endpoint to get the last order ID
app.get('/orders/last-order-id', async (req, res) => {
  try {
    const lastOrder = await Order.findOne().sort('-ordreid');
    const lastOrderId = lastOrder ? lastOrder.ordreid : 0; // Returner 0 hvis ingen ordre finnes
    res.json({ lastOrderId });
  } catch (err) {
    console.error('Feil ved henting av siste ordreid:', err);
    res.status(500).json({ message: 'Feil ved henting av siste ordreid' });
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
    ordreid: req.body.ordreid,
    butikkid: req.body.butikkid // Inkluder butikkid
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

// Schema and Model for SMS Templates (smsmaler)
const smsTemplateSchema = new mongoose.Schema({
  tittel: { type: String, required: true },
  type: { type: String, required: true },
  tekst: { type: String, required: true },
  status: { type: String, default: 'aktiv' } // Status kan være aktiv eller inaktiv
});

const SmsTemplate = mongoose.model('SmsTemplate', smsTemplateSchema);

// Endpoint to get all SMS templates
app.get('/smstemplates', async (req, res) => {
  try {
    const smsTemplates = await SmsTemplate.find(); // Hent alle SMS-maler
    res.json(smsTemplates);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Endpoint to get a single SMS template by ID
app.get('/smstemplates/:id', async (req, res) => {
  try {
    const smsTemplate = await SmsTemplate.findById(req.params.id); // Hent SMS-mal ved ID
    if (smsTemplate == null) {
      return res.status(404).json({ message: 'SMS-mal ikke funnet' });
    }
    res.json(smsTemplate);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});




app.post('/smstemplates', async (req, res) => {
  const smsTemplate = new SmsTemplate({
    tittel: req.body.tittel,
    type: req.body.type,
    tekst: req.body.tekst,
    status: req.body.status || 'aktiv'
  });

  try {
    const newSmsTemplate = await smsTemplate.save();
    res.status(201).json(newSmsTemplate);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.patch('/smstemplates/:id', async (req, res) => {
  try {
    const smsTemplate = await SmsTemplate.findById(req.params.id);
    if (smsTemplate == null) {
      return res.status(404).json({ message: 'SMS-mal ikke funnet' });
    }

    if (req.body.tittel != null) {
      smsTemplate.tittel = req.body.tittel;
    }
    if (req.body.type != null) {
      smsTemplate.type = req.body.type;
    }
    if (req.body.tekst != null) {
      smsTemplate.tekst = req.body.tekst;
    }
    if (req.body.status != null) {
      smsTemplate.status = req.body.status;
    }

    const updatedSmsTemplate = await smsTemplate.save();
    res.json(updatedSmsTemplate);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/smstemplates/:id', async (req, res) => {
  try {
    const smsTemplate = await SmsTemplate.findById(req.params.id);
    if (smsTemplate == null) {
      return res.status(404).json({ message: 'SMS-mal ikke funnet' });
    }

    await smsTemplate.remove();
    res.json({ message: 'SMS-mal slettet' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Definer schema for butikk
const storeSchema = new mongoose.Schema({
  butikkid: { type: Number, required: true },
  butikknavn: { type: String, required: true },
});

// Lag modell for butikk
const Store = mongoose.model('Store', storeSchema);

// Endepunkt for å hente alle butikker
app.get('/stores', async (req, res) => {
  try {
    const stores = await Store.find(); // Hent alle butikker fra databasen
    res.json(stores); // Returner butikkene som JSON
  } catch (err) {
    res.status(500).json({ message: err.message }); // Send en feilmelding hvis noe går galt
  }
});

// Schema and Model for SMS Archive (smsarkiv)
const smsArchiveSchema = new mongoose.Schema({
  telefonnummer: { type: String, required: true },
  meldingstekst: { type: String, required: true },
  kundeNavn: { type: String, default: 'Ukjent' }, // Navn på kunde hvis valgt
  sendtDato: { type: Date, required: true }, // Endret til Date type for å lagre i ISO-format
});

const SmsArchive = mongoose.model('SmsArchive', smsArchiveSchema);

// Endpoint to store SMS in the archive
app.post('/smsarchives', async (req, res) => {
  const { telefonnummer, meldingstekst, kundeNavn } = req.body;

  // Bruker Date-objekt for å lagre nåværende dato i ISO-format
  const sendtDato = new Date(); // Lagres i ISO-format i MongoDB

  const smsEntry = new SmsArchive({
    telefonnummer,
    meldingstekst,
    kundeNavn,
    sendtDato, // ISO-formatet brukes direkte
  });

  try {
    const savedSms = await smsEntry.save();
    res.status(201).json(savedSms);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Endpoint to get all SMS from the archive
app.get('/smsarchives', async (req, res) => {
  try {
    const smsList = await SmsArchive.find();
    res.json(smsList);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Get all services
app.get('/services', async (req, res) => {
  const { kundeid } = req.query;
  try {
    let services;
    if (kundeid) {
      services = await Service.find({ kundeid }); // Finn tjenester med gitt kundeid
    } else {
      services = await Service.find(); // Hent alle tjenester hvis ingen kundeid er spesifisert
    }
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Endpoint to get the last service ID
app.get('/services/last-service-id', async (req, res) => {
  try {
    const lastService = await Service.findOne().sort('-ordreid');
    const lastServiceId = lastService ? lastService.ordreid : 0; // Returner 0 hvis ingen service finnes
    res.json({ lastServiceId });
  } catch (err) {
    console.error('Feil ved henting av siste serviceid:', err);
    res.status(500).json({ message: 'Feil ved henting av siste serviceid' });
  }
});

// Get a single service by ID
app.get('/services/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (service == null) {
      return res.status(404).json({ message: 'Tjeneste ikke funnet' });
    }
    res.json(service);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new service
app.post('/services', async (req, res) => {
  try {
    const lastService = await Service.findOne().sort('-serviceid');
    const nextServiceId = lastService ? lastService.serviceid + 1 : 1;

    const service = new Service({
      Varemerke: req.body.Varemerke,
      Produkt: req.body.Produkt,
      Størrelse: req.body.Størrelse,
      Farge: req.body.Farge,
      Beskrivelse: req.body.Beskrivelse,
      status: req.body.status || 'Aktiv',
      ansatt: req.body.ansatt,
      registrertDato: req.body.registrertDato || new Date().toLocaleString(),
      kundeid: req.body.kundeid,
      KundeTelefon: req.body.KundeTelefon,
      serviceid: nextServiceId,
      butikkid: req.body.butikkid
    });

    const newService = await service.save();
    res.status(201).json(newService);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a service
app.patch('/services/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (service == null) {
      return res.status(404).json({ message: 'Tjeneste ikke funnet' });
    }

    if (req.body.beskrivelse != null) {
      service.beskrivelse = req.body.beskrivelse;
    }
    if (req.body.status != null) {
      service.status = req.body.status;
    }
    if (req.body.ansatt != null) {
      service.ansatt = req.body.ansatt;
    }
    if (req.body.endretdato != null) {
      service.endretdato = req.body.endretdato;
    }

    const updatedService = await service.save();
    res.json(updatedService);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a service
app.delete('/services/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (service == null) {
      return res.status(404).json({ message: 'Tjeneste ikke funnet' });
    }

    await service.remove();
    res.json({ message: 'Tjeneste slettet' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Schema and Model for Status
const statusSchema = new mongoose.Schema({
  navn: { type: String, required: true },
  beskrivelse: String, // Valgfritt felt for beskrivelse
  opprettetDato: { type: Date, default: Date.now }
});

const Status = mongoose.model('Status', statusSchema);

// Endpoint to get all statuses
app.get('/statuses', async (req, res) => {
  try {
    const statuses = await Status.find();
    res.json(statuses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Endpoint to get a single status by ID
app.get('/statuses/:id', async (req, res) => {
  try {
    const status = await Status.findById(req.params.id);
    if (status == null) {
      return res.status(404).json({ message: 'Status ikke funnet' });
    }
    res.json(status);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Endpoint to create a new status
app.post('/statuses', async (req, res) => {
  const status = new Status({
    navn: req.body.navn,
    beskrivelse: req.body.beskrivelse
  });

  try {
    const newStatus = await status.save();
    res.status(201).json(newStatus);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Endpoint to update a status
app.patch('/statuses/:id', async (req, res) => {
  try {
    const status = await Status.findById(req.params.id);
    if (status == null) {
      return res.status(404).json({ message: 'Status ikke funnet' });
    }

    if (req.body.navn != null) {
      status.navn = req.body.navn;
    }
    if (req.body.beskrivelse != null) {
      status.beskrivelse = req.body.beskrivelse;
    }

    const updatedStatus = await status.save();
    res.json(updatedStatus);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Endpoint to delete a status
app.delete('/statuses/:id', async (req, res) => {
  try {
    const status = await Status.findById(req.params.id);
    if (status == null) {
      return res.status(404).json({ message: 'Status ikke funnet' });
    }

    await status.remove();
    res.json({ message: 'Status slettet' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Modell for daglige oppgaver
const dailyTaskSchema = new mongoose.Schema({
  task: { type: String, required: true },
  completed: { type: Boolean, default: false },
  completedBy: { type: String }, // Sørg for at dette kan ta imot strenger
  dateCompleted: { type: Date }, // Sørg for at dette kan ta imot datoverdier
});

const DailyTask = mongoose.model('DailyTask', dailyTaskSchema);


// Modell for egendefinerte oppgaver
const customTaskSchema = new mongoose.Schema({
  task: { type: String, required: true }, // Beskrivelse av oppgaven
  dueDate: { type: Date, required: true }, // Når oppgaven skal være ferdig
  completed: { type: Boolean, default: false }, // Om oppgaven er fullført eller ikke
  dateCompleted: { type: Date }, // Datoen når oppgaven ble fullført
  completedBy: { type: String }, // Ansatt som fullførte oppgaven
});

const CustomTask = mongoose.model('CustomTask', customTaskSchema);



// Hent alle daglige oppgaver
app.get('/dailytasks', async (req, res) => {
  try {
    const tasks = await DailyTask.find();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Feil ved henting av daglige oppgaver', error });
  }
});

// Legg til en ny daglig oppgave
app.post('/dailytasks', async (req, res) => {
  const { task } = req.body;

  if (!task) {
    return res.status(400).json({ message: 'Oppgaven er påkrevd' });
  }

  try {
    const newTask = new DailyTask({ task });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: 'Feil ved opprettelse av daglig oppgave', error });
  }
});

// Hent alle egendefinerte oppgaver
app.get('/customtasks', async (req, res) => {
  try {
    const tasks = await CustomTask.find();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Feil ved henting av egendefinerte oppgaver', error });
  }
});

// Legg til en ny egendefinert oppgave
app.post('/customtasks', async (req, res) => {
  const { task, dueDate } = req.body;

  if (!task || !dueDate) {
    return res.status(400).json({ message: 'Oppgaven og datoen er påkrevd' });
  }

  try {
    const newTask = new CustomTask({ task, dueDate });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: 'Feil ved opprettelse av egendefinert oppgave', error });
  }
});

const fetchDailyTasks = async () => {
  try {
    const response = await fetch('https://kundesamhandling-acdc6a9165f8.herokuapp.com/dailytasks');
    const data = await response.json();
    setDailyTasks(data);
  } catch (error) {
    console.error('Feil ved henting av faste oppgaver:', error);
  }
};

const fetchCustomTasks = async () => {
  try {
    const response = await fetch('https://kundesamhandling-acdc6a9165f8.herokuapp.com/customtasks');
    const data = await response.json();
    setCustomTasks(data);
  } catch (error) {
    console.error('Feil ved henting av oppgaver:', error);
  }
};

// Modell for fullførte oppgaver
const completedTaskSchema = new mongoose.Schema({
  taskId: { type: mongoose.Schema.Types.ObjectId }, // Fjern required hvis det ikke er nødvendig
  task: { type: String, required: true },
  taskType: { type: String, required: true }, // daily eller custom
  dueDate: { type: Date }, // Valgfritt for custom tasks
  employee: { type: String, required: true },
  dateCompleted: { type: Date, required: true },
  store: { type: String, required: true } // Butikk-ID
});


const CompletedTask = mongoose.model('CompletedTask', completedTaskSchema);

// Legg til en fullført oppgave
app.post('/completedtasks', async (req, res) => {
  console.log('Mottatt request body:', req.body); // Log request body for inspeksjon

  const { task, taskType, dueDate, dateCompleted, employee, store } = req.body;

  if (!task || !dateCompleted || !employee || !taskType || !store) {
    console.error('Feil: Manglende felt i request body');
    return res.status(400).json({ message: 'Alle felt er påkrevd' });
  }

  try {
    const completedTask = new CompletedTask({
      task,
      taskType,
      dueDate,
      dateCompleted,
      employee,
      store // Legg til butikk-ID her
    });
    await completedTask.save();
    console.log('Fullført oppgave lagret:', completedTask); // Bekreft at oppgaven er lagret
    res.status(201).json(completedTask);
  } catch (error) {
    console.error('Feil ved registrering av fullført oppgave:', error); // Log feilen
    res.status(500).json({ message: 'Feil ved registrering av fullført oppgave', error });
  }
});



// Hent alle fullførte oppgaver, med mulighet for å filtrere på butikk, ansatt eller dato
app.get('/completedtasks', async (req, res) => {
  const { store, employee, fromDate, toDate } = req.query;

  const filter = {};

  // Filtrer på butikk-ID hvis den er angitt
  if (store) {
    filter.store = store;
  }

  // Filtrer på ansatt hvis den er angitt
  if (employee) {
    filter.employee = employee;
  }

  // Filtrer på dato for fullføring (mellom fromDate og toDate hvis de er angitt)
  if (fromDate && toDate) {
    filter.dateCompleted = { $gte: new Date(fromDate), $lte: new Date(toDate) };
  } else if (fromDate) {
    filter.dateCompleted = { $gte: new Date(fromDate) };
  } else if (toDate) {
    filter.dateCompleted = { $lte: new Date(toDate) };
  }

  try {
    const completedTasks = await CompletedTask.find(filter);
    res.status(200).json(completedTasks);
  } catch (error) {
    console.error('Feil ved henting av fullførte oppgaver:', error);
    res.status(500).json({ message: 'Feil ved henting av fullførte oppgaver', error });
  }
});

// Oppdater en daglig oppgave
app.patch('/dailytasks/:id', async (req, res) => {
  try {
    const task = await DailyTask.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Daglig oppgave ikke funnet' });
    }

    if (req.body.completed != null) {
      task.completed = req.body.completed;
    }

    if (req.body.completedBy != null) {
      task.completedBy = req.body.completedBy; // Sørg for at dette feltet er satt korrekt
    }

    if (req.body.dateCompleted != null) {
      task.dateCompleted = req.body.dateCompleted; // Sørg for at datoen blir satt korrekt
    }

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: 'Feil ved oppdatering av daglig oppgave', error });
  }
});


// Oppdater en egendefinert oppgave
app.patch('/customtasks/:id', async (req, res) => {
  console.log('Mottok PATCH-forespørsel for customtask:', req.params.id, req.body);
  try {
    const task = await CustomTask.findById(req.params.id);
    if (!task) {
      console.log('Custom task ikke funnet:', req.params.id);
      return res.status(404).json({ message: 'Egendefinert oppgave ikke funnet' });
    }

    if (req.body.completed != null) {
      task.completed = req.body.completed;
    }

    if (req.body.completedBy != null) {
      task.completedBy = req.body.completedBy;
    }

    if (req.body.dateCompleted != null) {
      task.dateCompleted = req.body.dateCompleted;
    }

    const updatedTask = await task.save();
    console.log('Custom task oppdatert:', updatedTask);
    res.json(updatedTask);
  } catch (error) {
    console.error('Feil ved oppdatering av egendefinert oppgave:', error);
    res.status(400).json({ message: 'Feil ved oppdatering av egendefinert oppgave' });
  }
});




const cron = require('node-cron');

// Kjører hver dag ved midnatt
cron.schedule('0 0 * * *', async () => {
  try {
    console.log('Sjekker etter oppgaver som er fullført');

    // Hent alle oppgaver som er markert som fullført
    const tasksToDelete = await CustomTask.find({
      completed: true
    });

    console.log('Oppgaver som skal slettes:', tasksToDelete);

    // Slett alle oppgaver som er fullført
    const deleteResult = await CustomTask.deleteMany({
      completed: true
    });

    console.log('Antall slettede oppgaver:', deleteResult.deletedCount);
  } catch (error) {
    console.error('Feil ved sletting av fullførte oppgaver:', error);
  }
});



// Kjører hvert minutt for testing (du kan endre til hver dag ved midnatt for produksjon)
cron.schedule('0 0 * * *', async () => {
  try {
    console.log('Tilbakestiller fullførte daglige oppgaver');

    // Hent alle oppgaver som er markert som fullført
    const tasksToReset = await DailyTask.find({ completed: true });

    console.log('Oppgaver som skal tilbakestilles:', tasksToReset);

    // Tilbakestill fullførte oppgaver
    const resetResult = await DailyTask.updateMany(
      { completed: true },
      { $set: { completed: false, completedBy: null, dateCompleted: null } }
    );

    console.log('Antall tilbakestilte oppgaver:', resetResult.modifiedCount);
  } catch (error) {
    console.error('Feil ved tilbakestilling av daglige oppgaver:', error);
  }
});








// Start the server
app.listen(port, () => {
  console.log(Server is running on port ${port});
});