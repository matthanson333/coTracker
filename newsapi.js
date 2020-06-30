const APIKey = "73e000bec602bdab0b978b04f580bb63";
let queryURL = ""
let m = moment();
let date = m.subtract(7, 'd').format("YYYY-MM-DD");
console.log(date);

function buildQueryURL() {
    let state = $("#stateInput").val().trim();
    queryURL = "https://gnews.io/api/v3/search?q=" + state + "+covid-19&mindate=" + date + "&max=4&token=" + APIKey;
    console.log(queryURL);
    return queryURL;
}

$("#submitButton").on("click", function (event) {
    event.preventDefault();
    $(".listItems").remove();
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