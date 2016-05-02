//

var watchId = null;
var map = null;
var ourCoords = {
    latitude: 47.624851,
    longitude: -122.52099
};
var prevCoords = null;

window.onload = function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            displayLocation,
            displayError,
            {enableHighAccuracy: true, timeout: 9000}
        );
        var watchButton = document.getElementById("watch");
        watchButton.onclick = watchLocation;
        var clearWatchButton = document.getElementById("cleatWatch");
        clearWatchButton.onclick = clearWatch;
    }
    else {
        console.log("Oops, no geolocation support");
    }
};

function displayLocation(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;

    var div = document.getElementById("location");
    div.innerHTML =  "You are at Latitude: " + latitude + ", Longitude: " + longitude;
    div.innerHTML += " (with " + position.coords.accuracy + " meters accuracy)";

    var km = computeDistance(position.coords, ourCoords);
    var distance = document.getElementById("distance");
    distance.innerHTML = "You are " + km + " km from the WickedlySmart HQ";

    if (map == null) {
        showMap(position.coords);
        prevCoords = position.coords;
    }
    else {
        var meters = computeDistance(position.coords, prevCoords) * 1000;
        if (meters > 20) {
            scrollMapToPosition(position.coords);
            prevCoords = position.coords;
        }
    }
}

//--
//

function computeDistance(startCoords, destCoords) {
    var startLatRads = degreesToRadians(startCoords.latitude);
    var startLongRads = degreesToRadians(startCoords.longitude);
    var destLatRads = degreesToRadians(destCoords.latitude);
    var destLongRads = degreesToRadians(destCoords.longitude);

    var radius = 6371;

    return  Math.acos(Math.sin(startLatRads) * Math.sin(destLatRads) +
            Math.cos(startLatRads) * Math.cos(destLatRads) *
            Math.cos(startLongRads - destLongRads)) * radius;
}

function degreesToRadians(degrees) {
    return (degrees * Math.PI) / 180;
}

//--

function showMap(coords) {
    var googleLatAndLong = new google.maps.LatLng(coords.latitude, coords.longitude);

    var mapOptions = {
        zoom: 10,
        center: googleLatAndLong,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var mapDiv = document.getElementById("map");
    map = new google.maps.Map(mapDiv, mapOptions);

    var title = "Your Location";
    var content = "You are here: " + coords.latitude + ", " + coords.longitude;
    addMarker(map, googleLatAndLong, title, content);

    var wsLatLong = new google.maps.LatLng(ourCoords.latitude, ourCoords.longitude);
    addMarker(map, wsLatLong, "WickedlySmart HQ latitude: " + ourCoords.latitude + ", longitude: " + ourCoords.longitude);
}

function addMarker(map, latlong, title, content) {
    var markerOptions = {
        position: latlong,
        map: map,
        title: title,
        clickable: true
    };
    var marker = new google.maps.Marker(markerOptions);
    
    var infoWindowOptions = {
        content: content,
        position: latlong
    };
    
    var infoWindow = new google.maps.InfoWindow(infoWindowOptions);
    
    google.maps.event.addListener(marker, "click", function() {
        infoWindow.open(map);
    });
}

function displayError(error) {
    var errorTypes = {
        0: "Unknow error",
        1: "Permission denied",
        2: "Position is not available",
        3: "Request timeout"
    };
    var errorMessage = errorTypes[error.code];
    if (error.code == 0 || error.code == 2) {
        errorMessage = errorMessage + " " + error.message;
    }
    var div = document.getElementById("location");
    div.innerHTML = errorMessage;
}

function watchLocation() {
    watchId = navigator.geolocation.watchPosition(
                                    displayLocation,
                                    displayError,
                                    {enableHighAccuracy: true, timeout:3000}
    );
}

function scrollMapToPosition(coords) {
    var latitude = coords.latitude;
    var longitude = coords.longitude;

    var latlong = new google.maps.LatLng(latitude, longitude);
    map.panTo(latlong);
    
    addMarker(map, latlong, "Your new location", "You moved to: " + latitude + ", " + longitude);
}

function clearWatch() {
    if (watchId) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
    }
}
