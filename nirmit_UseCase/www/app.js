

// fetch('/arrTIme').then(response => response.json()).then(data => console.log(data.arrTime));


let startLine = [];
let endLine = [];


const map = L.map('map').setView([50.0379, 8.5622],1);
var planeIcon = L.icon({
    iconUrl: './plane.png',

    iconSize:     [20, 40], // size of the icon
    shadowSize:   [50, 64], // size of the shadow
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});


var marker = L.marker([0, 0]).addTo(map);


const attribution = '&copy; <a href = "https://www.openstreetmap.org/copyright">OpenStreetMap</a> Contributors';
const tileUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const tiles = L.tileLayer(tileUrl, { attribution });
tiles.addTo(map);


let firstCall = true;

async function getPosition() {


    const response= await fetch('/arrTime')
    const getData= await response.json();

   
    // console.log(JSON.parse(res.time));
    document.getElementById('ArrTime').innerText = getData.time;  
    document.getElementById('lat').innerText = getData.lat;
    document.getElementById('lon').innerText = getData.lon;
    document.getElementById('Icao24').innerText = getData.icao;
    const lat = parseFloat(getData.lat);
    const lon = parseFloat(getData.lon);
    endLine = [lat, lon];
    if (firstCall) {
        //map.setView([lat,lon],5);
        startLine = [parseFloat(getData.lat), parseFloat(getData.lon)]
        map.setView([0, 0], 1);
        map.flyTo([lat, lon], 4, 'pan');
        firstCall = false;
    }
    marker.setLatLng([lat, lon]);
    map.flyTo([lat, lon], 4)
    var latlngs = [
        startLine,
        endLine
    ];

    var polyline = L.polyline(latlngs, { color: 'red' }).addTo(map);
    startLine = endLine;
    



    

    // document.getElementById('ArrTime').innerText = result.startend[0].time;
    // console.log(result);
        // for(var i=0;i<getData.length;i++){
        //     document.getElementById('ArrTime').innerText=getData.arrTime;
        // }
        // document.getElementById('ArrTime').innerText = getData.arrTime;
        // console.log(getData.arr);
  
    }
    

    
    
    //document.getElementById('lon').innerText = getData.startend[1].lon;
    // console.log(getData.arrTime[1]);






setInterval(getPosition, 3000);

document.getElementById("btn").onclick = document.getElementById("textBlock").innerHTML = (getPosition());