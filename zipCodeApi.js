function zipcodeLocation(zip) {
  let zipcodeToFIPSURL = "https://api.zippopotam.us/us/" + zip;
  $.ajax({
    method: "GET",
    url: zipcodeToFIPSURL,
  }).then(function (response) {
    //call functions after zipcode submit is clicked while inside zipcode AJAX API call
    countyCovidAPICall(response);
    covidCasesCall(response); // This is an Example function call for other API use of zippopotams zipcode API
    //add as many API calls as needed for calls that require zip code to state "NC", "North Carolina", FIPS code etc...
    //check the response data from zipcode API to see what they have to offer
    //Check example1Call below.........................................................................................
    //news API call
    newsAPICall(response);
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

    //State Widget render
    $("#stateWidget").empty();
    let newDiv = $("<div>");
    newDiv.attr("class", "covid-act-now-embed");
    newDiv.attr("data-state-id", response.State.code);
    let newDiv1 = $("<script>");
    newDiv1.attr("src", "https://covidactnow.org/scripts/embed.js");
    newDiv.append(newDiv1);
    $("#stateWidget").append(newDiv);

    //County Widget render
    $("#countyWidget").empty();
    let newDiv2 = $("<div>");
    newDiv2.attr("class", "covid-act-now-embed");
    newDiv2.attr("data-fips-id", countyFIPS);
    let newDiv3 = $("<script>");
    newDiv3.attr("src", "https://covidactnow.org/scripts/embed.js");
    newDiv2.append(newDiv3);
    $("#countyWidget").append(newDiv2);

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
      newDiv4 = $("<div>").html(
        response.countyName + " County, " + response.stateName
      );
      newDiv = $("<div>").html(
        "Total Deaths: " + response.actuals.cumulativeDeaths
      );
      newDiv1 = $("<div>").html(
        " Confirmed Cases: " + response.actuals.cumulativeConfirmedCases
      );
      newDiv2 = $("<div>").html("Population: " + response.actuals.population);
      newDiv5 = $("<div>").html(
        "Data Last Updated: " + response.lastUpdatedDate
      );

      $("#byCounty").append(newDiv4);
      $("#byCounty").append(newDiv5);
      $("#byCounty").append(newDiv2);
      $("#byCounty").append(newDiv1);
      $("#byCounty").append(newDiv);

    });
  });
}
//Example of function below...................................
//Any other APIs to call by clicking submit button for zipcode
//Summers API covid API call
function covidCasesCall(data) {
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
        success: function (res) {
          console.log(res);
          //currentCOVIDStats Variables
          var state = res.state;
          var totalTested = res.totalTestsViral;
          console.log(res.totalTestsViral);
          var totalConfirmedCases = res.positiveCasesViral;
          console.log("Total Confirmed Cases: " + totalConfirmedCases);
          var totalCurrentHospitalizations = res.hospitalizedCurrently;
          var dailyChange = res.totalTestResultsIncrease;
          $("#stateStatsDiv").addClass("." + state + " ");
          $("#totalTestedDiv").text("Total Tested:" + totalTested);
          $("#totalConfirmedCasesDiv").text(
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
//Pauls News API call
function newsAPICall(data) {
  const APIKey = "73e000bec602bdab0b978b04f580bb63";
  let queryURL = "";
  let m = moment();
  let date = m.subtract(7, "d").format("YYYY-MM-DD");
  console.log(date);
  function buildQueryURL() {
    console.log(data);
    let state = data.places[0].state;
    queryURL =
      "https://gnews.io/api/v3/search?q=" +
      state +
      "+covid-19&mindate=" +
      date +
      "&max=4&token=" +
      APIKey;
    console.log(queryURL);
    return queryURL;
  }
  $(".listItems").remove();
  queryURL = buildQueryURL();
  console.log(queryURL);
  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    console.log(response);
    /*     let header = $("<h1>");
        header.text("News");
        header.css({ "font-weight": "bold", "text-decoration": "underline" })
        $("#newsList").append(header); */
    for (var i = 0; i < response.articles.length; i++) {
      let articleListEl = $("<ul>");
      let titleEl = $("<li>");
      let urlEL = $("<a>");
      articleListEl.addClass("listItems mt-2 mb-2");
      $("#newsList").append(articleListEl);
      titleEl.text(response.articles[i].title);
      titleEl.css("font-style", "italic");
      articleListEl.append(titleEl);
      urlEL.attr("href", response.articles[i].url);
      urlEL.attr("target", "_blank");
      urlEL.text("Link to Article");
      articleListEl.append(urlEL);
    }
  });
}
//onclick event from submit button
$("#submitButton").on("click", function (event) {
  event.preventDefault();
  //grab zipcode from zipCodeInput
  let zipCode = $("#zipCodeInput").val();
  //insert zipcode to zipCodeLocation function
  zipcodeLocation(zipCode);
});
