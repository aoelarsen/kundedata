const MongoClient = require('mongodb').MongoClient;

const uri = "mongodb+srv://sp1348:uzETy8kW83sXiHy4@cluster0.wtpcbrd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const dbName = 'rsData';

MongoClient.connect(url, (err, client) => {
    if (err) throw err;

    console.log('Connected successfully to server');
    const db = client.db(dbName);

    // Fetch and display customers
    db.collection('customers').find({}).toArray((err, customers) => {
        if (err) throw err;
        console.log('Customers:', customers);

        // Fetch and display employees
        db.collection('employees').find({}).toArray((err, employees) => {
            if (err) throw err;
            console.log('Employees:', employees);

            // Fetch and display orders
            db.collection('orders').find({}).toArray((err, orders) => {
                if (err) throw err;
                console.log('Orders:', orders);

                client.close();
            });
        });
    });
});
