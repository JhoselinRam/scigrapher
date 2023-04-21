import { Axis_Property, Graph2D } from "../../Graph2D/Graph2D_Types";
import { Color_Map_types } from "../../tools/Color_Map/Predefined/Color_Map_Types";
import { Datasets, Dataset_Callback, Data_General, Data_Object_State, Field_Data, Field_Position, Field_Property } from "../Data_Types";
import { Data_Heat } from "./resourses/Data_Heat/Data_Heat_Types";
import { Properties_Heat } from "./resourses/Properties_Heat/Properties_Heat_Types";

export interface Heat_Map extends 
Data_General<Heat_Map>,
Data_Heat,
Omit<Properties_Heat, "save">{
    datasetType : ()=>"heatmap"
}

export interface Heat_Map_Options{
    mesh : Axis_Property<Field_Position<Heat_Map>>,
    data : Field_Data<Heat_Map>,
    useAxis : Axis_Property<"primary" | "secondary">,
    enable : boolean
    smooth : boolean,
    color : Heat_Map_Color,
    opacity : Heat_Map_Opacity,
    id : string
}

export interface Heat_Map_State extends Data_Object_State, Heat_Map_Options{
    datasetType  : "heatmap"
}

export interface Heat_Map_Method_Generator {
    dataState : Heat_Map_State,
    dataHandler : Heat_Map,
    graphHandler : Graph2D
}

export type Heat_Map_Callback = Dataset_Callback<Heat_Map>

export type Heat_Property_Generator<T> = (value:number, x:number, y:number, i:number, j:number, data:Field_Property<number>, meshX:Field_Property<number>, meshY:Field_Property<number>, dataset:Heat_Map, graph:Graph2D)=>T

export type Heat_Map_Color = Color_Map_types | Field_Property<string> | Heat_Property_Generator<string>;
export type Heat_Map_Opacity = number | Field_Property<number> | Heat_Property_Generator<number>