-- People Page, lists all the people in the database
SELECT peopleID, CONCAT(firstName,' ', lastName) AS fullname, address1, address2, city, zipcode, state, phoneNumber
FROM Peoples;

-- People Page, adds a new person
INSERT INTO Peoples (firstName, lastName, address1, address2, city, zipcode, state, phoneNumber)
    VALUES (:firstNameInput, :lastNameInput, :address1Input, :address2Input, :cityInput, :zipcodeInput, :stateInput, :phoneNumberInput);

-- People Page, deletes a person
DELETE FROM Peoples WHERE peopleID = :peopleID_selected_from_manage_people_page;

-- People page, used to pre-populate the entry on the edit page
SELECT firstName, lastName, address1, address2, city, zipcode, state, phoneNumber
    FROM Peoples
    WHERE peopleID = :peopleID_selected_from_manage_people_page

-- People page, used to edit page
UPDATE Peoples
    SET firstName = :firstNameInput, lastName = :lastNameInput, address1 = :address1Input, address2 = :address2Input, -- didn't had peopleid to ensure no changes
        city = :cityInput, zipcode = :zipcodeInput, state = :stateInput, phoneNumber = :phoneNumber
    WHERE peopleID = :peopleID_from_the_update_form

-- Venue Page, lists all the venues in the database
SELECT venueID, name, address1, address2, city, zipcode, state
FROM Venues;

-- Venue Page, adds a venue
INSERT INTO Venues (name, address1, address2, city, zipcode, state)
    VALUES (:nameInput, :address1Input, :address2Input, :cityInput, :zipcodeInput, :stateInput)

-- Events Page, lists all events with total donations
SELECT Events.eventID, Events.name , Venues.name AS venue, Events.date , SUM(Donations.amount) AS totalRaised
    FROM Events
    LEFT JOIN 
        Venues ON Events.venueID = Venues.venueID
    LEFT JOIN
        Donations ON Events.eventID = Donations.eventID
    GROUP BY
    Events.eventID;

-- SQL to fetch venue name and IDs
SELECT venueID, name FROM Venues;

-- Events page, used to pre-populate the entry on the edit page
SELECT Events.name AS eventName, Venues.name AS venue, Events.date
    FROM Events
    LEFT JOIN 
        Venues ON Events.venueID = Venues.venueID
    WHERE Events.eventID = :eventID_selected_from_manage_events_page
    
-- Events page, used to insert an Event
INSERT INTO Events (name, venueID, date)
    VALUES (:nameInput, :venueIDInput, :dateInput); -- drop down with venues

-- Events page, used to edit page
UPDATE Events
    SET name  = :nameInput, venueID = :venueIDInput, date = :dateInput -- drop down venues
    WHERE eventID = :eventID_from_the_update_form;

-- SQL to fetch name of People and names of Events
SELECT peopleID, CONCAT(firstName, ' ', lastName) AS fullName
From Peoples;

SELECT eventID, name FROM Events;

-- Donations Page, lists all donations 
SELECT Donations.donationID, CONCAT(Peoples.firstName, ' ', Peoples.lastName) AS donor, Events.name AS eventName, Donations.amount
    FROM Donations
    LEFT JOIN
        Peoples ON Donations.peopleID = Peoples.peopleID
    LEFT JOIN
        Events ON Donations.eventID = Events.eventID;

-- Donations Page, adds new donation
INSERT INTO Donations (peopleID, eventID, amount)
    VALUES (:peopleIDInput, :eventIDInput, :amountInput); -- drop down with people and events

-- Volunteer Assignments Page, lists all volunteer assignments
SELECT VolunteerAssignments.volunteerAssignmentID, CONCAT(Peoples.firstName, ' ', Peoples.lastName) AS volunteer, Events.name AS eventName, VolunteerAssignments.hoursGiven
    FROM VolunteerAssignments
    LEFT JOIN 
        Peoples ON VolunteerAssignments.peopleID = Peoples.peopleID
    LEFT JOIN
        Events on VolunteerAssignments.eventID = Events.eventID

-- Volunteer Assignments Page, adds a new volunteer assignment
INSERT INTO VolunteerAssignments (peopleID, eventID, hoursGiven)
    VALUES (:peopleIDInput, :eventIDInput, :hoursGivenInput); -- drop down with people and events

-- Volunteer Assignments Page, deletes a volunteer assignment
DELETE FROM VolunteerAssignments WHERE volunteerAssignmentID = :volunteerAssignmentID_selected_from_manage_volunteer_assignments_page;

-- Volunteer Assignments Page, edits a volunteer assignment
UPDATE VolunteerAssignments
    SET peopleID = :peopleIDInput, eventID = :eventIDInput, hoursGiven = :hoursGivenInput -- drop down people and events
    WHERE eventID = :eventID_from_the_update_form
    AND peopleID = :peopleID_from_the_update_form
