import { Dataset_States, Dataset_Types, Data_General, Data_General_Generator } from "./Data_Types";

function DataGeneral<T extends Dataset_Types, P extends Dataset_States>({dataHandler, dataState, graphHandler} : Data_General_Generator<T,P>) : Data_General<T>{

//------------------- Id ----------------------

    function id() : string{
        return dataState.id;
    }

//---------------------------------------------
//---------------- Index ----------------------

    function index(index : number, callback?:(handler:T)=>void) : T;
    function index(arg:void) : number;
    function index(index : number | void, callback?:(handler:T)=>void) : T | number | undefined{
        if(typeof index === "undefined" && callback == null)
            return dataState.index;
        
        if(typeof index === "number"){
            dataState.index = index;
            if(callback != null) callback(dataHandler);
            dataState.dirtify(true);
            return dataHandler;
        }
    }

//---------------------------------------------

    return {
        id,
        index
    }
}

export default DataGeneral;