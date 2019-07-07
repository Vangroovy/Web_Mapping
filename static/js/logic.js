// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
    console.log(data);
  // Once we get a response, send the data.features object to the createFeatures function
  createFeature(data.features);
  console.log(data.features);
});

function createFeature(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

  //Define a function to run once for each feature that will customize the 
  //circle marker based on the magnitude information
  function pointToLayer(feature, latlng) {
      var radius = feature.properties.mag * 5;
      var fillColor = "";
        if (feature.properties.mag <=1){fillColor="darkgreen";}
        else if (feature.properties.mag <=2){fillColor = "lightgreen";}
        else if (feature.properties.mag <=3){fillColor = "yellow";}
        else if (feature.properties.mag <=4){fillColor = "orange";}
        else if (feature.properties.mag <=5){fillColor = "darkorange";}
        else {fillColor="red";}
    options = {
        radius: radius,
        color: "white",
        opacity: 0,
        fillColor: fillColor,
        fillOpacity: 0.5
    }
  return L.circleMarker(latlng,options)
}

// Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: pointToLayer
  });
       
  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Light Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

//Create legend
var legend = L.control({position: 'bottomright'});
legend.onAdd = function(map) {
  var div = L.DomUtil.create('div', 'info legend'),
    magnitude = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"],
    labels = ['<strong>Magnitude</strong>'],
    colors = ["darkgreen", "lightgreen", "yellow", "orange", "darkorange", "red"];
  for (var i=0; i<6; i++){
    div.innerHTML += 
    labels.push(
      '<i class = "circle" style="background:' + colors[i] + '"></i>' + magnitude[i]);
    }
    div.innerHTML = labels.join('<br>'); 
    return div;
};
legend.addTo(myMap)

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps,{
    collapsed: false
  }).addTo(myMap);
}
