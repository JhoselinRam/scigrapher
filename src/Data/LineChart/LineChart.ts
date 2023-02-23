import { RecursivePartial } from "../../Graph2D/Graph2D_Types";
import DataGeneral from "../Data_General.js";
import { SetPartial } from "../Data_Types";
import Draw from "./Draw/Draw.js";
import { Line_Chart, Line_Chart_Options, Line_Chart_State } from "./LineChart_Types";

const defaultOptions : Line_Chart_Options = {
    useAxis : {x:"primary", y:"primary"},
    marker : {
        enable : true,
        color : "#0043e0",
        opacity : 1,
        filled : true,
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
    polar : false
    
};

export function LineChart(options : RecursivePartial<Line_Chart_Options> = {}) : Line_Chart{
    //State of the data set
    const dataState : SetPartial<Line_Chart_State, "dirtify"> = {
        ...defaultOptions, ...options,
        id : crypto.randomUUID(),
        x :  [-3,-2,-1,0,1,2,3],
        y :  [-3,-2,-1,0,1,2,3],
        index : 0,
        useAxis : {...defaultOptions.useAxis, ...options.useAxis},
        marker : {...defaultOptions.marker, ...options.marker},
        line : {...defaultOptions.line, ...options.line}
    };  
    //Main handler
    const dataHandler : RecursivePartial<Line_Chart> = {};

    //Method generators
    const general = DataGeneral<Line_Chart,Line_Chart_State>({dataHandler : dataHandler as Line_Chart, dataState : dataState as Line_Chart_State});
    const draw = Draw({dataHandler : dataHandler as Line_Chart, dataState : dataState as Line_Chart_State});


    //Main handler population
    dataHandler._drawData = draw._drawData; //For internal use only
    dataHandler.id = general.id;
    dataHandler.index = general.index;
    dataHandler._setDirtifyCallback = general._setDirtifyCallback; //For internal use only


//---------------------------------------------

    return dataHandler as Line_Chart
}