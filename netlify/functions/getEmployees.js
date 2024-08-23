const mongoose = require('mongoose');
const Employee = require('./models/Employee');

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  console.log("MONGO_URI:", uri); // Logg for å bekrefte at MONGO_URI blir lastet riktig

  if (!uri) {
    throw new Error("MONGO_URI is not defined. Please check your environment variables.");
  }

  if (!mongoose.connection.readyState) {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
};

exports.handler = async (event, context) => {
  try {
    await connectDB();

    const employees = await Employee.find();
    return {
      statusCode: 200,
      body: JSON.stringify(employees),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    };
  }
};
