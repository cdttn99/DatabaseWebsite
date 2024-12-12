
// Get the objects we need to modify
let updateEventForm = document.getElementById('update-assignment-form-ajax');

// Modify the objects we need
updateEventForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputAssignmentID = document.getElementById('volunteerAssignmentID');
    let inputVolunteerID = document.getElementById('volunteerDropdown1');
    let inputEventID = document.getElementById('eventDropdown1');
    let inputhours = document.getElementById('hours1');
    
    // Get the values from the form fields
    let inputAssignmentIDValue = inputAssignmentID.value;
    let inputVolunteerIDValue = inputVolunteerID.value;
    let inputEventIDValue = inputEventID.value;
    let inputHoursValue = inputhours.value;

    

    // Put our data we want to send in a javascript object
    let data = {
        assignmentID_from_the_update_form: inputAssignmentIDValue,
        volunteerNameInput: inputVolunteerIDValue,
        eventNameInput: inputEventIDValue,
        hoursInput: inputHoursValue,
        

    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-assignment-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, inputAssignmentID);
            location.reload()
        
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
})


function updateRow(data, volunteerAssignmentID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("assignment-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == volunteerAssignmentID) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of homeworld value
            let td = updateRowIndex.getElementsByTagName("td")[3];

            // Reassign homeworld to our value we updated to
            td.innerHTML = parsedData[0].name; 
       }
    }
}
