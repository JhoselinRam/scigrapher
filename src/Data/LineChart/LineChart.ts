import {Graph2D, RecursivePartial } from "../../Graph2D/Graph2D_Types";
import DataGeneral from "../Data_General.js";
import { Draw_Data_Callback, Partialize } from "../Data_Types";
import DrawLine from "./resourses/Draw_Line/Draw_Line.js";
import { Line_Chart, Line_Chart_Options, Line_Chart_State } from "./LineChart_Types";
import DataLine from "./resourses/Data_Line/Data_Line.js";
import MarkerLine from "./resourses/Marker_Line/Marker_Line.js";
import ErrorLine from "./resourses/Error_Line/Error_Line.js";
import Line from "./resourses/Line/Line.js";

const defaultOptions : Line_Chart_Options = {
    useAxis : {x:"primary", y:"primary"},
    marker : {
        enable :false,
        color : "#0043e0",
        opacity : 1,
        filled : true,
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
            enable : false,
            color : "#666666",
            opacity : 1,
            style: "solid",
            width : 1,
            data : 0
        },
        y : {
            enable : false,
            color : "#666666",
            opacity : 1,
            style: "solid",
            width : 1,
            data : 0
        }
    }
};

export function LineChart(options : Partialize<Line_Chart_Options>, graphHandler : Graph2D, dirtify:(sort?:boolean)=>void) : [Line_Chart, Draw_Data_Callback]{
    //State of the data set
    const dataState : Line_Chart_State = {
        ...defaultOptions, ...options,
        id : crypto.randomUUID(),
        index : 0,
        datasetType : "linechart",
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
    const general = DataGeneral<Line_Chart,Line_Chart_State>({dataHandler : dataHandler as Line_Chart, dataState, graphHandler});
    const draw = DrawLine({dataHandler : dataHandler as Line_Chart, dataState, graphHandler});
    const data = DataLine({dataHandler : dataHandler as Line_Chart, dataState, graphHandler});
    const marker = MarkerLine({dataHandler : dataHandler as Line_Chart, dataState, graphHandler});
    const error = ErrorLine({dataHandler : dataHandler as Line_Chart, dataState, graphHandler});
    const line = Line({dataHandler : dataHandler as Line_Chart, dataState, graphHandler});


    //Main handler population
    dataHandler.id = general.id;
    dataHandler.index = general.index;
    dataHandler.dataX = data.dataX;
    dataHandler.dataY = data.dataY;
    dataHandler.axisUsed = data.axisUsed;
    dataHandler.markerSize = marker.markerSize;
    dataHandler.markerColor = marker.markerColor;
    dataHandler.markerOpacity = marker.markerOpacity;
    dataHandler.markerWidth = marker.markerWidth;
    dataHandler.markerStyle = marker.markerStyle;
    dataHandler.markerType = marker.markerType;
    dataHandler.markerFilled = marker.markerFilled;
    dataHandler.markerEnable = marker.markerEnable;
    dataHandler.errorbarEnable = error.errorbarEnable;
    dataHandler.errorbarType = error.errorbarType;
    dataHandler.errorbarColorX = error.errorbarColorX;
    dataHandler.errorbarOpacityX = error.errorbarOpacityX;
    dataHandler.errorbarWidthX = error.errorbarWidthX;
    dataHandler.errorbarStyleX = error.errorbarStyleX;
    dataHandler.errorbarDataX = error.errorbarDataX;
    dataHandler.errorbarColorY = error.errorbarColorY;
    dataHandler.errorbarOpacityY = error.errorbarOpacityY;
    dataHandler.errorbarWidthY = error.errorbarWidthY;
    dataHandler.errorbarStyleY = error.errorbarStyleY;
    dataHandler.errorbarDataY = error.errorbarDataY;
    dataHandler.lineEnable = line.lineEnable;
    dataHandler.lineColor = line.lineColor;
    dataHandler.lineOpacity = line.lineOpacity;
    dataHandler.lineStyle = line.lineStyle;
    dataHandler.lineWidth = line.lineWidth;
    dataHandler.datasetType = ()=>dataState.datasetType;
    
//---------------------------------------------

    return [dataHandler as Line_Chart, draw.drawData];
}