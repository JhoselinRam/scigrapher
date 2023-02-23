import { Axis_Property } from "../../../../Graph2D/Graph2D_Types";
import { isCallable } from "../../../../tools/Helplers/Helplers.js";
import { Line_Chart, Line_Chart_Method_Generator, Line_Char_Data, Marker_Size } from "../../LineChart_Types";
import { Bind_Line } from "./Bind_Line_Types";

function BindLine({dataHandler, dataState}:Line_Chart_Method_Generator) : Bind_Line{

//----------------- Data ----------------------

    function data(data : Partial<Axis_Property<Line_Char_Data>>, callback?:(handler?:Line_Chart)=>void) : Line_Chart;
    function data(arg:void) : Axis_Property<Array<number>>;
    function data(data : Partial<Axis_Property<Line_Char_Data>> | void, callback?:(handler?:Line_Chart)=>void) : Line_Chart | Axis_Property<Array<number>> | undefined {
        if(typeof data === "undefined" && callback == null){
            const xData = isCallable(dataState.data.x)? dataState.data.x() : dataState.data.x.slice();
            const yData = isCallable(dataState.data.y)? dataState.data.y() : dataState.data.y.slice();

            return {x : xData, y:yData};
        }

        if(typeof data === "object"){
            if(data.x == null && data.y == null) return dataHandler;
            
            if(data.x != null) dataState.data.x = isCallable(data.x)? data.x : data.x.slice();
            if(data.y != null) dataState.data.y = isCallable(data.y)? data.y : data.y.slice();

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
        if(typeof size === "undefined" && callback==null)
            return typeof dataState.marker.size === "number"? dataState.marker.size : (isCallable(dataState.marker.size)? dataState.marker.size() : dataState.marker.size.slice());

        if(typeof size !== "undefined"){
            
            dataState.marker.size = typeof size === "object"? size.slice() : size;
            
            if(callback != null) callback(dataHandler);
            dataState.dirtify();
            return dataHandler;
        }
    }

//---------------------------------------------

    return {
        data,
        markerSize
    };
}

export default BindLine;