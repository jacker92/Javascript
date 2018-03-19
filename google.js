var returnable = [];
var locations = [];
var index = 0;


function handleButton(addMarker) {
  var address = document.getElementById('address').value;
  var city = document.getElementById('city').value;

  if (city.trim().length == 0 && address.trim().length == 0) {
    handleError();
    return;
  }
  getCoordinates(address, city, addMarker);
  document.getElementById('error').innerHTML = "";
}

function handleError() {
  document.getElementById('error').style.visibility = "visible";
  document.getElementById('error').innerHTML = "<h1>Please enter a valid address!</h1>"
}

function getCoordinates(address, city, addMarker) {
  var test = "https://maps.googleapis.com/maps/api/geocode/json?address=" + address + " " + city + "A&key=AIzaSyD_Yt0izIctnEEiG8VOoiQ_hj79kkOzrcI";
  returnable = [];
  $.getJSON(test, function(data) {
    if (data["status"] == "ZERO_RESULTS") {
      handleError();
      return;
    }
    returnable[0] = data["results"][0]["geometry"]["location"]["lat"];
    returnable[1] = data["results"][0]["geometry"]["location"]["lng"];
    initMap(returnable, addMarker);
  });

}

var rad = function(x) {
  return x * Math.PI / 180;
};

var getDistance = function(p1, p2) {
  var R = 6378137; // Earth’s mean radius in meter
  var dLat = rad(p2.lat - p1.lat);
  var dLong = rad(p2.lng - p1.lng);
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rad(p1.lat)) * Math.cos(rad(p2.lat)) *
    Math.sin(dLong / 2) * Math.sin(dLong / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d; // returns the distance in meter
};

function calculateDistance() {
  document.getElementById('error').innerHTML = "<h1>Straight line distance between two markers is approx. " + (getDistance(locations[0], locations[1]) / 1000).toFixed(2) + " kilometers. </h1>";
  document.getElementById('address').value = "";
  document.getElementById('city').value = "";
  document.getElementById('error').style.visibility = "visible";
  locations = [];
  document.getElementById('calculateDistance').style.visibility = "hidden";
  index = 0;
  initMarkerList();
}


function initMap(coords, addMarker) {

  if (coords == null) return;

  console.log(coords);
  if (coords.length == 0) {
    document.getElementById('addressnotfound').style.visibility = "visible";
  }
  var uluru = {
    lat: coords[0],
    lng: coords[1]
  };

  if (addMarker) {
    locations[index] = uluru;
    index++;
  }

  if (locations.length == 2) {
    document.getElementById('calculateDistance').style.visibility = "visible";
  } else {
    document.getElementById('calculateDistance').style.visibility = "hidden";
  }

  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 17,
    center: uluru
  });
  var markers = locations.map(function(location, i) {
    return new google.maps.Marker({
      position: location,
    });
  });

  if (addMarker) {
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < locations.length; i++) {
      bounds.extend(locations[i]);
    }
    map.fitBounds(bounds);
  }

  var markerCluster = new MarkerClusterer(map, markers, {
    imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
  });
  initMarkerList();

}

function initMarkerList() {

  var list = '<ul><li><a class="ui-all" tabindex="-1">';

  for (var i = 0; i < locations.length; i++) {
    list += locations[i].lat + ",";
    list += locations[i].lng + '</a></li>';

    if (i != locations.length - 1) {
      list += '<li>';
    }
  }

  list += '</li></ul>';
  console.log(list);
  if (locations.length > 0) {
    document.getElementById("listOfMarkers").innerHTML = "<h2>List of markers:</h2> \n" + list;
  } else {
    document.getElementById("listOfMarkers").innerHTML = "";
  }

}
