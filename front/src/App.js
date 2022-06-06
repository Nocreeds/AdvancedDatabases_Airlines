import react from "react";
import {
  MapContainer,
  TileLayer,
  useMap,
  Marker,
  Popup
} from 'react-leaflet';
import {useState, useEffect} from "react";
import 'leaflet/dist/leaflet.css';
import './App.css'
import  Axios from "axios";

function App() {
  const [coordinate, Setcoordinate] = useState([]);
  useEffect(()=>{
    Axios.get("http://localhost:3001/getLoc").then((respone) =>{
      Setcoordinate(respone.data);
    });
  }, []);
  console.log("oof",coordinate);


  return (
    
    <MapContainer center={[51.505, -0.09]} zoom={13} style = {{height: '100vh', width:'100wh'}}>
  <TileLayer
    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  />
  {coordinate.map(cor =>{
    
    <Marker position={[coordinate.lat, coordinate.lon]}>
    <Popup>
      A pretty CSS3 popup. <br /> Easily customizable.
    </Popup>
  </Marker>

  })}
  
</MapContainer>
  );
}

export default App;
