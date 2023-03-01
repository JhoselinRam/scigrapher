import { Axis_Property, Line_Style } from "../../Graph2D/Graph2D_Types";
import { Data_General, Data_Object_State, Field_Data } from "../Data_Types";

export interface Vector_Field extends 
Data_General<Vector_Field>
{}

export interface Vector_Field_Options {
    data : Axis_Property<Field_Data<number>>,
    mesh : Axis_Property<Field_Data<number>>,
    style : Line_Style,
    color : string,
    opacity : string
}

export interface Vector_Field_State extends Data_Object_State, Vector_Field_Options {}