import { Axis_Property, Graph2D } from "../../Graph2D/Graph2D_Types";
import { Color_Map_types } from "../../tools/Color_Map/Predefined/Color_Map_Types";
import { Dataset_Callback, Data_General, Data_Object_State, Field_Data, Field_Position, Field_Property } from "../Data_Types";

export interface Heat_Map extends 
Data_General<Heat_Map>
{}

export interface Heat_Map_Options{
    mesh : Axis_Property<Field_Position<Heat_Map>>,
    data : Field_Data<Heat_Map>,
    useAxis : Axis_Property<"primary" | "secondary">,
    enable : boolean
    smooth : boolean,
    color : Color_Map_types | Field_Property<string> | Heat_Property_Generator<string>,
    opacity : number | Field_Property<number> | Heat_Property_Generator<number>,
}

export interface Heat_Map_State extends Data_Object_State, Heat_Map_Options
{}

export interface Heat_Map_Method_Generator {
    dataState : Heat_Map_State,
    dataHandler : Heat_Map,
    graphHandler : Graph2D
}

export type Heat_Map_Callback = Dataset_Callback<Heat_Map>

export type Heat_Property_Generator<T> = (value?:number, x?:number, y?:number, i?:number, j?:number, meshX?:Field_Property<number>, meshY?:Field_Property<number>, dataset?:Heat_Map, graph?:Graph2D)=>T