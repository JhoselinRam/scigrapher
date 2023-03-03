import { Graph2D } from "../../Graph2D/Graph2D_Types";
import { Draw_Data_Callback, Partialize } from "../Data_Types";
import { Vector_Field, Vector_Field_Options } from "./Vector_Field_Types";

export function VectorField(options : Partialize<Vector_Field_Options>, graphHandler : Graph2D, dirtify:(sort?:boolean)=>void) : [Vector_Field, Draw_Data_Callback] {
    
}