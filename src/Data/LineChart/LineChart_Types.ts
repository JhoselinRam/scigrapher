import { Axis_Property, Line_Style } from "../../Graph2D/Graph2D_Types";
import { Data_General, Data_Object_State } from "../Data_Types";
import { Data_Line } from "./resourses/Data_Line/Data_Line_Types";
import { Marker_Line } from "./resourses/Marker_Line/Marker_Line_Types";

export type Marker_Type = "circle" | "square" | "v-rect" | "h-rect" | "cross" | "star" | "triangle" | "inv-triangle";
export type Error_Bar_Types = "rectangle" | "cross" | "corner" | "tail-cross"
export type Line_Char_Data = Array<number> | ((handler?:Line_Chart)=>Array<number>);

export interface Line_Chart extends 
Data_General<Line_Chart>,
Data_Line,
Marker_Line
{}

export interface Line_Chart_Options {
    useAxis : Axis_Property<"primary" | "secondary">,
    marker : Marker_Attributes,
    line : Line_Attributes,
    polar : boolean,
    data : Axis_Property<Line_Char_Data>,
    errorBar : Line_Error_Atributes
}

export interface Marker_Attributes extends Make_Generator<{
    color : string,
    opacity : number,
    filled : boolean,
    width : number,
    style : Line_Style|string,
    size : number,
    type : Marker_Type
}> {enable : boolean}

export interface Line_Attributes extends Make_Generator<{
    color : string,
    opacity : number,
    width : number,
    style : Line_Style | string
}> {enable : boolean}

export interface Line_Error_Atributes extends Axis_Property<Make_Generator<{
    color : string,
    opacity : number,
    width : number,
    style : Line_Style,
    data : number
}>&{enable : boolean}>
   {type : Property_Generator<Error_Bar_Types>}

export interface Line_Chart_State extends Data_Object_State, Line_Chart_Options{}

export interface Line_Chart_Method_Generator {
    dataState : Line_Chart_State,
    dataHandler : Line_Chart
}

export type Property_Generator<T> = T | Array<T> | ((x?:number, y?:number, index?:number, handler?:Line_Chart)=>T);

export type Make_Generator<T> = {
    [P in keyof T] : Property_Generator<T[P]>
}

export type Partialize<T> = {
    [P in keyof T] ?: 
        T[P] extends (infer U)[] ? T[P] :
        T[P] extends Line_Char_Data ? T[P] : 
        T[P] extends object ? Partialize<T[P]> :
        T[P]
}
 