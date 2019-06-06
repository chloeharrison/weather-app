$(function () {
	//variables where the information appears
	$("input").val("");
	var $city = $("#city");
	var $country = $("#country");
	var $temp = $("#temperature");
	var $tempUnit = $("#temperatureUnit");
	var $weatherDesc = $("#weatherDescription");
	var $weatherAnimation = $("#weatherAnimation");

	// Switch between Celsius and Fahrenheit
	$tempUnit.on("click", function () {
		if ($tempUnit.text() === "C") {
			temp = temp * 1.8 + 32;
			$temp.html(temp.toFixed(0) + "<sup>o</sup>");
			$tempUnit.text("F");
		} else {
			temp = (temp - 32) / 1.8;
			$temp.html(temp.toFixed(0) + "<sup>o</sup>");
			$tempUnit.text("C");
		}
	});


	// When the user presses the enter button on the keyboard to search
	$("#input").keypress(function (event) {
		if (event.which === 13) {
			var arr = [];
			var str = $("input").val();
			arr = str.split(", ");
			city = arr[0];
			$("input").val("");
			$.getJSON("https://api.openweathermap.org/data/2.5/weather?q=" + arr + "&APPID=5b02ec69db10c31710ca4545e36de646")
				.done(function (data) {
					var rawJson = JSON.stringify(data);
					var json = JSON.parse(rawJson);
					var weather = json.weather[0].description;
					$weatherDesc.text(weather.toUpperCase());
					$country.text(", " + json.sys.country);
					$city.text(city.charAt(0).toUpperCase() + city.substr(1));
					temp = json.main.temp - 273.15;
					$temp.html(temp.toFixed(0) + "<sup>o</sup>");
					$tempUnit.text("C");

					var iconID = json.weather[0].icon;
					weatherAnimate(iconID);


				})
				.fail(function (jqXHR, textStatus, errorThrown) {
					alert("Enter a valid city name!");
				});
		}
	});


	//Integrating Icons
	function weatherAnimate(iconID) {
		var skycons = new Skycons({
			"color": "#FE5F55"
		});
		if (iconID === "01d") {
			skycons.set("animated-icon", "clear-day");
		} else if (iconID === "01n") {
			skycons.set("animated-icon", "clear-night");
		} else if (iconID === "02d") {
			skycons.set("animated-icon", "partly-cloudy-day");
		} else if (iconID === "02n") {
			skycons.set("animated-icon", "partly-cloudy-night");
		} else if (iconID === "03d" || iconID === "03n" || iconID === "04d" || iconID === "04n") {
			skycons.set("animated-icon", "cloudy");
		} else if (iconID === "09d" || iconID === "09n") {
			skycons.set("animated-icon", "rain");
		} else if (iconID === "10d" || iconID === "10n" || iconID === "11d" || iconID === "11n") {
			skycons.set("animated-icon", "sleet");
		} else if (iconID === "13d" || iconID === "13n") {
			skycons.set("animated-icon", "snow");
		} else {
			skycons.set("animated-icon", "fog");
		};
		skycons.play();
	}

	// Get location's coordinates
	function getLocation() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(getPosition, showError);
		} else {
			locationDisplay.innerHTML = "Geolocation is not supported by this browser.";
		}
	}

	// Convert coordinates to city,country through an API with ajax
	function getPosition(position) {
		lat = position.coords.latitude;
		long = position.coords.longitude;
		//AJAX
		$.getJSON("https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + long + "&APPID=5b02ec69db10c31710ca4545e36de646", function (data) {
			var rawJson = JSON.stringify(data);
			var json = JSON.parse(rawJson);
			var weather = json.weather[0].description;
			$weatherDesc.text(weather.toUpperCase());
			$city.text(json.name + ", ");
			$country.text(json.sys.country);
			temp = json.main.temp - 273.15;
			$temp.html(temp.toFixed(0) + "<sup>o</sup>");
			$tempUnit.text("C");


			var iconID = json.weather[0].icon;
			weatherAnimate(iconID);
		});
	}


	// // Error function if location not shown
	function showError(error) {
		switch (error.code) {
			case error.PERMISSION_DENIED:
				locationDisplay.innerHTML = "User denied the request.";
				break;
			case error.POSITION_UNAVAILABLE:
				locationDisplay.innerHTML = "Location information is unavailable.";
				break;
			case error.TIMEOUT:
				locationDisplay.innerHTML = "The request to get user location timed out.";
				break;
			case error.UNKNOWN_ERROR:
				locationDisplay.innerHTML = "An unknown error occurred.";
				break;
		}
	}


	getLocation();

});

//search box

$(".input").focus(function () {
	$("#search").addClass("move");
});
$(".input").focusout(function () {
	$("#search").removeClass("move");
	$(".input").val("");
});

$(".fa-search").click(function () {
	$(".input").toggleClass("active");
	$("#search").toggleClass("active");
});


