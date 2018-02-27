var returnable = [];
var locations = [];
var index = 0;

function handleButton(addMarker) {
  var address = document.getElementById('address').value;
  var city = document.getElementById('city').value;

  if(city.trim().length==0 && address.trim().length==0) {
    document.getElementById('error').style.visibility = "visible";
    return;
  }
  getCoordinates(address, city, addMarker);
  document.getElementById('error').style.visibility = "hidden;";
}

function getCoordinates(address, city, addMarker) {
  var test = "https://maps.googleapis.com/maps/api/geocode/json?address=" + address + " " + city + "A&key=AIzaSyD_Yt0izIctnEEiG8VOoiQ_hj79kkOzrcI";
  returnable = [];
  $.getJSON(test, function(data) {
  returnable[0] = data["results"][0]["geometry"]["location"]["lat"];
  returnable[1] = data["results"][0]["geometry"]["location"]["lng"];
  initMap(returnable, addMarker);
   });

}


function initMap(coords, addMarker) {

  if(coords==null) return;

  //console.log(coords[]);
  console.log(coords);
  if(coords.length == 0) {
  document.getElementById('addressnotfound').style.visibility = "visible";
  }
  var uluru = {lat: coords[0], lng: coords[1]};

  if(addMarker) {
  locations[index] =  uluru;
  index++;
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


var markerCluster = new MarkerClusterer(map, markers,
           {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
     }
