

function deleteAssignment(volunteerAssignmentID) {
    let link = '/delete-assignment-ajax/';
    let data = {
      id: volunteerAssignmentID
    };
  
    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: function(result) {
        alert("Volunteer Assignment Deleted")
        deleteRow(volunteerAssignmentID);
      }
    });
  }
  
  function deleteRow(volunteerAssignmentID){
      let table = document.getElementById("assignment-table");
      for (let i = 0, row; row = table.rows[i]; i++) {
         if (table.rows[i].getAttribute("data-value") == volunteerAssignmentID) {
              table.deleteRow(i);
              break;
         }
      }
  }