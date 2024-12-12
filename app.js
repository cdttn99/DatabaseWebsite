// Citation for the following page and functions:
// Date: 11/28/2024
// All code is adapted from CS 340 starter code. Some of the code is original but it is throughout the adapated code.
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app


var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
// app.js - SETUP section

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))

PORT        = 51436;                 // Set a port number at the top so it's easy to change in the future
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.


// Databse
var db = require('./database/db-connector')



/* ROUTES */
// app.js

// route to home page
app.get('/', function (req, res)
    {
        res.render('index');
});

//route to people page
app.get('/people', (req, res) => {
    let query1 = `SELECT peopleID, CONCAT(firstName, ' ', lastName) AS fullname, 
                  address1, address2, city, state, zipcode, phoneNumber 
                  FROM Peoples;`;

    db.pool.query(query1, (error, rows, fields) => {
        if (error) {
            console.error("Database query error:", error);
            res.status(500).send("Internal Server Error");
        } else {
            res.render('people', { data: rows });
        }
    });
});


// route to delete person on people page                                
app.delete('/delete-person-ajax/', function (req, res, next) {
    let data = req.body;
    let personID = parseInt(data.id);

    // find if ID is valid
    if (isNaN(personID)) {
        console.log("Invalid personID provided:");
        return res.sendStatus(400); // Bad Request
    }

    let deletePerson = `DELETE FROM Peoples WHERE peopleID = ?`;

    // Execute the query
    db.pool.query(deletePerson, [personID], function (error, rows, fields) {
        if (error) {
            if (error.errno == 1451) {
                return res.sendStatus(409)
            } else {
            console.error("Error occurred while deleting person:", error);
            return res.sendStatus(400); // Bad Request
        }
    }
        // Send a No Content status indicating successful deletion
        res.sendStatus(204);
    });
});

// route to get person
app.get('/get-person/:id', (req, res) => {
    const peopleID = req.params.id; // Get ID from request
    const query = `
        SELECT firstName, lastName, address1, address2, city, zipcode, state, phoneNumber
        FROM Peoples
        WHERE peopleID = ?`;
    
    db.pool.query(query, [peopleID], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error retrieving data');
        } else {
            res.json(results[0]); 
        }
    });
});

// route to update person
app.put('/put-person-ajax', function(req,res,next){
    let data = req.body;
  
    // gets new data
    let peopleID_from_the_update_form = parseInt(data.peopleID_from_the_update_form);
    let firstNameInput = data.firstNameInput; 
    let lastNameInput = data.lastNameInput;   
    let address1Input = data.address1Input;   
    let address2Input = data.address2Input;   
    let cityInput = data.cityInput;           
    let zipCodeInput = parseInt(data.zipCodeInput); 
    let stateInput = data.stateInput;         
    let phoneNumber = data.phoneNumber; 
  
    let query1 = 'UPDATE Peoples SET firstName = ?, lastName = ?, address1 = ?, address2 = ?, city = ?, zipcode = ?, state = ?, phoneNumber = ? WHERE peopleID = ?'
    let query2 = `SELECT * FROM Peoples WHERE peopleID = ?`
  
          // Run the 1st query
          db.pool.query(query1, [firstNameInput, lastNameInput, address1Input, address2Input, cityInput, zipCodeInput, stateInput, phoneNumber, peopleID_from_the_update_form], function(error, rows, fields){
              if (error) {
  
              // Log the error 
              console.log(error);
              res.sendStatus(400);
              }
  
              else
                {
                  // Run the second query
                  db.pool.query(query2, [peopleID_from_the_update_form], function(error, rows, fields) {
  
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.send(rows);
                      }
                  })
              }
  })});

