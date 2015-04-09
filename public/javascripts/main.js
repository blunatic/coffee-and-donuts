// main.js


/*
* Google Maps map initialization
*/

var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var map;

function initialize() {
  directionsDisplay = new google.maps.DirectionsRenderer();
  var sf = new google.maps.LatLng(37.775, -122.419);
  var mapOptions = {
    zoom: 12,
    center: sf,
    scrollwheel: false
  };
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  directionsDisplay.setMap(map);
}

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
    geocoder.geocode({ 'latLng': locCurrent }, function (results, status) {
        console.log(results);
        var locCountryNameCount = 0;
        var locCountryName = results[locCountryNameCount].formatted_address;
        $("#user_location").val(locCountryName);
        $('#loading-indicator1').hide();
    });
}

google.maps.event.addDomListener(window, 'load', initialize);
