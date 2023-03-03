import { Axis_Property, Graph2D, Line_Style } from "../../Graph2D/Graph2D_Types";
import { Data_General, Data_Object_State, Field_Position, Field_Property } from "../Data_Types";

export interface Vector_Field extends 
Data_General<Vector_Field>
{}

export interface Vector_Field_Options {
    position : Axis_Property<Field_Position<Vector_Field>>,
    data : Axis_Property<>,

}

export interface Vector_Field_State extends Data_Object_State, Vector_Field_Options {}

export type Vector_Data = 

export type Vector_Property_Generator<T> = T | Field_Property<T> | ((vectorX?:number, vectorY?:number, x?:number, y?:number, indexX?:number, indexY?:number, valuesX?:Field_Property<number>, valuesY?:Field_Property<number>, positionsX?:Field_Property<number>, positionsY?:Field_Property<number>, dataset?:Vector_Field, graph?:Graph2D)=>Field_Property<T>);

type Make_Generator<T> = {
    [P in keyof T] : Vector_Property_Generator<T[P]>
}