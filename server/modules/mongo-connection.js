var mongoose = require('mongoose');
var connectionString = 'mongodb://localhost:27017/sigma';

var connectToMongoDatabase = function() {
  mongoose.connect(connectionString);

  mongoose.connection.on('connected', function () {
    console.log('Mongoose connected to ', connectionString);
  });

  mongoose.connection.on('error', function (err) {
    console.log('Mongoose failed to connect because error: ', err);
  });
}

module.exports = { connect: connectToMongoDatabase };
