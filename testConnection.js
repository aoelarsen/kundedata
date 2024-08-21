const mongoose = require('mongoose');

const uri = "mongodb+srv://sp1348:uzETy8kW83sXiHy4@cluster0.wtpcbrd.mongodb.net/rsData?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Successfully connected to MongoDB Atlas");
    mongoose.connection.close();
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB Atlas:", error);
  });
