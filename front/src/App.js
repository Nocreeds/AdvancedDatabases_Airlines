import React, { useState, useEffect } from "react";
import { Map as LeafletMap, TileLayer } from "react-leaflet";
import L from "leaflet"

import RotatedMarker from "./RotatedMarker";

import './App.css'
import  Axios from "axios";
import plane from './Icons/plane.png'

function App() {
  const [Coordinate, setCoordinate] = useState([]);
  useEffect(()=>{
    const fetchItems = async () => {
      const result = await Axios(
        "http://localhost:3001/getAllLimit"
      );
      setCoordinate(result.data);
      console.log(result.data);
      
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

if (arr === undefined || arr.length === 0 || arr[0] === undefined) { // checking for empty url here.
  return <>Still loading...</>;
}

return <LeafletMap center={[51,10]} zoom={13} style={{ height: "100vh" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />

            <RotatedMarker
              position={[0,0]}
              icon = {LoadIcon()}
              rotationAngle={20}
              rotationOrigin="center"
            />

        {
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

export default App;
