import { Axis_Property, graphCallback } from "../../../../Graph2D/Graph2D_Types.js";
import { isCallable } from "../../../../tools/Helplers/Helplers.js";
import { Line_Chart, Line_Chart_Callback, Line_Chart_Method_Generator, Line_Char_Data } from "../../LineChart_Types";
import { Data_Line } from "./Data_Line_Types";

function DataLine({dataHandler, dataState, graphHandler} : Line_Chart_Method_Generator) : Data_Line{
    
//---------------- X Data ---------------------

    function dataX(data : Line_Char_Data, callback?:Line_Chart_Callback) : Line_Chart;
    function dataX(arg:void) : Array<number>;
    function dataX(data : Line_Char_Data | void, callback?:Line_Chart_Callback) : Line_Chart | Array<number> | undefined {
        if(typeof data === "undefined" && callback == null){
            const xData = isCallable(dataState.data.x)? dataState.data.x(dataHandler, graphHandler) : dataState.data.x.slice();
            return xData;
        }

        if(typeof data === "object" || typeof data === "function"){
            dataState.data.x = isCallable(data)? data : data.slice();

            if(callback != null) callback(dataHandler, graphHandler);
            dataState.dirtify();
            
            return dataHandler;
        }
    }

//---------------------------------------------
//---------------- Y Data ---------------------

    function dataY(data : Line_Char_Data, callback?:Line_Chart_Callback) : Line_Chart;
    function dataY(arg:void) : Array<number>;
    function dataY(data : Line_Char_Data | void, callback?:Line_Chart_Callback) : Line_Chart | Array<number> | undefined {
        if(typeof data === "undefined" && callback == null){
            const yData = isCallable(dataState.data.y)? dataState.data.y(dataHandler, graphHandler) : dataState.data.y.slice();
            return yData;
        }

        if(typeof data === "object" || typeof data === "function"){
            dataState.data.y = isCallable(data)? data : data.slice();

            if(callback != null) callback(dataHandler, graphHandler);
            dataState.dirtify();

            return dataHandler;
        }
    }

//---------------------------------------------
//---------------- Axis Used ------------------

    function axisUsed(axis:Partial<Axis_Property<"primary" | "secondary">>, callback?:Line_Chart_Callback) : Line_Chart;
    function axisUsed(arg:void) : Axis_Property<"primary" | "secondary">;
    function axisUsed(axis:Partial<Axis_Property<"primary" | "secondary">> | void, callback?:Line_Chart_Callback) : Line_Chart | Axis_Property<"primary" | "secondary"> | undefined{
        if(typeof axis === "undefined" && callback == null)
            return {...dataState.useAxis};
        
        if(typeof axis === "object"){
            if(axis.x == null && axis.y == null) return dataHandler;
            if(axis.x === dataState.useAxis.x && axis.y === dataState.useAxis.y) return dataHandler;

            if(axis.x != null) dataState.useAxis.x = axis.x;
            if(axis.y != null) dataState.useAxis.y = axis.y;

            if(callback != null) callback(dataHandler, graphHandler);
            dataState.dirtify();
            return dataHandler;
        }
    }

//---------------------------------------------

    return {
        dataX,
        dataY,
        axisUsed
    }
}

export default DataLine;