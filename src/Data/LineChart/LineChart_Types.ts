import { Axis_Property, Line_Style } from "../../Graph2D/Graph2D_Types";
import { Data_General, Data_Object_State } from "../Data_Types";

export type Marker_Type = "circle" | "square" | "v-rect" | "h-rect" | "cross" | "star" | "triangle" | "inv-triangle"

export interface Line_Chart extends Required<Data_General<Line_Chart>>
{}

export interface Line_Chart_Options {
    useAxis : Axis_Property<"primary" | "secondary">,
    marker : Marker_Attributes,
    line : Line_Attributes,
    polar : boolean
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

export interface Line_Chart_State extends Data_Object_State, Line_Chart_Options {
    x : Array<number> | (()=>Array<number>),
    y : Array<number> | (()=>Array<number>),
}

export interface Line_Chart_Method_Generator {
    dataState : Line_Chart_State,
    dataHandler : Line_Chart
}