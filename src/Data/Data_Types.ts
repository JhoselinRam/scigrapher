import { Axis_Property, Graph2D_State } from "../Graph2D/Graph2D_Types";
import { Line_Chart, Line_Chart_State } from "./LineChart/LineChart_Types";

export interface Data_Object_State {
    useAxis : Axis_Property<"primary" | "secondary">,
    id : string,
    index : number,
    dirtify : (sort?:boolean)=>void
}

export type Dataset_Types = Line_Chart
export type Dataset_States = Line_Chart_State

export interface Data_General_Generator<T extends Dataset_Types, P extends Dataset_States> {
    dataHandler : T,
    dataState : P
}

export interface Data_General<T extends Dataset_Types> {
    _drawData ?: (state : Graph2D_State)=>void,  //This method needs to be implemented individually by each data set
    id : ()=>string,
    index : {
        (index : number, callback?:(handler:T)=>void) : T,
        (arg:void) : number
    },
    _setDirtifyCallback : (dirtify : (sort?:boolean)=>void)=>void
}

export type SetPartial<T, K extends keyof T> = Omit<T,K> & Partial<Pick<T,K>>