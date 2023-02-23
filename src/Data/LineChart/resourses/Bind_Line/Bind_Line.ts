import { Axis_Property } from "../../../../Graph2D/Graph2D_Types";
import { isCallable } from "../../../../tools/Helplers/Helplers.js";
import { Line_Chart, Line_Chart_Method_Generator, Line_Char_Data } from "../../LineChart_Types";
import { Bind_Line } from "./Bind_Line_Types";

function BindLine({dataHandler, dataState}:Line_Chart_Method_Generator) : Bind_Line{

//----------------- Data ----------------------

    function data(data : Partial<Axis_Property<Line_Char_Data>>) : Line_Chart;
    function data(arg:void) : Axis_Property<Array<number>>;
    function data(data : Partial<Axis_Property<Line_Char_Data>> | void) : Line_Chart | Axis_Property<Array<number>> | undefined {
        if(typeof data === "undefined"){
            const xData = isCallable(dataState.x)? dataState.x() : dataState.x.slice();
            const yData = isCallable(dataState.y)? dataState.y() : dataState.y.slice();

            return {x : xData, y:yData};
        }

        if(typeof data === "object"){
            if(data.x == null && data.y == null) return dataHandler;
            
            if(data.x != null) dataState.x = isCallable(data.x)? data.x : data.x.slice();
            if(data.y != null) dataState.y = isCallable(data.y)? data.y : data.y.slice();

            dataState.dirtify();
            return dataHandler;
        }
    }

//---------------------------------------------

    return {
        data
    };
}

export default BindLine;