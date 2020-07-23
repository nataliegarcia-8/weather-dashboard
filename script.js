// global variables 
var searchBtn = $("#searchbtn");
var date = moment().format("M" + "/" + "D" + "/" + "YYYY");
// access saved data 
var a = JSON.parse(localStorage.getItem("cityList")) || [];
var q = a[0] || "London";

// calling functions 
getAPI(q);
getForecast(q);
displayList();

// onclick search function 
searchBtn.on("click", function (event) {
    event.preventDefault();

    var newCity = document.getElementById("input").value

//calling weather and forecast function 
    getAPI(newCity);
    getForecast(newCity);

//prevent having city name twice 
    a = a.filter(function (city) {
        return city.toLowerCase() !== newCity.toLowerCase()
    });

//adding new city first
    a.unshift(newCity)
    displayList();

//saving to local storage 
    localStorage.setItem("cityList", JSON.stringify(a));
    document.getElementById("input").value = "";
});

// displays sidebar list of cities function
function displayList() {
    $(".city-list").empty();
    for (var i = 0; i < a.length; i++) {
        var listItem = $("<li>");
        listItem.addClass("my-item list-group-item");
        listItem.text(a[i]);
        listItem.click(searchClick);
        $(".city-list").append(listItem);
    }
};

// making listed items clickable
function searchClick() {
    getAPI(this.textContent);
    getForecast(this.textContent);
};

//getting the API info
function getAPI(city) {
    var APIKey = "&appid=60711a8d5dec0c69de676a31a60af232";
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + APIKey + "&units=imperial";

    // AJAX call
    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function (response) {
            var weatherIcon = "https://openweathermap.org/img/wn/" + response.weather[0].icon + ".png";
            var lat = response.coord.lat
            var lon = response.coord.lon
            getUV(lat, lon)
            $(".city").html("<h1>" + response.name + " (" + date + ") " + "<img src=" + weatherIcon + "></img>");
            $(".temp").html("Temperature: " + response.main.temp + " <span> &#8457;</span>");
            $(".humidity").html("Humidity: " + response.main.humidity + " <span> &#37;</span>");
            $(".wind").html("Wind Speed: " + response.wind.speed + " MPH");

        })
        .catch(function (error) {
            console.warn(error)
        })
}

//getting UV info
function getUV(lat, lon) {
    var APIKey = "&appid=60711a8d5dec0c69de676a31a60af232";
    var queryURL = "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + APIKey;
    $.get(queryURL)
        .then(function (response) {
            $(".uv").html("UV Index: " + response.value);
            if (response.value > 11) {
                $(".uv").addClass("btn btn-danger");
            }
            else {
                $(".uv").addClass("btn btn-success");
            }
        })
        .catch(function (error) {
            console.warn(error)
        });
};

//getting forecast info
function getForecast(city) {
    $(".days").empty()
    var APIKey = "&appid=60711a8d5dec0c69de676a31a60af232";
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + APIKey + "&units=imperial";
    $.get(queryURL)
        .then(function (response) {
            console.log("forecast", response)
            for (var i = 0; i < 5; i++) {

                // create var to get correct dates 
                var c = (i * 8);
                
                // day forecast divs 
                var dayDiv = $("<div>");
                dayDiv.addClass("col day-div");

                var dateDiv = $("<div>").html(moment().add(i + 1, "days").format("M" + "/" + "D" + "/" + "YYYY"));
                dateDiv.addClass("date-div")
                dayDiv.append(dateDiv);

                var iconDiv = $("<img>");
                iconDiv.attr("src", "https://openweathermap.org/img/wn/" + response.list[c].weather[0].icon + "@2x.png");

                var tempDiv = $("<p>");
                tempDiv.html("Temp: " + response.list[c].main.temp + " <span> &#8457;</span>");

                var humidityDiv = $("<p>");
                humidityDiv.html("Humidity: " + response.list[c].main.humidity + " <span> &#37;</span>");

                //append all divs to main day div
                dayDiv.append(iconDiv, tempDiv, humidityDiv);
                $(".days").append(dayDiv);
            }
        })

        .catch(function (error) {
            console.warn(error)
        })
};