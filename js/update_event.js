
// Get the objects we need to modify
let updateEventForm = document.getElementById('update-event-form-ajax');

// Modify the objects we need
updateEventForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputEventID = document.getElementById("mySelect");
    let inputEventName = document.getElementById("eventName1");
    let inputVenueID = document.getElementById("Venue1");
    let inputEventDate = document.getElementById("date1");
    
    // Get the values from the form fields
    let inputEventIDValue = inputEventID.value;
    let inputEventNameValue = inputEventName.value;
    let inputVenueIDValue = inputVenueID.value;
    let inputEventDataValue = inputEventDate.value;
    

    // Put our data we want to send in a javascript object
    let data = {
        eventID_from_the_update_form: inputEventIDValue,
        EventNameInput: inputEventNameValue,
        VenueIDInput: inputVenueIDValue,
        eventDateInput: inputEventDataValue,
        

    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-event-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, inputEventID);
            location.reload()
        
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
})


function updateRow(data, eventID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("event-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == eventID) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of homeworld value
            let td = updateRowIndex.getElementsByTagName("td")[3];

            // Reassign homeworld to our value we updated to
            td.innerHTML = parsedData[0].name; 
       }
    }
}