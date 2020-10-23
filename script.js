$(document).ready(function(){

    var APIKey = "1ee1b4eb2dbac1f3b43704c095773612"

    
    $("#search-button").on("click", function(event) {
        event.preventDefault();
        var cityName = $("#city-input").val();

        var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey
    
        // Add Search Items to History
        var searchItem = $("<div>");
        searchItem.addClass("row");

        var searchButton = $("<button>")
        searchButton.text(cityName);

        searchButton.addClass("btn btn-primary btn-lg");
        searchButton.css({"text-transform" : "capitalize" , "margin" : "5px"});
        searchItem.append(searchButton);

        $("#history").append(searchItem);


        $.ajax({
            url : queryURL,
            method : "GET"
        }).then(function(response){
            console.log(queryURL);
            console.log(response);
            
            var cityName = response.name;

            var icon = response.weather[0].icon;
            var iconURL = "https://openweathermap.org/img/wn/" + icon + ".png"

            var temp = response.main.temp;
            var humidity = response.main.humidity;
            var windSpeed = response.wind.speed;
            var lat = response.coord.lat;
            var lon = response.coord.lon;

            var uvQuery = "http://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey
                

                // UV Index API
                $.ajax({
                    url : uvQuery,
                    method : "GET"
                }).then(function(response){
                    var UV = response.value;
                    UV = Number(UV);

                    if (UV >= 4) {
                        $("#UV-val").addClass("danger-zone");
                    } else {
                        $("#UV-val").removeClass("danger-zone");
                        $("#UV-val").addClass("safe-zone");
                    };
                    
                    $("#UV-val").text("UV Index: " + UV);
                });

            temp = Number(temp)
            temp = (Math.round((temp - 273.15) * 9/5 + 32))
 
            $("#city-name").text(cityName + " " + (moment().format("(MM/DD/YY)")));
            $("#weather-icon").attr("src", iconURL);
            $("#temperature").text("Temperature: " + temp + " \u00B0F");
            $("#humidity").text("Humidity: " + humidity + "%");
            $("#wind-speed").text("Wind Speed: " + windSpeed + " MPH");
    
            
            // 5 Day Forecast
            var fiveDayQuery = "http://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + APIKey
            $.ajax({
                url : fiveDayQuery,
                method : "GET"
            }).then(function(response){
                console.log(response);
                
                $("#add-forecast").text("");
                var days = 0;

                for (var i = 4; i < 37; i+=8) {

                    console.log([i]);

                    var forecast = $("<div>");
                    forecast.addClass("col forecast bg-primary text-white ml-3 mb-3 rounded");

                    var dateP = $("<p>");
                    var iconP = $("<img>");
                    var tempP = $("<p>");
                    var humidityP = $("<p>");

                    var forecastTemp = response.list[i].main.temp;
                    forecastTemp = Number(forecastTemp)
                    forecastTemp = (Math.round((forecastTemp - 273.15) * 9/5 + 32));

                    var forecastHumidity = response.list[i].main.humidity;
                    var forecastIcon = response.list[i].weather[0].icon;
                    
                    var forecastIconURL = "https://openweathermap.org/img/wn/" + forecastIcon + ".png"

                    days++;
                    dateP.text(moment().add(days, 'days').format('MM/DD/YY'));
                    dateP.css("font-size", "20px");
                    forecast.append(dateP);

                    iconP.attr("src", forecastIconURL);
                    forecast.append(iconP);

                    tempP.text("Temp: " + forecastTemp + " \u00B0F");
                    forecast.append(tempP);

                    humidityP.text("Humidity: " + forecastHumidity + "%");
                    forecast.append(humidityP);

                    $("#add-forecast").append(forecast);
  
              };

            });

        });    
    
      });
        
    });