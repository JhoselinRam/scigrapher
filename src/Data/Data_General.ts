import { Graph2D } from "../Graph2D/Graph2D_Types";
import { Dataset_States, Dataset_Types, Data_General, Data_General_Generator } from "./Data_Types";

function DataGeneral<T extends Dataset_Types, P extends Dataset_States>({dataHandler, dataState, graphHandler} : Data_General_Generator<T,P>) : Data_General<T>{

//------------------- Id ----------------------

    function id(id:string, callback?:(handler?:T, graph?:Graph2D)=>void):T;
    function id(arg:void):string;
    function id(id:string|void, callback?:(handler?:T, graph?:Graph2D)=>void):T|string|undefined{
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

    function index(index : number, callback?:(handler?:T, graph?:Graph2D)=>void) : T;
    function index(arg:void) : number;
    function index(index : number | void, callback?:(handler?:T, graph?:Graph2D)=>void) : T | number | undefined{
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