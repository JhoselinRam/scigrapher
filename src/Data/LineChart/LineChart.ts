import {RecursivePartial } from "../../Graph2D/Graph2D_Types";
import DataGeneral from "../Data_General.js";
import { Draw_Data_Callback } from "../Data_Types";
import DrawLine from "./resourses/Draw_Line/Draw_Line.js";
import { Line_Chart, Line_Chart_Options, Line_Chart_State } from "./LineChart_Types";
import BindLine from "./resourses/Bind_Line/Bind_Line.js";

const defaultOptions : Line_Chart_Options = {
    useAxis : {x:"primary", y:"primary"},
    marker : {
        enable : false,
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
    polar : true
    
};

export function LineChart(options : RecursivePartial<Line_Chart_Options>, dirtify:(sort?:boolean)=>void) : [Line_Chart, Draw_Data_Callback]{
    //State of the data set
    const dataState : Line_Chart_State = {
        ...defaultOptions, ...options,
        id : crypto.randomUUID(),
        x :  [],
        y :  [],
        index : 0,
        dirtify,
        useAxis : {...defaultOptions.useAxis, ...options.useAxis},
        marker : {...defaultOptions.marker, ...options.marker},
        line : {...defaultOptions.line, ...options.line}
    };  
    //Main handler
    const dataHandler : RecursivePartial<Line_Chart> = {};

    //Method generators
    const general = DataGeneral<Line_Chart,Line_Chart_State>({dataHandler : dataHandler as Line_Chart, dataState : dataState as Line_Chart_State});
    const draw = DrawLine({dataHandler : dataHandler as Line_Chart, dataState : dataState as Line_Chart_State});
    const bind = BindLine({dataHandler : dataHandler as Line_Chart, dataState : dataState as Line_Chart_State});


    //Main handler population
    dataHandler.id = general.id;
    dataHandler.index = general.index;
    dataHandler.data = bind.data;


//---------------------------------------------

    return [dataHandler as Line_Chart, draw.drawData];
}