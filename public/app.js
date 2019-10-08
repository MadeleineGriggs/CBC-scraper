function toggleModal() {
  $(".modal").toggleClass("show-modal")
}

function toggleModalNotes() {
  $(".modal2").toggleClass("show-modal")
}

$(".close-button").on("click", function() {
  toggleModal();
})

$(".close-button2").on("click", function() {
  toggleModalNotes();
  $(".notes-container").empty();
})

  
  // Whenever someone clicks the create note button
  $(document).on("click", ".create-note", function() {
    // Empty the notes from the note section
    $("#notes").empty();
    // Save the id from the p tag
    var thisId = $(this).attr("data-id");
  
    // Now make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
      // With that done, add the note information to the page
      .then(function(data) {
        console.log(data);
        // The title of the article
        $("#notes").append("<h3>" + data.title + "</h3>");
        // An input to enter a new title
        $("#notes").append("<input id='titleinput' name='title' placeholder='Your comment title here...'>");
        // A textarea to add a new note body
        $("#notes").append("<textarea id='bodyinput' name='body' placeholder='Your comment here...'></textarea>");
        // A button to submit a new note, with the id of the article saved to it
        $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
        toggleModal();
        // If there's a note in the article
        if (data.note) {
          // Place the title of the note in the title input
          $("#titleinput").val(data.note.title);
          // Place the body of the note in the body textarea
          $("#bodyinput").val(data.note.body);
        }
      });
  });


  $(document).on("click", ".article-notes", function() {
    event.preventDefault()
    var thisId = $(this).attr("data-article");
  
    // Now make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
      // With that done, add the note information to the page
      .then(function(data) {

        data.note.forEach(function(item) {
          let title = item.title;
          let body = item.body;
          let noteId = item._id;

          let titleContainer = $("<div class='noteTitle'> </div>")
          titleContainer.append(title);

          let bodyContainer = $("<div class='noteBody'> </div>")
          bodyContainer.append(body);

          let deleteBtn = $("<button type='button' class='note-btn-delete'>Delete Note</button>");
          deleteBtn.attr("data-btn-id", noteId);

          let breakLine = $("<hr>");
          $(".notes-container").append(titleContainer, bodyContainer, deleteBtn, breakLine);
        })

        if (data.note) {
          // Place the title of the note in the title input
          toggleModalNotes();
          // console.log(data.title);
          // console.log(data.body);
          $("#notes-title").text(data.note.title);
          $("#notes-body").text(data.note.body);
          // Place the body of the note in the body textarea
        }
      });
  });
  
  // When you click the savenote button
  $(document).on("click", "#savenote", function() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
    toggleModal();
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        // Value taken from title input
        title: $("#titleinput").val(),
        // Value taken from note textarea
        body: $("#bodyinput").val()
      }
    })
      // With that done
      .then(function(data) {
        // Log the response
        console.log(data);
        // Empty the notes section
        $("#notes").empty();
      });
  
    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });

  $(document).on("click", ".note-btn-delete", function() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-btn-id");
    toggleModalNotes();
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/articles/delete/" + thisId,
    })
      // With that done
      .then(function(data) {
        // Log the response
        console.log(data);

        // Empty the notes section
      });
  
  });
  