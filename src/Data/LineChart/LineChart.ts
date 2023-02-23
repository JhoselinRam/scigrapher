import {RecursivePartial } from "../../Graph2D/Graph2D_Types";
import DataGeneral from "../Data_General.js";
import { Draw_Data_Callback } from "../Data_Types";
import DrawLine from "./resourses/Draw_Line/Draw_Line.js";
import { Line_Chart, Line_Chart_Options, Line_Chart_State, Line_Char_Data, Marker_Size } from "./LineChart_Types";
import BindLine from "./resourses/Bind_Line/Bind_Line.js";

const defaultOptions : Line_Chart_Options = {
    useAxis : {x:"primary", y:"primary"},
    marker : {
        enable : true,
        color : "#0043e0",
        opacity : 1,
        filled : false,
        size : 1,
        type : "circle"
    },
    line : {
        enable : false,
        color : "#0043e0",
        opacity : 1,
        style : "solid",
        width : 1
    },
    polar : false,
    data : {
        x :  [],
        y :  []
    }
};

export function LineChart(options : RecursivePartial<Line_Chart_Options>, dirtify:(sort?:boolean)=>void) : [Line_Chart, Draw_Data_Callback]{
    //State of the data set
    const dataState : Line_Chart_State = {
        ...defaultOptions, ...options,
        id : crypto.randomUUID(),
        index : 0,
        dirtify,
        useAxis : {...defaultOptions.useAxis, ...options.useAxis},
        marker : {...defaultOptions.marker, ...options.marker, size : options.marker?.size==null? defaultOptions.marker.size : options.marker.size as Marker_Size},
        line : {...defaultOptions.line, ...options.line},
        data : {
            x : options.data?.x == null ? [] : options.data.x as Line_Char_Data,
            y : options.data?.y == null ? [] : options.data.y as Line_Char_Data
        }
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
    dataHandler.markerSize = bind.markerSize;


//---------------------------------------------

    return [dataHandler as Line_Chart, draw.drawData];
}