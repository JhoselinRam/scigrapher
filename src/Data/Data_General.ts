import { Area } from "./Area/Area_Types";
import { Dataset_Callback, Dataset_States, Dataset_Types, Data_General, Data_General_Generator } from "./Data_Types";
import { Heat_Map } from "./HeatMap/Heat_Map_Types";
import { Line_Chart } from "./LineChart/LineChart_Types";
import { Vector_Field } from "./VectorField/Vector_Field_Types";

function DataGeneral<T extends Dataset_Types, P extends Dataset_States>({dataHandler, dataState, graphHandler} : Data_General_Generator<T,P>) : Data_General<T>{

//------------------- Id ----------------------

    function id(id:string, callback?:Dataset_Callback<T>):T;
    function id(arg:void):string;
    function id(id:string|void, callback?:Dataset_Callback<T>):T|string|undefined{
        if(typeof id === "undefined" && callback == null)
            return dataState.id;
        if(typeof id === "string")
            dataState.id = id;
            if(callback != null) callback(dataHandler, graphHandler);
            dataState.dirtify();
            return dataHandler;
    }

//---------------------------------------------
//---------------- Index ----------------------

    function index(index : number, callback?:Dataset_Callback<T>) : T;
    function index(arg:void) : number;
    function index(index : number | void, callback?:Dataset_Callback<T>) : T | number | undefined{
        if(typeof index === "undefined" && callback == null)
            return dataState.index;
        
        if(typeof index === "number"){
            dataState.index = index;
            if(callback != null) callback(dataHandler, graphHandler);
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