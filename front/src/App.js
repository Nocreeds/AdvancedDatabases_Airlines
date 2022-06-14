import React, { useState, useEffect, useRef } from "react";
import { Map as LeafletMap, TileLayer, Popup } from "react-leaflet";
import { Polygon, GeoJSON } from "react-leaflet";
import L from "leaflet"

import RotatedMarker from "./RotatedMarker";

import './App.css'
import  Axios from "axios";
import plane from './Icons/plane.png';

function App() {
  const [xPoses, setPosX] = useState([]);
  const [yPoses, setPosY] = useState([]);
  const [Coordinate, setCoordinate] = useState([]);
  const [GeoJson, setGJSON] = useState([]);

  let currentTimeStamp = 1653264010;
  useEffect(()=>{

    setPosX(0);
    setPosY(0);
    const fetchItems = async () => {

      const res = await applyCountryBorder("Germany");
      setGJSON(res);
      // const result = await Axios(
      //   "http://localhost:3001/getAllLimit"
      // );

      setInterval(async() => {
        let result = await Axios(
          "http://localhost:3001/getSelectedPlanesByTime?timeStamp=" + currentTimeStamp
        );
        console.log("Call for timeStamp " + currentTimeStamp);
        console.log(result.data);
        setCoordinate(result.data);
        currentTimeStamp += 10;
      },1000);

    };
    fetchItems();
  }, []);

//   return (
    
//     <MapContainer center={[51.5, 7.962935164168075]} zoom={13} style = {{height: '100vh', width:'100wh'}}>
//   <TileLayer
//     attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//     url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//   />

//  { [Coordinate].map(cor =>{
//       console.log("Marker posi", cor.lat,cor.lon);       
//       <Marker position={[cor.lat, cor.lon]}>
//         <Popup>
//         A pretty CSS3 popup. <br /> Easily customizable.
//         </Popup>
//       </Marker>
//   })
 
//  }
//   <div className="marketTestPlane">
//   <Marker position={[0, 0]} icon={GetIcon()}>
//         <Popup>
//         A pretty CSS3 popup. <br /> Static marker for test.
//         </Popup>
//       </Marker>
//   </div>
// </MapContainer>
//   );

let arr = Coordinate;
const coords =[
  {lat: 24.9946436,lng: 87.20163200000002},
  {lat: 28.7041, lng: 77.1025},
  {lat: 23.4567, lng: 75.2345}
  
]
let nGJ = GeoJson;

if (arr === undefined || arr.length === 0 || arr[0] === undefined) // || nGJ === undefined) { // checking for empty url here.
{
  return <>Still loading...</>;
}

return <LeafletMap center={[0,0]} zoom={2} style={{ height: "100vh" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />

            <GeoJSON data={nGJ} weight = {10} opacity = {1} color = "green"></GeoJSON>
            <RotatedMarker
              position={[0,0]}
              icon = {LoadIcon()}
              rotationAngle={20}
              rotationOrigin="center"
            />

        {/* {
          arr.map((cor, i) => {
            console.log("Hello " + cor._id.lat + " AND " + cor._id.lon);
            if(cor === undefined || cor._id.lat === undefined || cor._id.lat === null || cor._id.lon === undefined || cor._id.lon === null){
              return null;
            }
            return <RotatedMarker
              key = {i}
              position={[cor._id.lat,cor._id.lon]}
              icon = {LoadIcon()}
              rotationAngle={90}
              rotationOrigin="center"
            />
          })
        } */}

        {/* {
          arr.map((cor, i) => {
            // console.log("Hello " + cor._id.lat + " AND " + cor._id.lon);
            if(cor === undefined || cor._id.lat === undefined || cor._id.lat === null || cor._id.lon === undefined || cor._id.lon === null){
              return null;
            }
            return <RotatedMarker
              key = {i}
              position={[cor._id.lat,cor._id.lon]}
              icon = {LoadIcon()}
              rotationAngle={90 - cor._id.heading}
              rotationOrigin="center"
            />
          })
        } */}

        {
          arr.map((cor, i) => {
            console.log("Hello " + i + " : " + cor.icao24);
            if(cor === undefined || cor.lat === undefined || cor.lat === null || cor.lon === undefined || cor.lon === null){
              return null;
            }
            return <RotatedMarker
              key = {i}
              position={[cor.lat,cor.lon]}
              icon = {LoadIcon()}
              rotationAngle={-45 + cor.heading}
              rotationOrigin="center">
              <Popup>
                Icao : {cor.icao24}<br /> 
                Velocity : {cor.velocity}
              </Popup>
            </RotatedMarker>
          })
        }
      </LeafletMap>
}

function LoadIcon()
{
  const icon = new L.icon({
    iconSize: [20, 20],
    iconAnchor: [10, 41],
    popupAnchor: [2, -40],
    iconUrl: plane,
    shadowUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-shadow.png"
  });
  return icon;
}

async function applyCountryBorder(countryname) {

  const result = await Axios(
    "https://nominatim.openstreetmap.org/search?country=" +
        countryname.trim() +
        "&polygon_geojson=1&format=json"
  );

  console.log(result.data[0].geojson);
  return result.data[0].geojson;
      // L.geoJSON(result.data[0].geojson, {
      //   color: "green",
      //   weight: 10,
      //   opacity: 1,
      //   fillOpacity: 0.0 
      // });
}

function lerp (start, end, amt){
  return (1-amt)*start+amt*end
}


export default App;
