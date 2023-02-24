import { Axis_Property } from "../../../../Graph2D/Graph2D_Types";
import { isCallable } from "../../../../tools/Helplers/Helplers.js";
import { Line_Chart, Line_Chart_Method_Generator, Line_Char_Data, Marker_Size } from "../../LineChart_Types";
import { Bind_Line } from "./Bind_Line_Types";

function BindLine({dataHandler, dataState}:Line_Chart_Method_Generator) : Bind_Line{

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
//---------------------------------------------

    function markerSize(size : Marker_Size, callback?:(handler?:Line_Chart)=>void):Line_Chart;
    function markerSize(arg:void) : number | Array<number>;
    function markerSize(size : Marker_Size | void, callback?:(handler?:Line_Chart)=>void) : Line_Chart | number | Array<number> | undefined{
        if(typeof size === "undefined" && callback==null){
            if(typeof dataState.marker.size==="number"){
                return dataState.marker.size;
            } else if(isCallable(dataState.marker.size)){
                const xPositions = xData();
                const y = yData();
                const callback = dataState.marker.size;

                return xPositions.map((x,i)=>callback(x,y[i],i,dataHandler));
            }else{
                return dataState.marker.size.slice();
            }

        }

        if(typeof size !== "undefined"){
            
            dataState.marker.size = typeof size === "object"? size.slice() : size;
            
            if(callback != null) callback(dataHandler);
            dataState.dirtify();
            return dataHandler;
        }
    }

//---------------------------------------------

    return {
        xData,
        yData,
        markerSize
    };
}

export default BindLine;