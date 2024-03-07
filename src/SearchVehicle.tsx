import React, { useEffect, useState } from "react";
import { getVehicleData } from "./lib/actions";
import VehicleList from "./VehicleList";
import SearchedVehicle from "./SearchedVehicle";

export default function SearchVehicle(){
    const [vin,setVin]=useState('');
    const [make,setMake]=useState('');
    const [model,setModel]=useState('');
    const [year,setYear]=useState('');
    const [hasInputError,setHasInputError] = useState(false);
    const [data,setData] = useState<any>([]);
    const [showAllVehicle,setShowAllVehicle] = useState(false);
    const showAllVinHandler = () => {
        setShowAllVehicle(!showAllVehicle);
    }
    const getVehicleDataHandler = async () => {
        setShowAllVehicle(false);
        if(vin.trim() === '' || make.trim() === '' || model.trim() === '' || year.trim() === ''){
            setHasInputError(true);
            return;
        }else{
            setHasInputError(false)
        }
        const payload = {
            vin,
            make,
            model,
            year
        }
        const res = await getVehicleData(payload);
        if(res){
            setData(res);
        }else{
            setData([])
        }
    }
    const updateFormValueHandler = (e) => {
        const id = e.target.id;
        switch (id) {
            case 'vin':
                setVin(e.target.value)
                break;
            case 'make':
                setMake(e.target.value)
                break;
            case 'model':
                setModel(e.target.value)
                break;
            case 'year':
                setYear(e.target.value)
                break;
            default:
                break;
        }
    }
    return (
        <React.Fragment>
            <div className="wrapper">
            <h1 className="heading">Search VIN</h1>
            <div className="search-wrapper">
                <div className="flex justify-between align-bottom">
                    <div className={`input-wrapper w-50 ${hasInputError && vin.trim() === '' ? 'has-error' : null}`}>
                        <label htmlFor="vin">VIN</label>
                        <input type="text" id="vin" name="vin" required value={vin} onChange={updateFormValueHandler}/>
                        <p className="input-error-msg">Please enter valid input</p>
                    </div>
                    <div className={`input-wrapper w-50 ${hasInputError && make.trim() === '' ? 'has-error' : null}`}>
                        <label htmlFor="make">Vehicle make</label>
                        <input type="text" id="make" name="make" required value={make} onChange={updateFormValueHandler}/>
                        <p className="input-error-msg">Please enter valid input</p>
                    </div>
                    <div className={`input-wrapper w-50 ${hasInputError && model.trim() === '' ? 'has-error' : null}`}>
                        <label htmlFor="model">Vehicle model</label>
                        <input type="text" id="model" name="model" required value={model} onChange={updateFormValueHandler}/>
                        <p className="input-error-msg">Please enter valid input</p>
                    </div>
                    <div className={`input-wrapper w-50 ${hasInputError && year.trim() === '' ? 'has-error' : null}`}>
                        <label htmlFor="year">Vehicle year</label>
                        <input type="text" id="year" name="year" required value={year} onChange={updateFormValueHandler}/>
                        <p className="input-error-msg">Please enter valid input</p>
                    </div>
                    <div className="actions">
                        <div className="button" onClick={getVehicleDataHandler}>Search</div>
                    </div>
                </div>
            </div>
            {data.length > 0 && (
                <SearchedVehicle vdata={data}/>
            )}
            <span className="show-all" onClick={showAllVinHandler}>{showAllVehicle ? 'Hide All VIN List' : 'Show All VIN List'}</span>
            {showAllVehicle && <VehicleList/>}
            </div>
        </React.Fragment>
    )
}