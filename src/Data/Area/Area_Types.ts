import { Axis_Property, Graph2D } from "../../Graph2D/Graph2D_Types";
import { Datasets, Dataset_Callback, Data_General, Data_Object_State } from "../Data_Types";
import { Area_Data_Methods } from "./resourses/Area_Data/Area_Data_Types";
import { Area_Properties_Methods } from "./resourses/Area_Properties/Area_Properties_Types";

export interface Area extends
Data_General<Area>,
Area_Data_Methods,
Area_Properties_Methods{
    datasetType : ()=>Datasets
}

export interface Area_Options{
    enable : boolean,
    color : string,
    opacity : number,
    data : Axis_Property<Area_Data>,
    base : Axis_Property<Area_Data>,
    polar : boolean
}

export interface Area_State extends
Data_Object_State, Area_Options{
    datasetType : Datasets
}

export type Area_Callback = Dataset_Callback<Area>;

export interface Area_Method_Generator {
    dataState : Area_State,
    dataHandler : Area,
    graphHandler : Graph2D
}

export type Area_Data = number[] | ((dataset?: Area, graph?: Graph2D) => Array<number>)