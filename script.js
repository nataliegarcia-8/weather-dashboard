var searchBtn = $("#searchbtn");

// access data base 
// var a = JSON.parse(localStorage.getItem("cityList")) || [];
var a = localStorage.getItem("cityList")
if (a) {
    a = JSON.parse(a)
} else {
    a = []
}

// var q = a[0] || "London";
var q;
if (a[0]) {
    q = a[0]
} else {
    q = "London"
}

getAPI(q);
getForecast(q);
displayList();

searchBtn.on("click", function (event) {
    event.preventDefault();

    var newCity = document.getElementById("input").value
    getAPI(newCity)
    getForecast(newCity)

    a = a.filter(function (city) {
        return city.toLowerCase() !== newCity.toLowerCase()
    });

    a.unshift(newCity)
    displayList();

    //saving to local storage 
    localStorage.setItem("cityList", JSON.stringify(a));
    document.getElementById("input").value = "";
});

function displayList() {
    $(".city-list").empty();
    for (var i = 0; i < a.length; i++) {
        var listItem = $("<li>");
        listItem.addClass("my-item");
        listItem.text(a[i]);
        listItem.click(searchClick)
        $(".city-list").append(listItem);
    }
};

function searchClick(){
    getAPI(this.textContent);
};

function getAPI(city) {
    var APIKey = "&appid=60711a8d5dec0c69de676a31a60af232";
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + APIKey;

    // AJAX call
    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function (response) {
            console.log(response);

            var lat = response.coord.lat
            var lon = response.coord.lon
            getUV(lat, lon)

            $(".city").html("<h1>" + response.name);
            $(".temp").html("Temperature: " + response.main.temp);
            $(".humidity").html("Humidity: " + response.main.humidity);
            $(".wind").html("Wind Speed: " + response.wind.speed);

        })
        .catch(function (error) {
            console.warn(error)
        })
}

function getUV(lat, lon) {
    var APIKey = "&appid=60711a8d5dec0c69de676a31a60af232";
    var queryURL = "http://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + APIKey;
    $.get(queryURL)
        .then(function (response) {
            console.log(response)
            $(".uv").html("UV Index: " + response.value);
        })
        .catch(function (error) {
            console.warn(error)
        });
};

function getForecast(city) {
    var APIKey = "&appid=60711a8d5dec0c69de676a31a60af232";
    var queryURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + APIKey;
    $.get(queryURL)
    .then(function (response) {
        console.log("forcast", response)
        for (var i = 0; i <= 5; i++){
        var dayDiv = $("<div>");
        dayDiv.addClass("col day-div");

        var dateDiv = $("<div>");
        dateDiv.text(response.list[i].dt_txt);
        dayDiv.append(dateDiv);

        var iconDiv = $("<img>");
        iconDiv.attr("src", response.list[i].weather.icon);
        dayDiv.append(iconDiv);

        var tempDiv = $("<div>");
        tempDiv.text(response.list[i].main.temp);
        dayDiv.append(tempDiv);

        var humidityDiv = $("<div>");
        humidityDiv.text(response.list[i].main.humidity);
        dateDiv.append(humidityDiv);
        
        $(".days").append(dayDiv);
        }
    })

     .catch(function (error) {
       console.warn(error)
     })
};