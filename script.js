$(document).ready(function(){

    var APIKey = "1ee1b4eb2dbac1f3b43704c095773612"
    
    
    $("#search-button").on("click", function(event) {
        event.preventDefault();
        
        var cityName = $("#city-input").val();
        var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey
    
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
            temp = (Math.round(temp - 273.15) * 9/5 + 32)
 
            $("#city-name").text(cityName + " " + (moment().format("(MM/DD/YY)")));
            $("#weather-icon").attr("src", iconURL);
            $("#temperature").text("Temperature: " + temp + " \u00B0F");
            $("#humidity").text("Humidity: " + humidity + "%");
            $("#wind-speed").text("Wind Speed: " + windSpeed + " MPH");
    
        });
    
    
      });
    
        
    });