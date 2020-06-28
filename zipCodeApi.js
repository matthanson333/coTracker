function zipcodeLocation(zip) {
  let zipcodeToFIPSURL = "http://api.zippopotam.us/us/" + zip;
  $.ajax({
    method: "GET",
    url: zipcodeToFIPSURL,
  }).then(function (response) {
    //call functions after zipcode submit is clicked while inside zipcode AJAX API call
    countyCovidAPICall(response);
    example1Call(response); // This is an Example function call for other API use of zippopotams zipcode API
    //add as many API calls as needed for calls that require zip code to state "NC", "North Carolina", FIPS code etc...
    //check the response data from zipcode API to see what they have to offer
    //Check example1Call below.........................................................................................
  });
}

// Zipcode API to get latitude and longitude for covid county API
function countyCovidAPICall(responseData) {
  //latittude and longitude values to find FIPS code for county
  let lat = responseData.places[0].latitude;
  let long = responseData.places[0].longitude;
  let latLonURL =
    "https://geo.fcc.gov/api/census/block/find?latitude=" +
    lat +
    "&longitude=" +
    long +
    "&format=json";
  $.ajax({
    method: "GET",
    url: latLonURL,
  }).then(function (response) {
    //latitude and longitude location for FIPS call
    //AJAX call for covid by county API
    let countyFIPS = response.County.FIPS;
    let countyURL =
      "https://data.covidactnow.org/latest/us/counties/" +
      countyFIPS +
      ".WEAK_INTERVENTION.json";
    $.ajax({
      method: "GET",
      url: countyURL,
    }).then(function (response) {
      $("#byCounty").empty();
      //County covid Data
      newDiv = $("<div>").html(
        response.actuals.cumulativeDeaths + " total deaths"
      );
      newDiv1 = $("<div>").html(
        response.actuals.cumulativeConfirmedCases + " confirmed cases"
      );
      newDiv2 = $("<div>").html(response.actuals.population + " population");
      $("#byCounty").append(newDiv);
      $("#byCounty").append(newDiv1);
      $("#byCounty").append(newDiv2);
    });
  });
}
//Example of function below...................................
//Any other APIs to call by clicking submit button for zipcode
function example1Call(data) {
  console.log(data); //response data from zip code API
  // look through response data for specific data needed
  console.log(
    "Example 1 of respone from ajax call for state: " +
      JSON.stringify(data.places[0].state)
  );
  //Type ajax call for API code below here____________________________________________

  //______________________________Code above this live________________________________
}

//onclick event from submit button
$("#submitButton").on("click", function (event) {
  event.preventDefault();
  //grab zipcode from zipCodeInput
  let zipCode = $("#zipCodeInput").val();
  //insert zipcode to zipCodeLocation function
  zipcodeLocation(zipCode);
});
