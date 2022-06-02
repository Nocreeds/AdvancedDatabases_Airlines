const airPlaneInfo = require('./airPlaneInfo');
const lib = require("./backend");

var map = L.map('map').setView([51.505, -0.09], 13);

var tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


var planeIcon = L.icon({
    iconUrl: 'plane.png',
    shadowUrl: 'plane_shadow.png',

    iconSize:     [30, 30], // size of the icon
    shadowSize:   [35, 35], // size of the shadow
    iconAnchor:   [0, 0], // point of the icon which will correspond to marker's location
    shadowAnchor: [12, 5],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});
var marker = L.marker([51.5, -0.09], {icon: planeIcon}).addTo(map);

// setTimeout(() => {
//     console.log("Hello");
//     var latlng = L.latLng(51.501, -0.09);
//     marker.setLatLng(latlng);
// }, 2000)


// setInterval(() => {
//     var latlng = marker.getLatLng();
//     latlng.lat += 0.0001;
//     latlng.lng += 0.0001;
//     marker.setLatLng(latlng);
// }, 16);

