const mongoose = require('mongoose');

const mongoConnect = (callback) => {
  mongoose.connect('mongodb+srv://ap:Chaddi%401009@cluster0.8cuuzmg.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'MongoDB connection error:'));
  db.once('open', () => {
    console.log('Connected to MongoDB');
    callback(db);
  });
};

module.exports = { mongoConnect };