var map;
// Create a new blank array for all the listing markers.
var markers = [];

//These are the locations for selected markers.
var locations = ko.observableArray([
  {
    title: 'Lago Negro',
    location: {lat: -29.3947927, lng: -50.878002},
    show: ko.observable(true)
  },
  {
    title: 'Wish Serrano Resort',
    location: {lat: -29.382240679150684, lng: -50.874633467997306},
    show: ko.observable(true)
  },
  {
    title: 'SuperCarros Gramado',
    location: {lat: -29.361701978886533, lng: -50.8571879214574},
    show: ko.observable(true)
  },
  {
    title: 'O Reino do Chocolate',
    location: {lat: -29.36183274951579, lng: -50.85022836049932},
    show: ko.observable(true)
  },
  {
    title: 'Mini Mundo',
    location: {lat: -29.384489179859266, lng: -50.875634193776705},
    show: ko.observable(true)
  }
]);

var initMap = function() {

  // Constructor creates a new map - only center and zoom are required.
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -29.3795583, lng: -50.936509},
    zoom: 13,
    mapTypeControl: false
  });

  this.largeInfowindow = new google.maps.InfoWindow();

  // Style the markers a bit. This will be our marker icon.
  var defaultIcon = makeMarkerIcon('0091ff');
  // Create a "highlighted location" marker color for when the user
  // mouses over the marker.
  var highlightedIcon = makeMarkerIcon('FF0000');
  // The following group uses the location array to create an array of markers on initialize.
  for (var i = 0; i < locations().length; i++) {
    // Get the position from the location array.
    var position = locations()[i].location;
    var title = locations()[i].title;
    // Create a marker per location, and put into markers array.
    var marker = new google.maps.Marker({
      position: position,
      title: title,
      animation: google.maps.Animation.DROP,
      icon: defaultIcon
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

    markers[i].marker = marker;
  }

  showPlaces();

};
// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function populateInfoWindow(marker, infowindow) {
  // Check to make sure the infowindow is not already opened on this marker.
  if (infowindow.marker != marker) {
    infowindow.marker = marker;
    // get4Square(marker.position.lat(), marker.position.lng());

    var url = "https://api.foursquare.com/v2/venues/search?ll=" + marker.position.lat() + "," + marker.position.lng() + "&client_id=R0OIOMNH4ZLSHWDLIN3PIDJHTTJ2MCIMBV2HVOJMUTRZZDD3&client_secret=MFW3BVESBAJ3FDPVOLJHM32ZRIYB5NMV3I1S4BRA1MPQIXUU&v=20180323";

    // Get VENUE_ID of selected place
    $.ajax({
      url: url,
      dataType: "jsonp",
      success: function(response){
        var venue_id = response.response.venues[0].id;
        var venue_url = "https://api.foursquare.com/v2/venues/" + venue_id + "?client_id=R0OIOMNH4ZLSHWDLIN3PIDJHTTJ2MCIMBV2HVOJMUTRZZDD3&client_secret=MFW3BVESBAJ3FDPVOLJHM32ZRIYB5NMV3I1S4BRA1MPQIXUU&v=20180323";
        //new request to get details from the 4Square Venue
        $.ajax({
          url: venue_url,
          dataType: "jsonp",
          success: function(response){
            infowindow.setContent('<h2>' + marker.title + '</h2><br><p>' + response.response.venue.description + '</p>');
          }
        });
      }
    });

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
  self = this;
  self.query = ko.observable("");

  this.listClick = function() {
    for(var i=0; i < markers.length; i++) {
      if (markers[i]['title'] == this.title) {
        google.maps.event.trigger(markers[i], 'click');
        return;
      }
    }
  };

  this.filterButton = function() {
    console.log(self.query());
    var q = self.query().toLowerCase();

    for(var i=0; i < locations().length; i++){
      if(locations()[i].title.toLowerCase().indexOf(q) >= 0) {
        locations()[i].show(true);
        markers[i].setVisible(true);
      } else {
        locations()[i].show(false);
        markers[i].setVisible(false);
      }
    }
  };
}

ko.applyBindings(new viewModel());
