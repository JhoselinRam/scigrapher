import { Axis_Property, Graph2D_State } from "../Graph2D/Graph2D_Types";
import { Line_Chart, Line_Chart_Options, Line_Chart_State } from "./LineChart/LineChart_Types";
import { Vector_Field, Vector_Field_Options, Vector_Field_State } from "./VectorField/Vector_Field_Types";

export type Datasets = "linechart";

export interface Data_Object_State {
    useAxis : Axis_Property<"primary" | "secondary">,
    id : string,
    index : number,
    dirtify : (sort?:boolean)=>void
}

export type Dataset_Types = Line_Chart | Vector_Field;
export type Dataset_States = Line_Chart_State | Vector_Field_State;
export type Dataset_Options = Line_Chart_Options | Vector_Field_Options;

export interface Data_General_Generator<T extends Dataset_Types, P extends Dataset_States> {
    dataHandler : T,
    dataState : P
}

export interface Data_General<T extends Dataset_Types> {
    id : ()=>string,
    index : {
        (index : number, callback?:(handler:T)=>void) : T,
        (arg:void) : number
    }
}

export type Draw_Data_Callback = (state : Graph2D_State)=>void;

export type Field_Data<T> = Array<Array<T>>;

export type Field_Property_Generator<T> = T | Field_Data<T> | (()=>Field_Data<T>)