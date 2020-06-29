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
  console.log(data.places[0]["state abbreviation"].toLowerCase());
  //Type ajax call for API code below here____________________________________________
  // Summer's Code Updated 06.27.2020
  $(document).ready(() => {
    //Variables
    //SUBMIT BUTTON
    /*Description: Button, that once pressed, provides information on city input into the search form 
    to be displayed as current stats and reference information*/

    var state = data.places[0]["state abbreviation"].toLowerCase();
    currentCOVIDStats(state);
    stateResources(state);

    //currentCOVIDStats FUNCTION
    /*Description: Function collects current COVID data on state provided as input 
    and diplays on page*/
    function currentCOVIDStats(state) {
      $.ajax({
        method: "GET",
        url: `https://covidtracking.com/api/v1/states/${state}/current.json`,
        dataType: "json",
        success: function (response) {
          console.log(response);
          //currentCOVIDStats Variables
          var state = response.state;
          var totalTested = response.totalTestsViral;
          var totalConfirmedCases = response.positiveCasesViral;
          var totalCurrentHospitalizations = response.hospitalizedCurrently;
          var dailyChange = response.totalTestResultsIncrease;
          $("#stateStatsDiv").addClass("." + state + " ");
          $("totalTestedDiv").text("Total Tested:" + totalTested);
          $("totalConfirmedCasesDiv").text(
            "Total Confirmed: " + totalConfirmedCases
          );
          $("#totalCurrentHospitalizationsDiv").text(
            "Hospitalizations: " + totalCurrentHospitalizations
          );
          $("#dailyChangeDiv").text(
            "Daily Change (increase or descrease): " + dailyChange
          );
        },
      });
    }
    //stateResources FUNCTION
    /*Description: Function collects current COVID data on state provided as input 
    and diplays on page*/
    function stateResources(state) {
      $.ajax({
        method: "GET",
        url: `https://covidtracking.com/api/v1/states/${state}/info.json`,
        dataType: "json",
        success: function (response) {
          console.log(response);
          //currentWeather Variables
          var stateName = response.name;
          var stateNotes = response.notes;
          var stateCurrentCOVIDSite = response.covid19Site;
          var stateOldCOVIDSite = response.covid19SiteOld;
          var stateTwitter = response.twitter;
          $("#stateName").html("<h1>" + stateName + "<h1>");
          $("#stateNotes").html("<p>" + stateNotes + "<p>");
          $("#stateCurrentCOVIDSiteDiv")
            .attr("href", stateCurrentCOVIDSite)
            .text("State Site: " + stateCurrentCOVIDSite);
          $("#stateTwitterDiv")
            .attr("href", stateTwitter)
            .text("Twitter Handle: " + stateTwitter);
        },
      });
    }
  });
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
