import { Axis_Property, Graph2D } from "../../Graph2D/Graph2D_Types";
import { Data_General, Data_Object_State, Field_Data, Field_Position, Field_Property } from "../Data_Types";

export interface Heat_Map extends 
Data_General<Heat_Map>
{}

export interface Heat_Map_Options{
    mesh : Axis_Property<Field_Position<Heat_Map>>,
    data : Field_Data<Heat_Map>,
    useAxis : Axis_Property<"primary" | "secondary">,
    enable : boolean
    smoot : boolean,
    color : "auto" | Field_Property<string> | ((value?:number, x?:number, y?:number, i?:number, j?:number, meshX?:Field_Property<number>, meshY?:Field_Property<number>, dataset?:Heat_Map, graph?:Graph2D)=>string)
}

export interface Heat_Map_State extends Data_Object_State, Heat_Map_Options
{}