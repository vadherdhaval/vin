import React from "react";
import useLocalStorage from "./useLocalStorage";


export default function VehicleList(props:any){
    const [vdata, setVData] = useLocalStorage("vehicleData", []);
    // setVData((prevData) => [...prevData,res[0]])
    const deleteDataHandler = (data) => {
        const updatedData = vdata.filter(el => el.VIN !== data.VIN);
        setVData([...updatedData])
    }
    return (
        <div className="table">
            <div className="table-header">
                <div>VIN</div>
                <div>Make</div>
                <div>Model</div>
                <div>Year</div>
                <div></div>
            </div>
            {vdata.length <1 && (
                <div className="table-row no-data">No Data</div>
            )}
            {vdata.map((el:any) => 
                <div className="table-row">
                    <div>{el.VIN}</div>
                    <div>{el.Make}</div>
                    <div>{el.Model}</div>
                    <div>{el.ModelYear}</div>
                    <div>
                    <svg onClick={() => deleteDataHandler(el)} width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_2571_21701)">
                    <path d="M4.74992 15.0417C4.74992 15.9125 5.46242 16.625 6.33325 16.625H12.6666C13.5374 16.625 14.2499 15.9125 14.2499 15.0417V5.54167H4.74992V15.0417ZM15.0416 3.16667H12.2708L11.4791 2.375H7.52075L6.72909 3.16667H3.95825V4.75H15.0416V3.16667Z" fill="#707683"/>
                    </g>
                    <defs>
                    <clipPath id="clip0_2571_21701">
                    <rect width="19" height="19" fill="white"/>
                    </clipPath>
                    </defs>
                    </svg>
                    </div>
                </div>
            )}
        </div>
    )
}