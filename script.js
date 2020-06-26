$(document).ready(function () {
  $("#submitButton").on("click", function (event) {
    event.preventDefault();
    var inputVal = $("#cityInput").val();
    console.log(inputVal);
    //   Empty search field
    $("#cityInput").val("");
    citySearch(inputVal);
  });

  function citySearch(inputVal, ) {
      $.ajax({
          type: "GET",
          url:
      }).then(function (data) {

      

      })
  }
});
