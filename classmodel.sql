-- Made By: Christopher Dutton
SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;

-- Drop exisiting tables to prevent conflicts
DROP TABLE IF EXISTS Peoples;
DROP TABLE IF EXISTS Venues;
DROP TABLE IF EXISTS Events;
DROP TABLE IF EXISTS Donations;
DROP TABLE IF EXISTS VolunteerAssignments;

-- Create Peoples table to store information about individuals
CREATE TABLE Peoples (
    peopleID INT NOT NULL AUTO_INCREMENT, -- unique identifier for each person
    firstName VARCHAR(45) NOT NULL,
    lastName VARCHAR(45) NOT NULL,
    address1 VARCHAR(145) NULL, -- address not required
    address2 VARCHAR(145) NULL, 
    city VARCHAR(45) NOT NULL,
    zipcode VARCHAR(5) NOT NULL,
    state VARCHAR(2) NOT NULL,  -- state abbreviation
    phoneNumber VARCHAR(10) NOT NULL, 
    PRIMARY KEY (peopleID), 
    UNIQUE (phoneNumber) -- unique to ensure no duplicated people
);

-- Create Venues table to store information about the venues
CREATE TABLE Venues (
    venueID INT NOT NULL AUTO_INCREMENT, -- unique identifier
    name varchar(145) NOT NULL,
    address1 varchar(145) NULL,
    address2 varchar(145) NULL,
    city varchar(45) NOT NULL,
    zipcode varchar(5) NOT NULL, 
    state varchar(2) NOT NULL, -- state abbreviation
    PRIMARY KEY (venueID),
    UNIQUE (name) -- used to ensure no duplicated venues
);

-- Create Events table to store information about the events
CREATE TABLE Events (
    eventID INT NOT NULL AUTO_INCREMENT, -- unqiue identifier
    name varchar(145) NOT NULL,
    venueID INT NULL,
    date date NOT NULL,
    PRIMARY KEY (eventID),
    CONSTRAINT fk_events_venueID FOREIGN KEY (venueID)
        REFERENCES Venues(venueID)
        ON DELETE SET NULL -- sets venue to NULL if venue is deleted
);
-- Create Donations table to record donations made by individuals
CREATE TABLE Donations (
    donationID INT NOT NULL AUTO_INCREMENT, -- unqiue identifier
    peopleID INT NOT NULL,
    eventID INT NOT NULL,
    amount INT NOT NULL,
    PRIMARY KEY (donationID),
    CONSTRAINT fk_donations_peopleID FOREIGN KEY (peopleID)
        REFERENCES Peoples(peopleID)
        ON DELETE CASCADE, -- deletes donations if the person attached is deleted
    CONSTRAINT fk_donations_eventID FOREIGN KEY (eventID)
        REFERENCES Events(eventID)
        ON DELETE CASCADE -- deletes donation if the event attached is deleted
);
-- Create VolunteerAssignment table to track volunteer assignments for events
CREATE TABLE VolunteerAssignments (
    volunteerAssignmentID INT NOT NULL AUTO_INCREMENT, -- unique identifier
    peopleID INT NOT NULL,
    eventID INT NOT NULL,
    hoursGiven INT NOT NULL,
    PRIMARY KEY (volunteerAssignmentID),
    CONSTRAINT fk_assignment_peopleID FOREIGN KEY (peopleID)
        REFERENCES Peoples(peopleID)
        ON DELETE CASCADE, -- deletes assignment if the person attached is deleted
    CONSTRAINT fk_assignment_eventID FOREIGN KEY (eventID)
        REFERENCES Events(eventID)
        ON DELETE CASCADE -- deletes the assignment if the event attached is deleted

);

INSERT INTO Peoples (firstName, lastName, address1, address2, city, zipcode, state, phoneNumber)
VALUES ('Steve', 'Clark', '123 Maple Street', NULL,'Grand Rapids', '49503', 'MI','3124781927'),
('Aziza','Einar','456 Oak Avenue','Apt. 5206','Grand Rapids','49504','MI','6492938471'),
('Earl','Nikole','28 Chestnut Street','Apt. 601','Bradenton','34205','FL','2028743259'),
('Ria','Orlagh','93 Tunnel Street',NULL,'Annapolis','21401','MD','3054728395'),
('Amalia','Karin','93 Tunnel Street',NULL,'Annapolis','21401','MD','6029137486');


INSERT INTO Venues (name, address1, address2, city, zipcode, state)
VALUES ('Star Point Center','14 Windfall St.', 'Suite 200','Grand Rapids', '49503','MI'),
('Thomas Library','745 Harvard Dr.', NULL, 'Grand Rapids', '49505', 'MI'),
('Heart Oak Garden', '9808 Harrison Street', NULL, 'Grand Rapids', '49506', 'MI');

INSERT INTO Events (name, venueID, date)
VALUES ('Family Fun Festival',1,'2024-07-02'),
('Fall Charity Gala',2, '2024-10-22'),
('Run for Charity',2, '2024-01-06'),
('Bake Sale',3, '2024-04-05');

INSERT INTO Donations (peopleID, eventID, amount)
VALUES (1, 1, 5000),
(2,2, 2500),
(4, 4, 5000),
(4,1, 1000);

INSERT INTO VolunteerAssignments (peopleID, eventID, hoursGiven)
VALUES (1, 1, 2),
(5,2,3),
(3,4,4),
(4,3,5), 
(5,1,2);

SET FOREIGN_KEY_CHECKS=1;
COMMIT;