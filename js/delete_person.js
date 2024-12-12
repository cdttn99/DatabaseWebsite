

function deletePerson(personID) {
  let link = '/delete-person-ajax/';
  let data = {
    id: personID
  };

  $.ajax({
    url: link,
    type: 'DELETE',
    data: JSON.stringify(data),
    contentType: "application/json; charset=utf-8",
    success: function(result) {
      alert("Person Deleted")
      deleteRow(personID);
    },
    error: function(xhr, status, error) {
      if (xhr.status === 409) {
        alert("Unable to Delete: Person is linked to other records.")
      }
    }
  });
}

function deleteRow(personID){
    let table = document.getElementById("people-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
       if (table.rows[i].getAttribute("data-value") == personID) {
            table.deleteRow(i);
            break;
       }
    }
}