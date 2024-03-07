import {APIClient} from './apiClient';
const apiClient = new APIClient('https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues');

function hasMissmatchData(prev,curr){
    const lowerCaseData = prev.map(el => el.toLowerCase());
    return lowerCaseData.indexOf(curr.toLowerCase()) > -1;
}

function missMatch(formData,aData){
    const apiData = {...aData[0]};
    const makeMissMatch = formData.make.toLowerCase() !== apiData.Make.toLowerCase() && formData.make !== '' ? formData.make : null;
    const modelMissMatch = formData.model.toLowerCase() !== apiData.Model.toLowerCase() && formData.model !== '' ? formData.model : null;
    const yearMissMatch = formData.year.toLowerCase() !== apiData.ModelYear.toLowerCase() && formData.year !== '' ? formData.year : null;
    if(apiData.missMatchData){
        return {
            makeError: makeMissMatch !== null && !hasMissmatchData(apiData.missMatchData.makeError,makeMissMatch) ? [...apiData.missMatchData.makeError, makeMissMatch] : [...apiData.missMatchData.makeError],
            modelError: modelMissMatch !== null && !hasMissmatchData(apiData.missMatchData.modelError,modelMissMatch) ? [...apiData.missMatchData.modelError, modelMissMatch] : [...apiData.missMatchData.modelError],
            yearError: yearMissMatch !== null && !hasMissmatchData(apiData.missMatchData.yearError,yearMissMatch) ? [...apiData.missMatchData.yearError, yearMissMatch] : [...apiData.missMatchData.yearError],
        }
    }else{
        return {
            makeError: makeMissMatch !== null ? [makeMissMatch] : [],
            modelError: modelMissMatch !== null ? [modelMissMatch] : [],
            yearError: yearMissMatch !== null ? [yearMissMatch] : [],
        }
    }
}

function checkVINLocalDb(data){
    const vehicleData = JSON.parse(localStorage.getItem('vehicleData'));
    let localData = vehicleData ? vehicleData.filter(v => v.VIN === data.vin) : [];
    if(localData.length > 0){
        localData = localData.map(el => ({
            ...el,
            isMatch: data.vin === el.VIN && 
            data.make.toLowerCase() === el.Make.toLowerCase() && 
            data.model.toLowerCase() === el.Model.toLowerCase() && 
            data.year.toLowerCase() === el.ModelYear.toLowerCase(),
            isMakeMatch: data.make.toLowerCase() === el.Make.toLowerCase(),
            isModelMatch: data.model.toLowerCase() === el.Model.toLowerCase(),
            isYearMatch: data.year.toLowerCase() === el.ModelYear.toLowerCase(),
            missMatchData: missMatch(data,localData)
        }))
    }
    const allData = vehicleData.map(el => el.VIN === data.vin ? localData[0]: el)
    localStorage.setItem('vehicleData',JSON.stringify(allData))
    return localData
}
function postDataToLocal(data,vehicleInfoData){
    const updatedData = data.Results.map(el => ({
        VIN: el.VIN,
        Make: el.Make,
        MakeID: el.MakeID,
        Model: el.Model,
        ModelID: el.ModelID,
        ModelYear: el.ModelYear,
        isMatch: (vehicleInfoData.year !== '' && vehicleInfoData.make !== '' && vehicleInfoData.model !== '') ? (
            vehicleInfoData.vin === el.VIN && 
            vehicleInfoData.make.toLowerCase() === el.Make.toLowerCase() && 
            vehicleInfoData.model.toLowerCase() === el.Model.toLowerCase() && 
            vehicleInfoData.year.toLowerCase() === el.ModelYear.toLowerCase()
        ) : true,
        isMakeMatch: vehicleInfoData.make.toLowerCase() === el.Make.toLowerCase(),
        isModelMatch: vehicleInfoData.model.toLowerCase() === el.Model.toLowerCase(),
        isYearMatch: vehicleInfoData.year.toLowerCase() === el.ModelYear.toLowerCase(),
        errorText: el.ErrorText,
        missMatchData: missMatch(vehicleInfoData,[el])
    }));
    const vdata = JSON.parse(localStorage.getItem('vehicleData'));
    const vehicleData = [...vdata, ...updatedData];
    localStorage.setItem('vehicleData',JSON.stringify(vehicleData))
    return updatedData
}
export async function getVehicleData(vehicleInfoData){
    const localData = checkVINLocalDb(vehicleInfoData);
    if(localData.length > 0){
        return localData
    }
    const res = await apiClient.fetchData(vehicleInfoData.vin);
    return postDataToLocal(res,vehicleInfoData);
}