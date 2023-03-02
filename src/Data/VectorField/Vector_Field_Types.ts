import { Axis_Property, Line_Style } from "../../Graph2D/Graph2D_Types";
import { Data_General, Data_Object_State } from "../Data_Types";

export interface Vector_Field extends 
Data_General<Vector_Field>
{}

export interface Vector_Field_Options {
    
}

export interface Vector_Field_State extends Data_Object_State, Vector_Field_Options {}