// route to add person
app.post('/add-person-form', function(req, res){
    console.log(req.body); // log body info
    let data = req.body;

    // Capture NULL values
    let address1 = data['address1'] ? `'${data['address1']}'` : 'NULL';
    let address2 = data['address2'] ? `'${data['address2']}'` : 'NULL';

    // Create the query and run it on the database
    query1 =  `INSERT INTO Peoples (firstName, lastName, address1, address2, city, zipcode, state, phoneNumber) VALUES ('${data['fName']}', '${data['lName']}', ${address1}, ${address2}, '${data['city']}','${data['zip']}' ,'${data['states']}', '${data['phone']}')`;
    db.pool.query(query1, function(error, rows, fields){
        if (error) {
        // Check to see if there was an error with CASCADE
            if (error.errno === 1062) {

            // send back alert
                console.log(error)
                return res.send(` 
                    <script>
                        alert("Phone number already in database.");
                        window.location.href ="/people";
                    </script>
                    `);
            } else {
                console.error("Datbase error", error)
                res.status(500)
        }
    }
    res.redirect('/people'); 
    })
    
});

// route to get venue information
app.get('/venues', (req, res) => {
    let query2 = `SELECT venueID, name, address1, address2, city, zipcode, state
            FROM Venues;`;

    db.pool.query(query2, (error, rows, fields) => {
        if (error) {
            console.error("Database query error:", error);
            res.status(500).send("Internal Server Error");
        } else {
            res.render('venues', { data: rows });
        }
    });
});

// route to get event information
app.get('/events', (req, res) => {
    let query3 = `SELECT Events.eventID, Events.name , Venues.name AS venue, DATE_FORMAT(Events.date, '%Y-%m-%d') AS fDate, SUM(Donations.amount) AS totalRaised
                    FROM Events
                    LEFT JOIN 
                        Venues ON Events.venueID = Venues.venueID
                    LEFT JOIN
                        Donations ON Events.eventID = Donations.eventID
                    GROUP BY
                    Events.eventID`;
    // Query to have venue name instead of ID
    let query = `SELECT venueID, name FROM Venues`;
    
    db.pool.query(query3, (eventError, eventRows, eventFields) => {
        if (eventError) {
            console.error("Database query error:", error);
            res.status(500).send("Internal Server Error");
            return;
        }
    db.pool.query(query, (venueError, venueRows, venueFields) => {
        if (venueError) {
            console.error("Database query error:", error);
            res.status(500).send("Internal Server Error");
            return;
        }

        res.render('events',{events: eventRows, venues: venueRows}) 
        
     });
    });
});

// route to get event information for edit field
app.get('/get-event/:id', (req, res) => {
    const eventID = req.params.id; // Get ID from request
    console.log(eventID)
    const query = `
        SELECT Events.eventID, Events.name, Venues.venueID AS venue, Events.date
    FROM Events
    LEFT JOIN 
        Venues ON Events.venueID = Venues.venueID
    WHERE Events.eventID = ?`;
    

    db.pool.query(query, [eventID], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error retrieving data');
        } else {
            res.json(results[0]); 
        }
    });
});

// route to update event
app.put('/put-event-ajax', function(req,res,next){
    let data = req.body;
  
    // gets new data
    let eventID_from_the_update_form = parseInt(data.eventID_from_the_update_form);
    let EventNameInput = data.EventNameInput; 
    let VenueIDInput = data.VenueIDInput === "" ? null : parseInt(data.VenueIDInput);
    let eventDateInput = data.eventDateInput;   
    
  
    let query1 = `UPDATE Events SET name  = ?, venueID = ?, date = ? WHERE eventID = ?`
    let query2 = `SELECT * FROM Events WHERE eventID = ?`
  
          // Run the 1st query
          db.pool.query(query1, [EventNameInput, VenueIDInput, eventDateInput, eventID_from_the_update_form], function(error, rows, fields){
              if (error) {
  
              // Log the error 
              console.log(error);
              res.sendStatus(400);
              }
  
              else
                {
                  // Run the second query
                  db.pool.query(query2, [eventID_from_the_update_form], function(error, rows, fields) {
  
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.send(rows);
                      }
                  })
              }
  })});

