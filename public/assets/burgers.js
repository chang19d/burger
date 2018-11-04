// Make sure we wait to attach our handlers until the DOM is fully loaded.
$(function() {
    registerPartial("burger-block", "#burgers-block-partial");
    displayPage();
    setupEventHandlers();
  });
  
  function registerPartial(name, partialId) {
    var source = $(partialId).text();
    Handlebars.registerPartial(name, source);
  }
  
  function displayPage() {
    // Send the GET request.
    $.get("/api/burgers/").then(
      function(burgers) {
        renderTemplate({burgers: burgers});
      }
    );
  }
  
  function renderTemplate(data) {
    var source = $("#page-template").text();
    var template = Handlebars.compile(source);
    var html = template(data);
    $("#app").html(html);
  }
  
  function setupEventHandlers() {
    $(document).on("click", ".change-devoured", function(event) {
      var id = $(this).data("id");
      var newDevoured = $(this).data("newdevoured");
  
      var newDevouredState = {
        devoured: newDevoured
      };
  
      // Send the PUT request.
      $.ajax("/api/burgers/" + id, {
        type: "PUT",
        data: newDevouredState
      }).then(
        function() {
          console.log("changed devoured to", newDevoured);
          // Rerender the templates with the updated list
          displayPage();
        }
      );
    });
  
    $(document).on("submit", ".create-form", function(event) {
      // Make sure to preventDefault on a submit event.
      event.preventDefault();
  
      var newBurger = {
        burger_name: $("#burg").val().trim(),
        // Get the sleepy value by finding an element with a "name" attribute equal to the string "sleepy" and is checked
        devoured: $("[name=devoured]:checked").val().trim()
      };
  
      // Send the POST request.
      $.ajax("/api/burgers", {
        type: "POST",
        data: newBurger
      }).then(
        function() {
          console.log("created new burger");
          // Rerender the templates with the updated list
          displayPage();
        }
      );
    })
  }