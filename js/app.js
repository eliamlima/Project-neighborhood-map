var map;
// Create a new blank array for all the listing markers.
var markers = [];

//These are the locations for selected markers.
var locations = [
  {title: 'Rua Coberta', location: {lat: -29.378678, lng: -50.8755976}},
  {title: 'Lago Negro', location: {lat: -29.3947927, lng: -50.878002}},
  {title: 'Wish Serrano Resort', location: {lat: -29.3821843, lng: -50.8770579}},
  {title: 'SuperCarros Gramado', location: {lat: -29.3617065, lng: -50.8593584}},
  {title: 'Prawer Chocolates', location: {lat: -29.3661833, lng: -50.8617407}},
  {title: 'Praça das Etnias', location: {lat: -29.3837249, lng: -50.8784937}}
];

function initMap() {

  // Constructor creates a new map - only center and zoom are required.
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -29.3795583, lng: -50.936509},
    zoom: 13,
    mapTypeControl: false
  });

  var largeInfowindow = new google.maps.InfoWindow();

  // Style the markers a bit. This will be our marker icon.
  var defaultIcon = makeMarkerIcon('0091ff');
  // Create a "highlighted location" marker color for when the user
  // mouses over the marker.
  var highlightedIcon = makeMarkerIcon('FF0000');
  // The following group uses the location array to create an array of markers on initialize.
  for (var i = 0; i < locations.length; i++) {
    // Get the position from the location array.
    var position = locations[i].location;
    var title = locations[i].title;
    // Create a marker per location, and put into markers array.
    var marker = new google.maps.Marker({
      position: position,
      title: title,
      animation: google.maps.Animation.DROP,
      icon: defaultIcon,
      id: i
    });
    // Push the marker to our array of markers.
    markers.push(marker);
    // Create an onclick event to open the large infowindow at each marker.
    marker.addListener('click', function() {
      populateInfoWindow(this, largeInfowindow);
    });
    // Two event listeners - one for mouseover, one for mouseout,
    // to change the colors back and forth.
    marker.addListener('mouseover', function() {
      this.setIcon(highlightedIcon);
    });
    marker.addListener('mouseout', function() {
      this.setIcon(defaultIcon);
    });
  }

  showPlaces();

}
// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function populateInfoWindow(marker, infowindow) {
  // Check to make sure the infowindow is not already opened on this marker.
  if (infowindow.marker != marker) {
    // Clear the infowindow content
    infowindow.setContent('');
    infowindow.marker = marker;
    infowindow.setContent(marker.title);
    // Make sure the marker property is cleared if the infowindow is closed.
    infowindow.addListener('closeclick', function() {
      infowindow.marker = null;
    });
    infowindow.open(map, marker);
  }
}

// This function will loop through the markers array and display them all.
function showPlaces() {
  var bounds = new google.maps.LatLngBounds();
  // Extend the boundaries of the map for each marker and display the marker
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
    bounds.extend(markers[i].position);
  }
  map.fitBounds(bounds);
}

// This function takes in a COLOR, and then creates a new marker
// icon of that color. The icon will be 21 px wide by 34 high, have an origin
// of 0, 0 and be anchored at 10, 34).
function makeMarkerIcon(markerColor) {
  var markerImage = new google.maps.MarkerImage(
    'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
    '|40|_|%E2%80%A2',
    new google.maps.Size(21, 34),
    new google.maps.Point(0, 0),
    new google.maps.Point(10, 34),
    new google.maps.Size(21,34));
  return markerImage;
}

var viewModel = function() {
  var self = this;
  self.markersList = ko.observableArray([
    {title: 'Rua Coberta', location: {lat: -29.378678, lng: -50.8755976}},
    {title: 'Lago Negro', location: {lat: -29.3947927, lng: -50.878002}},
    {title: 'Wish Serrano Resort', location: {lat: -29.3821843, lng: -50.8770579}},
    {title: 'SuperCarros Gramado', location: {lat: -29.3617065, lng: -50.8593584}},
    {title: 'Prawer Chocolates', location: {lat: -29.3661833, lng: -50.8617407}},
    {title: 'Praça das Etnias', location: {lat: -29.3837249, lng: -50.8784937}}
  ]);
}

ko.applyBindings(new viewModel());
