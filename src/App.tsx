import React, { useEffect } from "react";
import SearchVehicle from "./SearchVehicle";

export default function App(){
    useEffect(() => {
        if(localStorage.getItem('vehicleData') === null){
            localStorage.setItem('vehicleData',JSON.stringify([]))
        }
    },[])
    return (
        <SearchVehicle/>
    )
}