// main.js


/*
 * Google Maps Map Initialization
 */

 // leg1 directions display (origin to donut shop)
 var directionsDisplay1 = new google.maps.DirectionsRenderer({
 		map             : map,
 		preserveViewport: true,
 		polylineOptions : {strokeColor:
 			'red'}});

// leg2 directions display (donut shop to destination)
var directionsDisplay2 = new google.maps.DirectionsRenderer({
 		map             : map,
 		preserveViewport: true,
 		polylineOptions : {strokeColor:
 			'blue'}});

 var directionsService = new google.maps.DirectionsService();
 var map;

 function initialize() {

 	// default starting map (San Francisco)
 	var sf = new google.maps.LatLng(37.775, -122.419);
 	var mapOptions = {
 		zoom: 12,
 		center: sf,
 		scrollwheel: false
 	};
 	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

 	// set map and direction panel elements
 	directionsDisplay1.setMap(map);
 	directionsDisplay2.setMap(map);
 	directionsDisplay1.setPanel(document.getElementById('map-directions1'));
 	directionsDisplay2.setPanel(document.getElementById('map-directions2'));

 }

 // Handle "enter" submit for user destination search
 $("#user_destination").keyup(function(event){
 	if(event.keyCode == 13){
 		$("#destination_button").click();
 	}
 });

/*
 * Google Maps Location
 */

 function getLocation() {
 	$('#loading-indicator1').show();

 	if (navigator.geolocation) {
 		navigator.geolocation.getCurrentPosition(showPosition);
 	} else {
 		console.log("Geolocation is not supported by this browser.");
 	}
 }

 function showPosition(position) {
 	var locCurrent = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
 	var geocoder = new google.maps.Geocoder();
 	geocoder.geocode({
 		'latLng': locCurrent
 	}, function(results, status) {
 		var locCountryNameCount = 0;
 		var locCountryName = results[locCountryNameCount].formatted_address;
 		$("#user_start").val(locCountryName);
 		$('#loading-indicator1').hide();
 	});
 }

/*
* Google Maps Calculate Route
*/

function calcRoute() {
	// get user origin, destination and travel mode
	var start = $('#user_start').val();
	var end = $('#user_destination').val();
	var selectedMode = $('#travelmode').val();

	// show map section
	$('#map').show();
	initialize();

	// show loading icon
	$('#loading-indicator2').show();

	// empty previous results
	$('#donut_location').empty();

	// codeAddress grabs the lat/lng for the user destination
	// so that nearby search can be done for donuts and coffee
	codeAddress(end, function(geocodeData) {

		// search request
		var coffeeDonutRequest = {
			location: geocodeData,
			types: ['food'],
			rankBy: google.maps.places.RankBy.DISTANCE,
			keyword: 'donuts'
		};

		var service = new google.maps.places.PlacesService(map);

		// search nearby the end destination for nearest donuts (which assumes they'll also have coffee)
		service.nearbySearch(coffeeDonutRequest, function callback(results, status) {
			//display nearest donut shop location found
			$('#donut_heading').show();
			var rating = results[0].rating;

			if(rating == undefined){
				rating = "No Rating";
			}

			$('#donut_location').append("<h3>" + results[0].name + "</h3><h2><small>" + results[0].vicinity
				+ " | Rating: " + rating + "</small></h2>");

			// hide loading icon
			$('#loading-indicator2').hide();

			// scroll to directions and results
			$("html, body").animate({
				scrollTop: $('#map').offset().top 
			}, 2000);

			// leg1 directions (origin to donut shop)
			var leg1 = {
				origin: start,
				destination: results[0].geometry.location,
				travelMode: google.maps.TravelMode[selectedMode]
			};

			directionsService.route(leg1, function(response, status) {
				if (status == google.maps.DirectionsStatus.OK) {
					map.setZoom(13);
					// set end address to display the name of the donut shop found
					response.routes[0].legs[0].end_address = results[0].name + ", " + results[0].vicinity;
					directionsDisplay1.setDirections(response);
				}
			});

			// leg2 directions (donut shop to destination)
			var leg2 = {
				origin: results[0].geometry.location,
				destination: end,
				travelMode: google.maps.TravelMode[selectedMode]
			};

			directionsService.route(leg2, function(response, status) {
				if (status == google.maps.DirectionsStatus.OK) {
					map.setZoom(13);
					// set start address to display the name of the donut shop found
					response.routes[0].legs[0].start_address = results[0].name + ", " + results[0].vicinity;
					directionsDisplay2.setDirections(response);
				}
			});
		});
});

}

/*
* Get the lat/lng of an address using Google Maps API geocoder
*/
function codeAddress(endAddress, callback) {
	var geocoder = new google.maps.Geocoder();
	geocoder.geocode( { 'address': endAddress}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			var currentlatlng = results[0].geometry.location;
			var lng = currentlatlng.lng();
			var lat = currentlatlng.lat();
			var here = new google.maps.LatLng(lat, lng);
			callback(here);
		} else {
			alert('Geocode was not successful for the following reason: ' + status + " Please try again!");
			callback(null);
			$('#loading-indicator2').hide();
		}
	});
}
