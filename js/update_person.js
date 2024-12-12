
// Get the objects we need to modify
let updatePersonForm = document.getElementById('update-person-form-ajax');

// Modify the objects we need
updatePersonForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputPeopleID = document.getElementById("mySelect");
    let inputFirstName = document.getElementById("fName1");
    let inputLastName = document.getElementById("lName1");
    let inputAddress1 = document.getElementById("address11");
    let inputAddress2 = document.getElementById("address21");
    let inputCity = document.getElementById("city1");
    let inputZip = document.getElementById("zip1");
    let inputState = document.getElementById("states1");
    let inputPhone = document.getElementById("phone1");


    // Get the values from the form fields
    let peopleIDValue = inputPeopleID.value;
    let firstNameValue = inputFirstName.value;
    let lastNameValue = inputLastName.value;
    let address1Value = inputAddress1.value;
    let address2Value = inputAddress2.value;
    let cityValue = inputCity.value;
    let zipValue = inputZip.value;
    let stateValue = inputState.value;
    let phoneValue = inputPhone.value;
    

    // Put our data we want to send in a javascript object
    let data = {
        peopleID_from_the_update_form: peopleIDValue,
        firstNameInput: firstNameValue,
        lastNameInput: lastNameValue,
        address1Input: address1Value,
        address2Input: address2Value,
        cityInput: cityValue,
        zipCodeInput: zipValue,
        stateInput: stateValue,
        phoneNumber: phoneValue,

    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-person-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, peopleIDValue);
            location.reload()
        
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
})


function updateRow(data, personID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("people-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == personID) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of homeworld value
            let td = updateRowIndex.getElementsByTagName("td")[3];

            // Reassign homeworld to our value we updated to
            td.innerHTML = parsedData[0].name; 
       }
    }
}
