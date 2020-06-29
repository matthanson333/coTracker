const APIKey = "56f71468618548868435ff8e19f0a3ac";
let queryURL = ""
let m = moment();
let date1 = m.subtract(5, 'd').format("YYYY-MM-DD");
let date2 = m.add(5, 'd').format("YYYY-MM-DD");

function buildQueryURL() {
    let state = $("#stateInput").val().trim();
    queryURL = "https://newsapi.org/v2/everything?q=" + state + "+covid-19&from=" + date1 + "&to=" + date2 + "&sortBy=popularity&pageSize=4&apiKey=" + APIKey;
    console.log(queryURL);
    return queryURL;
    //we can add to this if we have ideas for other user input to customize search
    //we can also add to the API's searched (CNN, etc) 
}

$("#submitButton").on("click", function (event) {
    event.preventDefault();
    queryURL = buildQueryURL();
    console.log(queryURL);
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        for (var i = 0; i < response.articles.length; i++) {
            let articleListEl = $("<ul>");
            let titleEl = $("<li>");
            let urlEL = $("<a>");
            articleListEl.addClass("listItems");
            $("#newslist").append(articleListEl);
            titleEl.text(response.articles[i].title);
            articleListEl.append(titleEl);
            urlEL.attr("href", response.articles[i].url);
            urlEL.attr("target", "_blank");
            urlEL.text("Link to Article");
            articleListEl.append(urlEL);

        }
    });
});