// route to get donation information
app.get('/donations', (req, res) => {
    let query4 = `SELECT Donations.donationID, CONCAT(Peoples.firstName, ' ', Peoples.lastName) AS donor, Events.name AS eventName, Donations.amount
                    FROM Donations
                    LEFT JOIN
                        Peoples ON Donations.peopleID = Peoples.peopleID
                    LEFT JOIN
                        Events ON Donations.eventID = Events.eventID`;
    // Query to have name instead of peopleid
    let donorQuery = `SELECT peopleID, CONCAT(firstName, ' ', lastName) AS fullName
                        From Peoples`;
    // Query to have event name instead of eventid
    let eventQuery = `SELECT eventID, name FROM Events`;

    db.pool.query(query4, (donationError, donationRows, donationFields) => {
        if (donationError) {
            console.error("Database query error:", donationError);
            res.status(500).send("Internal Server Error");
            return;
        } 
    db.pool.query(donorQuery, (donorError, donorRows, donorFields) => {
        if (donorError) {
            console.error("Database query error:", donorError);
            res.status(500).send("Internal Server Error");
            return;
        }
    db.pool.query(eventQuery, (eventError, eventRows, eventFields) => {
        if (eventError) {
            console.error("Database query error:", eventError);
            res.status(500).send("Internal Server Error");
            return;
        }
        // no error
        res.render('donations',{data: donationRows, donor: donorRows, event: eventRows}) 
        
    });
    });
});
});

// route to get volunteer assignment information
app.get('/assignments', (req, res) => {
    let query4 = `SELECT VolunteerAssignments.volunteerAssignmentID, CONCAT(Peoples.firstName, ' ', Peoples.lastName) AS volunteer, Events.name AS eventName, VolunteerAssignments.hoursGiven
                    FROM VolunteerAssignments
                    LEFT JOIN 
                        Peoples ON VolunteerAssignments.peopleID = Peoples.peopleID
                    LEFT JOIN
                        Events on VolunteerAssignments.eventID = Events.eventID`;
    
    // query to have people name instead of peopleid
    let volunteerQuery = `SELECT peopleID, CONCAT(firstName, ' ', lastName) AS fullName
                        From Peoples`;
    // query to have event name instead of eventid
    let eventQuery = `SELECT eventID, name FROM Events`;  
    
    db.pool.query(query4, (assignError, assignRows, assignFields) => {
        if (assignError) {
            console.error("Database query error:", assignError);
            res.status(500).send("Internal Server Error");
            return;
        } 
    db.pool.query(volunteerQuery, (volunteerError, volunteerRows, volunteerFields) => {
        if (volunteerError) {
            console.error("Database query error:", volunteerError);
            res.status(500).send("Internal Server Error");
            return;
        }
    db.pool.query(eventQuery, (eventError, eventRows, eventFields) => {
        if (eventError) {
            console.error("Database query error:", eventError);
            res.status(500).send("Internal Server Error");
            return;
        }
        // no error
        res.render('assignment', { data: assignRows, volunteer: volunteerRows, event: eventRows});
        });
    });
});
});

app.put('/put-assignment-ajax', function(req,res,next){
    let data = req.body;
    console.log(data)
  
    // gets new data
    let assignmentID_from_the_update_form = parseInt(data.assignmentID_from_the_update_form);
    let volunteerNameInput = parseInt(data.volunteerNameInput); 
    let eventNameInput = parseInt(data.eventNameInput);   
    let hoursInput = parseInt(data.hoursInput);   
    
  
    let query1 = `UPDATE VolunteerAssignments
    SET peopleID = ?, eventID = ?, hoursGiven = ? 
    WHERE volunteerAssignmentID = ?`
    let query2 = `SELECT * FROM VolunteerAssignments WHERE volunteerAssignmentID = ?`
  
          // Run the 1st query
          db.pool.query(query1, [volunteerNameInput, eventNameInput, hoursInput, assignmentID_from_the_update_form], function(error, rows, fields){
              if (error) {
  
              // Log the error 
              console.log(error);
              res.sendStatus(400);
              }
  
              else
                {
                  // Run the second query
                  db.pool.query(query2, [assignmentID_from_the_update_form], function(error, rows, fields) {
  
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.send(rows);
                      }
                  })
              }
  })});


  app.get('/get-volunteerAssignment/:id', (req, res) => {
    const volunteerAssignmentID = req.params.id; // Get ID from request
    const query = `
        SELECT VolunteerAssignments.volunteerAssignmentID, Peoples.peopleID as volunteer, Events.eventID AS eventName, VolunteerAssignments.hoursGiven
    FROM VolunteerAssignments
    LEFT JOIN 
        Peoples ON VolunteerAssignments.peopleID = Peoples.peopleID
    LEFT JOIN
        Events on VolunteerAssignments.eventID = Events.eventID
    WHERE VolunteerAssignments.volunteerAssignmentID = ?`;
    
    db.pool.query(query, [volunteerAssignmentID], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error retrieving data');
        } else {
            res.json(results[0]); 
        }
    });
});

