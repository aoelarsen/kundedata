const mongoose = require('mongoose');
const Employee = require('./models/Employee'); // Plasser modellen din i en egen fil som du kan importere

const uri = process.env.MONGO_URI;

const connectDB = async () => {
  if (!mongoose.connection.readyState) {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
};

exports.handler = async (event, context) => {
  await connectDB();

  try {
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
