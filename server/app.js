var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var decoder = require('./modules/decoder');
var pg = require('pg');
var portDecision = process.env.PORT || 5000;
var connectionString = 'postgres://localhost:5432/sigma';

app.use(express.static('public'));
app.use(bodyParser.json());

// Decodes the token in the request header and attaches the decoded token to req.decodedToken on the request.
app.use(decoder.token);

/* Whatever you do below is protected by your authentication.
WARNING: So far you are returning secret data to ANYONE who is logged in.
There is still more work to be done if you want to implement roles.
No authorization has been completed yet in this branch.
You can use req.decodedToken and some logic to do that.
Other branches in the nodeFire repository show how to do that. */

// This is the route for your secretData. The request gets here after it has been authenticated.
app.get("/privateData", function(req, res){
  pg.connect(connectionString, function(err, client, done){
    var userEmail = req.decodedToken.email;

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
            console.log('No user found with that email. Have you added this person to the database? Email: ', req.decodedToken.email);
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
  });
});

app.listen(portDecision, function(){
  console.log("Listening on port: ", portDecision);
});
