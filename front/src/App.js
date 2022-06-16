import react from "react";
import {
  MapContainer,
  TileLayer,
  useMap,
  Marker,
  Popup
} from 'react-leaflet';
import {useState, useEffect} from "react";
import './App.css'
import  Axios from "axios";
import MarkerPos from './MapComp/MarkerPos'

function App() {
  const [Coordinate, setCoordinate] = useState([]);
  const fetchItems = async () => {
    const result = await Axios(
     "http://localhost:3001/live"
   ); 
   setCoordinate(result.data);
   console.log(result.data)
 };
  useEffect(()=>{
    fetchItems();
    const interval = setInterval(() => {
      fetchItems();
      console.log('This will be called every 30 seconds');
    }, 60000);
  
    return () => clearInterval(interval);
    
  }, []);
  


  return (
    
    <MapContainer center={[51.5, 7.962935164168075]} zoom={13} style = {{height: '100vh', width:'100wh'}}>
  <TileLayer
    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  />

  <MarkerPos Coordinate={Coordinate} />
  
</MapContainer>
  );
}

export default App;
