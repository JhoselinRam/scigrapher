import { Colorbar, Colorbar_Options } from "../Colorbar/Colorbar_Types";
import { Area } from "../Data/Area/Area_Types";
import { Datasets, Dataset_Options, Dataset_Types, Draw_Data_Callback } from "../Data/Data_Types";
import { Heat_Map } from "../Data/HeatMap/Heat_Map_Types";
import { Line_Chart } from "../Data/LineChart/LineChart_Types";
import { Vector_Field } from "../Data/VectorField/Vector_Field_Types";
import { Legend, Legend_Options } from "../Legend/Legend_Types";
import { Axis_Obj } from "../tools/Axis_Obj/Axis_Obj_Types";
import { Mapping } from "../tools/Mapping/Mapping_Types";
import { Axis } from "./resourses/Axis/Axis_Types";
import { Background } from "./resourses/Background/Background_Types";
import { Border } from "./resourses/Border/Border_Types";
import { Colorbars } from "./resourses/Colorbars/Colorbars_Types";
import { Data } from "./resourses/Data/Data_Types";
import { Events } from "./resourses/Events/Events_Types";
import { Grid } from "./resourses/Grid/Grid_Types";
import { Labels } from "./resourses/Labels/Labels_Types";
import { Legends } from "./resourses/Legends/Legends_Types";
import { Margin } from "./resourses/Margin/Margin_Types";
import { Properties } from "./resourses/Properties/Properties_Types";
import { Secondary } from "./resourses/Secondary/Secondary_Types";

export interface Graph2D extends 
    Omit<Background, "draw" | "drawClientRect">, 
    Omit<Axis,"compute" | "draw">, 
    Omit<Labels,"compute" | "draw">,
    Omit<Grid, "compute" | "draw">,
    Omit<Secondary, "compute" | "draw">,
    Omit<Margin, "compute">,
    Omit<Border, "draw">,
    Events,
    Data,
    Properties,
    Colorbars,
    Legends
    {}

export type Axis_Position = "center" | "bottom-left" | "bottom-right" | "top-left" | "top-right";
export type Axis_Type = "rectangular" | "polar" | "x-log" | "y-log" | "log-log";

export interface Rect {
    x : number,
    y : number,
    width : number,
    height : number
}

export interface Graph2D_Options{
    background : {
        color : string,
        opacity : number
    },
    margin : Axis_Property<{
        start : number | "auto",
        end : number | "auto"
    }>,
    axis : {
        type : Axis_Type,
        position : Axis_Position,
        overlapPriority : "x" | "y"
    } & Axis_Property<Primary_Axis>,
    secondary : Partial<Axis_Property<Secondary_Axis>>,
    labels : {
        title ?: LabelProperties,
        subtitle ?: LabelProperties,
        xPrimary ?:LabelProperties,
        yPrimary ?:LabelProperties,
        xSecondary ?: LabelProperties,
        ySecondary ?: LabelProperties
    },
    grid : {
        primary : Axis_Property<Primary_Grid>,
        secondary : Axis_Property<Secondary_Grid>,
        polarGrid : number
    },
    border : Axis_Property<{
        start : BorderProperties,
        end : BorderProperties
    }>
}

export interface Primary_Grid {
    enable : boolean,
    color : string,
    opacity : number,
    width : number,
    style : Line_Style | string
}

export type Line_Style = "solid" | "dot" | "dash" | "long-dash" | "dash-dot" | "dash-2dot" | string;

export interface Secondary_Grid extends Primary_Grid {
    minSpacing : number,
    maxDensity : number,
    density : "auto" | number
}

export type LabelProperties = {
    enable : boolean,
    text : string,
    font : string,
    size : string,
    specifier : string,
    color : string,
    opacity : number,
    filled : boolean,
    position : "start" | "center" | "end"
}

