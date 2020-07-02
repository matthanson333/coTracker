// Summer's Code
$(document).ready(() => {
  //Variables
  //SUBMIT BUTTON
  /*Description: Button, that once pressed, provides information on city input into the search form 
    to be displayed as current stats and reference information*/
  $("#submitBtn").on("click", function (event) {
    event.preventDefault();
    var state = $("#search-term").val();
    console.log(state);
    currentCOVIDStats(state);
    stateResources(state);
  });
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
        $("totalTestedDiv").text(totalTested);
        $("totalConfirmedCasesDiv").text(totalConfirmedCases);
        $("#totalCurrentHospitalizationsDiv").text(
          totalCurrentHospitalizations
        );
        $("#dailyChangeDiv").text(dailyChange);
      },
    });
  }
  //stateResources FUNCTION
  /*Description: Function collects current COVID data on state provided as input 
    and diplays on page*/
  function stateResources(state) {
    $.ajax({
      method: "GET",
      url: `https://covidtracking.com/api/v1/states/{state}/info.json`,
      dataType: "json",
      success: function (response) {
        console.log(response);
        //currentWeather Variables
        var stateName = response.state;
        var stateNotes = response.notes;
        var stateCurrentCOVIDSite = response.covid19Site;
        var stateOldCOVIDSite = response.covid19SiteOld;
        var stateTwitter = response.twitter;
        $("#stateName").html("<h1>" + stateName + "<h1>");
        $("#stateNotes").html("<p>" + stateNotes + "<p>");
        $("#stateCOVIDSiteLink")
          .attr("href", stateCurrentCOVIDSite)
          .text("State COVID Reference Site");
        $("#stateTwitter").attr("href", stateTwitter).text(stateTwitter);
      },
    });
  }
});

$("#submitButton").click(function () {
  $("#zipInput").hide(1000);
  $("#locationHeader").show(1000);
  $(".hideDiv").show(1000);
});
