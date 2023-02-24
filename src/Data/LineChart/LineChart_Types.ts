import { Axis_Property, Line_Style } from "../../Graph2D/Graph2D_Types";
import { Data_General, Data_Object_State } from "../Data_Types";
import { Bind_Line } from "./resourses/Bind_Line/Bind_Line_Types";

export type Marker_Type = "circle" | "square" | "v-rect" | "h-rect" | "cross" | "star" | "triangle" | "inv-triangle";
export type Line_Char_Data = Array<number> | ((handler?:Line_Chart)=>Array<number>);
export type Marker_Size = number | Array<number> | ((x?:number, y?:number, index?:number, handler?:Line_Chart)=>number);

export interface Line_Chart extends 
Data_General<Line_Chart>,
Bind_Line
{}

export interface Line_Chart_Options {
    useAxis : Axis_Property<"primary" | "secondary">,
    marker : Marker_Attributes,
    line : Line_Attributes,
    polar : boolean,
    data : Axis_Property<Line_Char_Data>
}

export interface Marker_Attributes {
    enable : boolean,
    color : string,
    opacity : number,
    filled : boolean,
    size : Marker_Size,
    type : Marker_Type
}

export interface Line_Attributes {
    enable : boolean,
    color : string,
    opacity : number,
    width : number,
    style : Line_Style | string
}

export interface Line_Chart_State extends Data_Object_State, Line_Chart_Options{}

export interface Line_Chart_Method_Generator {
    dataState : Line_Chart_State,
    dataHandler : Line_Chart
}
