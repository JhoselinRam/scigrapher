import { Axis_Property, Graph2D, Line_Style } from "../../Graph2D/Graph2D_Types";
import { Dataset_Callback, Data_General, Data_Object_State, Field_Data, Field_Property } from "../Data_Types";
import { Data_Vector } from "./resourses/Data_Vector/Data_Vector_Types";
import { Properties_Vector } from "./resourses/Properties_Vector/Properties_Vector_Types";

export interface Vector_Field extends 
Data_General<Vector_Field>,
Data_Vector,
Properties_Vector
{}

export interface Vector_Field_Options extends Make_Generator<{
    color : string,
    opacity : number,
    width : number,
    style : Line_Style
}>{
    mesh : Axis_Property<Field_Data<Vector_Field>>,
    data : Axis_Property<Field_Data<Vector_Field>>,
    normalized : boolean,
    maxLenght : number,
    useAxis : Axis_Property<"primary" | "secondary">,
    enable : boolean
}

export interface Vector_Field_State extends Data_Object_State, Vector_Field_Options {}

export type Vector_Property_Generator<T> = T | Field_Property<T> | ((vectorX?:number, vectorY?:number, positionX?:number, positionY?:number, i?:number, j?:number, valuesX?:Field_Property<number>, valuesY?:Field_Property<number>, meshX?:Field_Property<number>, meshY?:Field_Property<number>, dataset?:Vector_Field, graph?:Graph2D)=>T);

type Make_Generator<T> = {
    [P in keyof T] : Vector_Property_Generator<T[P]>
}

export interface Vector_Field_Method_Generator {
    dataState : Vector_Field_State,
    dataHandler : Vector_Field,
    graphHandler : Graph2D
}

export type Vector_Field_Callback = Dataset_Callback<Vector_Field>