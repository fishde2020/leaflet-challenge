// Create an initial map object
// Set the longitude, latitude, and the starting zoom level
let myMap = L.map("map",{
    center:[37.09, -95.71], 
    zoom: 5});

// Add a tile layer (the background map image) to our map
// Use the addTo method to add objects to our map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);


// Store our API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(queryUrl).then(function (data) {
    // Console log URL response to check the data.
    console.log(data.features)
    console.log(data.features.length)

    for (let i = 0; i < data.features.length; i++) {

        let location = data.features[i].geometry;

        let color= "";
        if(location.coordinates[2] >90) {
            color = "#c45e5e";
        }
        else if (location.coordinates[2] >=70) {
            color = "#c4795e";
        }
        else if (location.coordinates[2] >=50) {
            color = "#c4b05e";
        }
        else if (location.coordinates[2] >=30) {
            color = "#bdc45e";
        }
        else if (location.coordinates[2] >=10) {
            color = "#a2c45e";
        }
        else if (location.coordinates[2] >=-10) {
            color = "#87c45e";
        }
        else {
            color = "";
        }


        L.circle([location.coordinates[1], location.coordinates[0]],{
            fillOpacity:1,
            color:"black",
            weight:1,
            fillColor:color,
            radius: data.features[i].properties.mag * 20000
        })
        .bindPopup(`<h3>${data.features[i].properties.place}</h3>
        <p><b>Longitude: </b>${location.coordinates[0]}; <b>Latitude: </b>${location.coordinates[1]}<br>
        <b>Magnitude: </b>${data.features[i].properties.mag}<br>
        <b>Depth: </b>${location.coordinates[2]}km
        </p>
        <hr>
        <p>${new Date(data.features[i].properties.time)}</p>`)
        .addTo(myMap);
    
      }

      //Add a legend
      //Create a control with position
      var legend = L.control({position: 'bottomright'});

      legend.onAdd = function () {
      
          let div = L.DomUtil.create('div', 'info legend');
          let dep = [-10, 10, 30, 50, 70, 90];

          function getColor(d) {
            return d > 90 ? "#c45e5e":
                   d >= 70  ? "#c4795e":
                   d >= 50  ? "#c4b05e":
                   d >= 30  ? "#bdc45e":
                   d >= 10   ? "#a2c45e":
                   d >= -10   ? "#87c45e":
                              '';
        }
      
          // loop through our density intervals and generate a label with a colored square for each interval
          for (var i = 0; i < dep.length; i++) {
              div.innerHTML +=
                  '<i style="background:' + getColor(dep[i]) + '"> </i> ' +
                  dep[i] + (dep[i + 1] ? '&ndash;' + dep[i + 1] + '<br>' : '+');
                }
                return div;
            };
    
      legend.addTo(myMap);
});
