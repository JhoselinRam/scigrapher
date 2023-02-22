import { Axis_Property, Line_Style } from "../../Graph2D/Graph2D_Types";
import { Data_Object } from "../Data_Types";

export type Marker_Type = "circle" | "square" | "v-rect" | "h-rect" | "cross" | "star" | "triangle" | "inv-triangle"

export interface Line_Chart extends Data_Object {}

export interface Line_Chart_Options {
    useAxis : Axis_Property<"primary" | "secondary">,
    marker : Marker_Attributes,
    line : Line_Attributes,
    polar : boolean,
    x : Array<number> | (()=>Array<number>),
    y : Array<number> | (()=>Array<number>)
}

export interface Marker_Attributes {
    enable : boolean,
    color : string,
    opacity : number,
    filled : boolean,
    size : number,
    type : Marker_Type
}

export interface Line_Attributes {
    enable : boolean,
    color : string,
    opacity : number,
    width : number,
    style : Line_Style | string
}

export interface Line_Chart_State extends Line_Chart_Options {
    id : string
}

export interface Line_Chart_Method_Generator {
    dataState : Line_Chart_State,
    dataHandler : Line_Chart
}