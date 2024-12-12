function toggleForm() {
    const formContainer = document.getElementById("formContainer");
    document.getElementById('newButton').style.display = "none";
    document.getElementById('viewTable').style.display = "none";
    formContainer.style.display = formContainer.style.display === "none" || formContainer.style.display === "" ? "block" : "none";
}
function toggleForm1() {
    const formContainer = document.getElementById("formContainer");
    document.getElementById('newButton').style.display = "block";
    document.getElementById('viewTable').style.display = "block";
    formContainer.style.display = formContainer.style.display === "none" || formContainer.style.display === "" ? "none" : "none";
}
function toggleEditPerson(peopleID) {
    const editTable = document.getElementById("editTable");
    document.getElementById('newButton').style.display = "none";
    document.getElementById('viewTable').style.display = "none";
    editTable.style.display = editTable.style.display === "none" || editTable.style.display === "" ? "block" : "none";

    fetch(`/get-person/${peopleID}`)
    .then(response => response.json())
    .then(data => {
        document.getElementById('mySelect').value = peopleID;
        document.getElementById('fName1').value = data.firstName;
        document.getElementById('lName1').value = data.lastName;
        document.getElementById('address11').value = data.address1 || '';
        document.getElementById('address21').value = data.address2 || '';
        document.getElementById('city1').value = data.city;
        document.getElementById('zip1').value = data.zipcode;
        document.getElementById('states1').value = data.state;
        document.getElementById('phone1').value = data.phoneNumber;
    })
    .catch(err => console.error('Error:', err));
}
function toggleEditEvent(eventID) {
    const editTable = document.getElementById("editTable");
    document.getElementById('newButton').style.display = "none";
    document.getElementById('viewTable').style.display = "none";
    editTable.style.display = editTable.style.display === "none" || editTable.style.display === "" ? "block" : "none";

    fetch(`/get-event/${eventID}`)
    .then(response => response.json())
    .then(data => {
       document.getElementById('mySelect').value = eventID;
       document.getElementById('eventName1').value = data.name;
       document.getElementById('Venue1').value = data.venue;
       document.getElementById('date1').value = data.date;

       console.log(document.getElementById('Venue1').value = data.venue)
    })
    .catch(err => console.error('Error:', err));
}

function toggleEditAssignments(volunteerAssignmentID) {
    const editTable = document.getElementById("editTable");
    document.getElementById('newButton').style.display = "none";
    document.getElementById('viewTable').style.display = "none";
    editTable.style.display = editTable.style.display === "none" || editTable.style.display === "" ? "block" : "none";

    fetch(`/get-volunteerAssignment/${volunteerAssignmentID}`)
    .then(response => response.json())
    .then(data => {
        document.getElementById('volunteerAssignmentID').value = volunteerAssignmentID;
        document.getElementById('volunteerDropdown1').value = data.volunteer;
        document.getElementById('eventDropdown1').value = data.eventName;
        document.getElementById('hours1').value = data.hoursGiven;

    })
    .catch(err => console.error('Error:', err));
}
function reverseEdit(){
    const editTable = document.getElementById("editTable");
    const formContainer = document.getElementById("formContainer");
    document.getElementById('newButton').style.display = "block";
    document.getElementById('viewTable').style.display = "block";
    formContainer.style.display = formContainer.style.display === "none" || formContainer.style.display === "" ? "none" : "none";
    editTable.style.display = editTable.style.display === "none" || editTable.style.display === "" ? "none" : "none";
    location.reload(true);
}
