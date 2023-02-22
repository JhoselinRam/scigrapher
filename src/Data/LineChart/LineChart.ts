import { RecursivePartial } from "../../Graph2D/Graph2D_Types";
import Draw from "./Draw/Draw.js";
import { Line_Chart, Line_Chart_Options, Line_Chart_State } from "./LineChart_Types";

const defaultOptions : Line_Chart_Options = {
    useAxis : {x:"primary", y:"primary"},
    marker : {
        enable : true,
        color : "#0043e0",
        opacity : 1,
        filled : false,
        size : 3,
        type : "star"
    },
    line : {
        enable : true,
        color : "#0043e0",
        opacity : 1,
        style : "solid",
        width : 1
    },
    x : [],
    y : [],
    polar : false
    
};

export function LineChart(options : RecursivePartial<Line_Chart_Options> = {}) : Line_Chart{
    //State of the data set
    const dataState : Line_Chart_State = {
        ...defaultOptions, ...options,
        id : crypto.randomUUID(),
        useAxis : {...defaultOptions.useAxis, ...options.useAxis},
        marker : {...defaultOptions.marker, ...options.marker},
        line : {...defaultOptions.line, ...options.line},
        x : options.x != null ? options.x as Array<number> : [],
        y : options.y != null ? options.y as Array<number> : [],
    };  
    //Main handler
    const dataHandler : RecursivePartial<Line_Chart> = {};

    //Method generators
    const draw = Draw({dataHandler : dataHandler as Line_Chart, dataState : dataState as Line_Chart_State});

    //Main handler population
    dataHandler._drawData = draw._drawData;


//---------------------------------------------

    return dataHandler as Line_Chart
}