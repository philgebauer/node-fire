var admin = require("firebase-admin");
var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var portDecision = process.env.PORT || 5000;
var connectionString = 'mongodb://localhost:27017/sigma';
var User = require('./models/user');
var Secret = require('./models/secret');

// Static files
app.use(express.static('public'));

app.use(bodyParser.json());

admin.initializeApp({
  credential: admin.credential.cert("./server/firebase-service-account.json"),
  databaseURL: "https://sigma-test-run.firebaseio.com" // replace this line with your URL
});

mongoose.connect(connectionString);

mongoose.connection.on('connected', function () {
  console.log('Mongoose connected to ', connectionString);
});

mongoose.connection.on('error', function (err) {
  console.log('Mongoose failed to connect because error: ', err);
});

// This is the route for your secretData
app.get("/privateData", function(req, res){

  /* This is where the magic happens. We pull the idtoken off of the request,
  verify it against our private_key, and then we return the decodedToken */

  admin.auth().verifyIdToken(req.headers.id_token).then(function(decodedToken) {
    /* Whatever you do in here is protected by your authorization.
    WARNING: So far you are returning secret data to ANYONE who is logged in
    there is still more work to be done if you want to implement roles
    You can use the decodedToken and some logic to do that. */

    // console.log(decodedToken); // Here you can see the information firebase gives you about the user

    /* Starting here, you can do anything depending on your database.
    In this example, different users can have varying clearance levels.
    A user will receive all of the information from the information table that is at or below that level. */
    var userEmail = decodedToken.email;

<<<<<<< HEAD
    // Check the user's level of permision based on their email
    User.findOne({ email: userEmail }, function (err, user) {
      if (err) {
        console.log('Error COMPLETING clearanceLevel query task', err);
        res.sendStatus(500);
      } else {
        // Based on the clearance level of the individual, give them access to different information
        Secret.find({ secrecyLevel: { $lte: user.clearanceLevel } }, function (err, secrets){
          if (err) {
            console.log('Error COMPLETING secrecyLevel query task', err);
            res.sendStatus(500);
          } else {
            // return all of the results where a specific user has permission
            console.log(secrets);
            res.send(secrets);
          }
        });
      }
=======
      // Check the user's level of permision based on their email
      client.query('SELECT clearance_level FROM users WHERE email=$1', [userEmail], function(err, clearanceLevelQueryResult){
        done();
        if(err){
          console.log('Error COMPLETING clearance_level query task', err);
          res.sendStatus(500);
        }else{
          pg.connect(connectionString, function(err, client, done){
            if(clearanceLevelQueryResult.rowCount === 0) {
              // If the user is not in the database, return a forbidden error status
              console.log('No user found with that email. Have you added this person to the database? Email: ', decodedToken.email);
              res.sendStatus(403);
            } else {
              var clearanceLevel = clearanceLevelQueryResult.rows[0].clearance_level;
              // Based on the clearance level of the individual, give them access to different information
              client.query('SELECT * FROM secret_information WHERE secrecy_level<=$1', [clearanceLevel], function(err, results){
                if(err){
                  console.log('Error COMPLETING secret_information query task', error);
                  res.sendStatus(500);
                }else{
                  // return all of the results where a specific user has permission
                  res.send(results.rows);
                }
              });
            }
            done();
          });
        }
      });
>>>>>>> sql-authorization
    });
  })
  .catch(function(error) {
    // If the id_token isn't right, you end up in this callback function
    // Here we are simply returning a string response, but a forbidden error may be better
    res.send("No secret data for you!");
  });

});

app.listen(portDecision, function(){
  console.log("Listening on port: ", portDecision);
});