export interface Primary_Axis {
    start : number,
    end : number,
    unit : string,
    baseColor : string,
    baseOpacity : number,
    baseWidth : number,
    tickColor : string,
    tickOpacity : number,
    tickWidth : number,
    tickSize :number,
    textColor : string,
    textOpacity : number,
    textFont : string,
    textSize : string,
    textSpecifier : string,
    dynamic : boolean,
    contained : boolean,
    ticks : "auto" | number | Array<number>,
    minSpacing : number,
    overlap : boolean
}

export interface Secondary_Axis extends Omit<Primary_Axis, "dynamic"|"contained"|"overlap"> {
    enable : boolean,
    type : "rectangular" | "log"
} 

export interface BorderProperties {
    enable : boolean,
    color : string,
    opacity : number,
    width : number,
    style : Line_Style | string
}

export interface Graph2D_State extends Graph2D_Options {
    container : HTMLDivElement,
    canvasElement : HTMLCanvasElement,
    canvasDataElement : HTMLCanvasElement,
    render : ()=>void,
    labelOffset : number,
    marginUsed : Axis_Property<{
        start : number,
        end : number
    }> & {defaultMargin : number},
    context : {
        clientRect : {
            x : number,
            y : number,
            width : number,
            height : number
        },
        canvas : CanvasRenderingContext2D,
        data : CanvasRenderingContext2D,
        graphRect : ()=>Rect
    },
    scale : {
        primary : Axis_Property<Mapping>
        secondary : Partial<Axis_Property<Mapping>>
    }
    compute : {
        full : ()=>void,
        client : ()=>void,
        scale : ()=>void,
        axis : ()=>void,
        labels : ()=>void,
        secondary : ()=>void,
        margin : ()=>void
    },
    draw : {
        full : ()=>void,
        client : ()=>void,
        data : ()=>void,
        background : ()=>void,
        backgroundClientRect : ()=>void,
        labels : ()=>void
        axis : ()=>void,
        grid : ()=>void,
        secondary : ()=>void,
        border : ()=>void
    },
    axisObj : {
        primary : {
            width : number,
            height : number,
            obj ?: Axis_Property<Axis_Obj>
        },
        secondary : {
            width : number,
            height : number,
            obj ?: Partial<Axis_Property<Axis_Obj>>
        }
    },
    data : Array<{
        dataset : Dataset_Types,
        draw : Draw_Data_Callback,
        save : Graph2D_Save_Callback,
    }>,
    dirty : {
        full : boolean,
        client : boolean,
        data : boolean,
        shouldSort : boolean,
        dirtify : (sort ?: boolean)=>void
    },
    colorbars : Array<{
        bar : Colorbar,
        compute : ()=>void,
        draw : ()=>void,
        save : Graph2D_Save_Callback,
    }>,
    legends : Array<{
        legend : Legend,
        draw : ()=>void,
        save : Graph2D_Save_Callback,
    }>
}

export interface Method_Generator{
    state : Graph2D_State,
    graphHandler : Graph2D
}

export type RecursivePartial<T> = {
    [P in keyof T]?: RecursivePartial<T[P]>;
}

type ChildrenPartial<T> = {
    [P in keyof T] : Partial<T[P]>
}

export type RequiredExept<T, K extends keyof T> = Pick<ChildrenPartial<T>,K> & Omit<T,K>

export type Axis_Property<T> = {
    x : T,
    y : T
}

export type graphCallback = ((graph:Graph2D)=>void) | (()=>void)


export type Graph2D_Save_Callback = ()=>Graph2D_Save_Asset;


export interface Graph2D_Save_Asset {
    options : Dataset_Options | Colorbar_Options | Legend_Options,
    assetType : Datasets | "colorbar" | "legend"
}

export interface Graph2D_Save_Graph {
    graph : Graph2D_Options,
    assets : Array<Graph2D_Save_Asset>
}

export interface Graph2D_Restore_Props {
    container : HTMLDivElement,
    data : Graph2D_Save_Graph
}

export interface Graph2D_Restore {
    graph : Graph2D,
    linechart : Array<Line_Chart>,
    heatmap : Array<Heat_Map>,
    vectorfield : Array<Vector_Field>,
    area : Array<Area>,
    colorbar : Array<Colorbar>,
    legend : Array<Legend>
}