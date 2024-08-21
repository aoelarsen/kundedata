const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://sp1348:YzUnE37FpObSSsRI@clusterRS.mongodb.net/RSDatabase?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB Atlas');
});

module.exports = mongoose;