//time
function updateClock() {
	var currentTime = new Date();
	//  Getting the time in 12h clock
	var currentHoursAP = currentTime.getHours();
	// Finding the hours
	var currentHours = currentTime.getHours();
	// Finding the Minutes
	var currentMinutes = currentTime.getMinutes();
	// Operating System Clock Seconds
	var currentSeconds = currentTime.getSeconds();
	// Adding 0 if Minutes & Seconds is More or Less than 10
	currentMinutes = (currentMinutes < 10 ? "0" : "") + currentMinutes;
	currentSeconds = (currentSeconds < 10 ? "0" : "") + currentSeconds;
	// Picking "AM" or "PM" 12h clock if time is more or less than 12
	var timeOfDay = (currentHours < 12) ? "AM" : "PM";
	// transform clock to 12h version 
	currentHoursAP = (currentHours > 12) ? currentHours - 12 : currentHours;
	// transform clock to 12h version after mid night
	currentHoursAP = (currentHoursAP == 0) ? 12 : currentHoursAP;
	// display first 24h clock and after line break 12h version
	var currentTimeString = currentHoursAP + ":" + currentMinutes + " " + timeOfDay;
	// print the time in div #clock.
	$(".clock").html(currentTimeString);
}
$(document).ready(function () {
	setInterval(updateClock, 1000);
});


//fronttime
function startTime() {
	var today = new Date();
	var h = today.getHours();
	var m = today.getMinutes();
	m = checkTime(m);;
	document.getElementById('time').innerHTML = h + ":" + m;
	t = setTimeout('startTime()', 500);

}

function checkTime(i) {

	if (i < 10) {
		i = "0" + i;

	}

	return i;

}

//date
document.getElementById("date").innerHTML = formatAMPM();

function formatAMPM() {
	var d = new Date(),

		months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
		days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	return days[d.getDay()] + ' ,' + months[d.getMonth()] + ' ' + d.getDate() + ' ' + d.getFullYear() + ' ';
}

//phone background
/* CONFIG VARIABLES */
// How many frames per second to run the animation at.
var fps = 40;

// How many balls to create in the canvas
var balls = 50;

// Maximum number of pixels the ball can move per frame.
var maxSpeed = 5;

// Min & Max size for the circle's radius
var radius = {
	min: 5,
	max: 40
}

// Maximum values for each of the colors
var max = {
	r: 255,
	g: 255,
	b: 255,
	a: .9
}
/* END CONFIG VARIABLES */

var ballArray = [];
var c = document.getElementById("canvas");
var ctx = c.getContext("2d");

canvas.width = 200;
canvas.height = 400;

var ball = function () {
	return {
		color: {
			r: 255,
			g: 255,
			b: 255,
			a: 1
		},
		x: 50,
		y: 50,
		radius: 50,
		speed: {
			x: 1,
			y: 1
		},
		randomize: function () {
			// Pick a random x & y coordinate for the ball to start at
			this.x = Math.floor((Math.random() * (c.height - this.radius)) + this.radius);
			this.y = Math.floor((Math.random() * (c.width - this.radius)) + this.radius);

			// Randomize the ball's speed (both x & y)
			this.speed.x = Math.random() * (maxSpeed * 2) - maxSpeed;
			this.speed.y = Math.random() * (maxSpeed * 2) - maxSpeed;

			this.radius = Math.floor(Math.random() * (radius.max - radius.min)) + radius.min + 1;

			this.color.r = Math.floor(Math.random() * max.r);
			this.color.g = Math.floor(Math.random() * max.g);
			this.color.b = Math.floor(Math.random() * max.b);
			this.color.a = Math.random() * max.a;

		},
		move: function () {
			if (this.x > c.height - this.radius) {
				this.x = c.height - this.radius;
				this.speed.x *= -1;
			}
			if (this.x < this.radius) {
				this.x = this.radius;
				this.speed.x *= -1;
			}
			if (this.y > c.width - this.radius) {
				this.y = c.width - this.radius;
				this.speed.y *= -1;
			}
			if (this.y < this.radius) {
				this.y = this.radius;
				this.speed.y *= -1;
			}

			this.x += this.speed.x;
			this.y += this.speed.y;
		},
		draw: function () {
			ctx.fillStyle = 'rgba(' + this.color.r + ',' + this.color.g + ',' + this.color.b + ',' + this.color.a + ')';
			ctx.beginPath();
			ctx.arc(this.y, this.x, this.radius, 0, 2 * Math.PI);
			ctx.fill();
		}
	}
};

for (i = 0; i < balls; i++) {
	ballArray[i] = new ball;
	// Randomize the Ball's attributes
	ballArray[i].randomize();
}

setInterval(function () {
	c.width = c.width;
	for (key in ballArray) {
		ballArray[key].move();
		ballArray[key].draw();
	}
}, 1000 / fps);


//show and hide sections

$(".hide").click(function () {

	$("#section1").show();
	$("#section2").hide();
});

$("#header2").click(function () {

	$("#section2").show();
	$("#section1").hide();

});