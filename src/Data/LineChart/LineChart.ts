import {RecursivePartial } from "../../Graph2D/Graph2D_Types";
import DataGeneral from "../Data_General.js";
import { Draw_Data_Callback } from "../Data_Types";
import DrawLine from "./resourses/Draw_Line/Draw_Line.js";
import { Line_Chart, Line_Chart_Options, Line_Chart_State, Partialize } from "./LineChart_Types";
import DataLine from "./resourses/Data_Line/Data_Line.js";
import MarkerLine from "./resourses/Marker_Line/Marker_Line.js";

const defaultOptions : Line_Chart_Options = {
    useAxis : {x:"primary", y:"primary"},
    marker : {
        enable : true,
        color : "#0043e0",
        opacity : 1,
        filled : false,
        size : 1,
        type : "circle",
        width : 1,
        style : "solid"
    },
    line : {
        enable : true,
        color : "#0043e0",
        opacity : 1,
        style : "solid",
        width : 1
    },
    polar : false,
    data : {
        x :  [],
        y :  []
    },
    errorBar : {
        type : "tail-cross",
        x : {
            enable : true,
            color : "#666666",
            opacity : 1,
            style: "solid",
            width : 1,
            data : 0.1
        },
        y : {
            enable : true,
            color : "#666666",
            opacity : 1,
            style: "solid",
            width : 1,
            data : 0.2
        }
    }
};

export function LineChart(options : Partialize<Line_Chart_Options>, dirtify:(sort?:boolean)=>void) : [Line_Chart, Draw_Data_Callback]{
    //State of the data set
    const dataState : Line_Chart_State = {
        ...defaultOptions, ...options,
        id : crypto.randomUUID(),
        index : 0,
        dirtify,
        useAxis : {...defaultOptions.useAxis, ...options.useAxis},
        marker : {...defaultOptions.marker, ...options.marker},
        line : {...defaultOptions.line, ...options.line},
        data : {...defaultOptions.data, ...options.data},
        errorBar : {
            ...defaultOptions.errorBar , ...options.errorBar,
            x : { ...defaultOptions.errorBar.x, ...options.errorBar?.x },
            y : { ...defaultOptions.errorBar.y, ...options.errorBar?.y },
        }
    };  
    //Main handler
    const dataHandler : RecursivePartial<Line_Chart> = {};

    //Method generators
    const general = DataGeneral<Line_Chart,Line_Chart_State>({dataHandler : dataHandler as Line_Chart, dataState});
    const draw = DrawLine({dataHandler : dataHandler as Line_Chart, dataState});
    const data = DataLine({dataHandler : dataHandler as Line_Chart, dataState});
    const marker = MarkerLine({dataHandler : dataHandler as Line_Chart, dataState});


    //Main handler population
    dataHandler.id = general.id;
    dataHandler.index = general.index;
    dataHandler.xData = data.xData;
    dataHandler.yData = data.yData;
    dataHandler.markerSize = marker.markerSize;
    dataHandler.markerColor = marker.markerColor;
    dataHandler.markerOpacity = marker.markerOpacity;
    dataHandler.markerWidth = marker.markerWidth;
    dataHandler.markerStyle = marker.markerStyle;
    dataHandler.markerType = marker.markerType;
    dataHandler.markerFilled = marker.markerFilled;
    dataHandler.markerEnable = marker.markerEnable;


//---------------------------------------------

    return [dataHandler as Line_Chart, draw.drawData];
}