import { isCallable } from "../../../../tools/Helplers/Helplers.js";
import { Line_Chart, Line_Chart_Method_Generator, Line_Char_Data } from "../../LineChart_Types";
import { Data_Line } from "./Data_Line_Types";

function DataLine({dataHandler, dataState} : Line_Chart_Method_Generator) : Data_Line{
    //---------------- X Data ---------------------

    function xData(data : Line_Char_Data, callback?:(handler?:Line_Chart)=>void) : Line_Chart;
    function xData(arg:void) : Array<number>;
    function xData(data : Line_Char_Data | void, callback?:(handler?:Line_Chart)=>void) : Line_Chart | Array<number> | undefined {
        if(typeof data === "undefined" && callback == null){
            const xData = isCallable(dataState.data.x)? dataState.data.x(dataHandler) : dataState.data.x.slice();
            return xData;
        }

        if(typeof data === "object" || typeof data === "function"){
            dataState.data.x = isCallable(data)? data : data.slice();

            if(callback != null) callback(dataHandler);
            dataState.dirtify();
            
            return dataHandler;
        }
    }

//---------------------------------------------
//---------------- Y Data ---------------------

    function yData(data : Line_Char_Data, callback?:(handler?:Line_Chart)=>void) : Line_Chart;
    function yData(arg:void) : Array<number>;
    function yData(data : Line_Char_Data | void, callback?:(handler?:Line_Chart)=>void) : Line_Chart | Array<number> | undefined {
        if(typeof data === "undefined" && callback == null){
            const yData = isCallable(dataState.data.y)? dataState.data.y(dataHandler) : dataState.data.y.slice();
            return yData;
        }

        if(typeof data === "object" || typeof data === "function"){
            dataState.data.y = isCallable(data)? data : data.slice();

            if(callback != null) callback(dataHandler);
            dataState.dirtify();

            return dataHandler;
        }
    }

//---------------------------------------------

    return {
        xData,
        yData
    }
}

export default DataLine;