// route to add venue
app.post('/add-venue-form', function(req, res){
    let data = req.body;

    // Capture NULL values
    let address1 = data['address1'] ? `'${data['address1']}'` : 'NULL';
    let address2 = data['address2'] ? `'${data['address2']}'` : 'NULL';

    // Create the query and run it on the database
    query2 =  `INSERT INTO Venues (name, address1, address2, city, zipcode, state)
    VALUES ('${data['name']}', '${address1}', '${address2}', '${data['city']}', '${data['zip']}', '${data['states']}')`
    
    db.pool.query(query2, function(error, rows, fields){
        if (error) {
        // Check to see if there was an CASCADE error
            if (error.errno === 1062) {
                console.log(error)
                // send back an alert
                return res.send(` 
                    <script>
                        alert("Venue name already in database.");
                        window.location.href ="/venues";
                    </script>
                    `);
                } else {
                    console.error(error)
                    res.status(500)
                }
            }
            // no error
            res.redirect('/venues');
        })
    });

// Route to add event
app.post('/add-event-form', function(req, res){
    let data = req.body;

    // Capture NULL values
    let venue = data['venue'] ? `'${data['venue']}'` : 'NULL';

    // Create the query and run it on the database
    query3 =  `INSERT INTO Events (name, venueID, date)
    VALUES ('${data['eventName']}',${venue},'${data['date']}')`
    db.pool.query(query3, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error
            console.log(error)
            res.sendStatus(400);
        }

        else
        {
            // no error
            res.redirect('/events');
        }
    })
});

// route to add donations
app.post('/add-donations-form', function(req, res){
    let data = req.body;


    // Create the query and run it on the database
    query3 = `INSERT INTO Donations (peopleID, eventID, amount)
    VALUES ('${data['donor']}','${data['event']}','${data['money']}')`;

    db.pool.query(query3, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error
            console.log(error)
            res.sendStatus(400);
        }

        else
        {
            // no error
            res.redirect('/donations');
        }
    })
});

// Route to add volunteer assignment
app.post('/add-assignment-form', function(req, res){
    let data = req.body;


    // Create the query and run it on the database
    query3 = `INSERT INTO VolunteerAssignments (peopleID, eventID, hoursGiven)
    VALUES ('${data['volunteer']}', '${data['event']}', '${data['hours']}')`;

    db.pool.query(query3, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error 
            console.log(error)
            res.sendStatus(400);
        }

        else
        {
            // no error
            res.redirect('assignments');
        }
    })
});

// Route to delete volunteer assignment
app.delete('/delete-assignment-ajax/', function (req, res, next) {
    let data = req.body;
    let assignmentID = parseInt(data.id);

    
    // Make sure assignmentID isn't null
    if (isNaN(assignmentID)) {
        console.log("Invalid personID provided:");
        return res.sendStatus(400);
    }

    let deleteAssignment = `DELETE FROM VolunteerAssignments WHERE volunteerAssignmentID = ?`;

    // Execute the query
    db.pool.query(deleteAssignment, [assignmentID], function (error, rows, fields) {
        if (error) {
            console.error("Error occurred while deleting person:", error);
            return res.sendStatus(400); // Bad Request
        }

        // Send a No Content status indicating successful deletion
        res.sendStatus(204);
    });
});

/* LISTENER */
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});