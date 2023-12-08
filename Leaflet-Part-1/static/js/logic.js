const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'

let myMap = L.map("map", {
    center: [40.09, -110.71],
    zoom: 4.5
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);


d3.json(url).then(function (data) {


    function markerColor(depth) {
        switch (true) {
            case (depth > 90):
                return "red";
            case depth > 70:
                return "orangered";
            case depth > 50:
                return "orange";
            case depth > 30:
                return "gold";
            case depth > 10:
                return "yellow";
            default:
                return "green";
        }
    }

    function markerRadius(mag) {
        return Math.sqrt(mag) * 5;
    }


    function mapStyle(feature) {
        return {
            opacity: 1,
            fillOpacity: 0.7,
            fillColor: markerColor(feature.geometry.coordinates[2]),
            color: "black",
            radius: markerRadius(feature.properties.mag),
            stroke: true,
            weight: 0.5
        };
    }


    L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
        },
        style: mapStyle,
        onEachFeature: function (feature, layer) {
            layer.bindPopup("<strong>Magnitude:</strong> " + feature.properties.mag + "<br><strong>Location:</strong> " + feature.properties.place + "<br><strong>Depth:</strong> " + feature.geometry.coordinates[2]);
        }
    }).addTo(myMap);


    let legend = L.control({ position: "bottomright" });


    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend'),
            grades = [-10, 10, 30, 50, 70, 90];

        div.style.backgroundColor = '#fff';
        div.style.padding = '10px';


        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + markerColor(grades[i] + 1) + '; width: 18px; height: 18px; display: inline-block; margin-right: 5px;"></i> ' +
                grades[i] + (grades[i + 1] ? ' -    ' + grades[i + 1] : ' +');
            div.innerHTML += '<br>';
        }

        return div;
    };
    legend.addTo(myMap);
});
