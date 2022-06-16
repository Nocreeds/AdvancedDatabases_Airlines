import React from 'react'
import L from 'leaflet'
import  Axios from "axios";
import { useState } from 'react';
import { Marker, Popup } from 'react-leaflet';

const markericon = new L.icon({
    iconUrl: require("./airplane.png"),
    iconSize: [20,20],
    
})
const markericon2 = new L.icon({
    iconUrl: require("./airplanered.png"),
    iconSize: [50,50],
    
})

export default function MarkerPos({Coordinate}){
    console.log("updating location")
    const [Craft, setCraft] = useState([]);
     return (
            Coordinate.map(cor =>{
            if(cor[5] != null && cor[6] != null && cor[11]<-20){
            return ( 
            <Marker 
            eventHandlers={{
                click: async (e) =>{
                    try {
                        const result =   await Axios(
                            "http://localhost:3001/Aircraft/"+cor[0]
                          ); 
                          if(result.data != null){
                          setCraft(result.data);}else {
                              setCraft("none")
                          }
                          console.log(result.data)
                    }
                    catch(err){
                        console.log(err)
                    }
                }
            }}
            key = {cor[0]} 
            position = {[cor[6],cor[5]]} 
            icon = {markericon2}
            >
                <Popup>
                    icao24: {cor[0]}<br />
                    callsign: {cor[1]}<br />
                    origin_country: {cor[2]}<br />
                    time_position: {Date(cor[3] * 1000)}<br /><br />
                    last_contact: {Date(cor[4] * 1000)}<br /><br />
                    baro_altitude: {cor[7]} meters<br />
                    longitude: {cor[5]}<br />
                    latitude: {cor[6]}<br />
                    vertical_rate: {cor[11]}<br />
                    owner: {Craft.owner} <br />
                </Popup>
            </Marker>
            )} else if(cor[5] != null && cor[6] != null) {
                return ( 
                    <Marker 
                    key = {cor[0]} 
                    position = {[cor[6],cor[5]]} 
                    icon = {markericon}
                    >
                        <Popup>
                            icao24: {cor[0]}<br />
                            callsign: {cor[1]}<br />
                            origin_country: {cor[2]}<br />
                            time_position: {Date(cor[3] * 1000)}<br /><br />
                            last_contact: {Date(cor[4] * 1000)}<br /><br />
                            baro_altitude: {cor[7]} meters<br />
                            longitude: {cor[5]}<br />
                            latitude: {cor[6]}<br />
                            vertical_rate: {cor[11]}<br />
                        </Popup>
                    </Marker>
                    )
            }
            })
     
       
     )
    
}