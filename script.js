
var APIKey = "60711a8d5dec0c69de676a31a60af232";
var q = "London, England";

// access data base 
var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + q + "i&appid=" + APIKey;

// var input = $("#input");
// q = input.html;
// console.log(q);
// for (var i = 0 ; i < q.length; i++) {

// }
// AJAX call
$.ajax({
    url: queryURL,
    method: "GET"
}).then(function (response) {
    console.log(response);

    $(".city").html("<h1>" + response.name);
    $(".temp").html("Temperature: " + response.main.temp);
    $(".humidity").html("Humidity: " + response.main.humidity);
    $(".wind").html("Wind Speed: " + response.wind.speed);
    $(".uv").html("UV Index: ");

});