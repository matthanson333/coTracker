const APIKey = "56f71468618548868435ff8e19f0a3ac";
let queryURL = ""
let m = moment();
let date1 = m.subtract(5, 'd').format("YYYY-MM-DD");
let date2 = m.add(5, 'd').format("YYYY-MM-DD");

function buildQueryURL() {
    //let city = $("#city").val().trim();
    queryURL = "https://newsapi.org/v2/everything?q=" + city + "covid-19&from=" + date1 + "&to=" + date2 + "&sortBy=popularity&pageSize=5&apiKey=" + APIKey;
    console.log(queryURL);
    //we can add to this if we have ideas for other user input to customize search
    //we can also add to the API's searched (CNN, etc) 
}

function updateNews() {
    for (var i = 0; i < response.articles.length; i++) {
        let articleListEl = $("<ul>");
        let titleEl = $("<li>");
        let nestEl = $("<ul>");
        let sourceEl = $("<li>");
        let authorEl = $("<li>");
        let descriptionEl = $("<li>");
        let urlEL = $("<a>");
        $("#newslist").append(articleListEl);
        titleEl.text(response.articles[i].title);
        articleListEl.append(titleEl);
        sourceEl.text(response.articles[i].source.name);
        nestEl.append(sourceEl);
        authorEl.text(response.articles[i].author);
        nestEl.append(authorEl);
        descriptionEl.text(response.articles[i].description);
        articleListEl.append(descriptionEl);
        urlEL.attr("href", response.articles[i].url);
        urlEL.text("Link to Article");
        articleListEl.append(urlEL);

    }
}


$("#run-search").on("click", function (event) {
    event.preventDefault;
    var queryURL = buildQueryURL();
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(updateNews);
});