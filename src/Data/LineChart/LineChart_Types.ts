import { Axis_Property } from "../../Graph2D/Graph2D_Types";
import { Data_Object } from "../Data_Types";

export interface Line_Chart extends Data_Object {}

export interface Line_Chart_Options {
    useAxis : Axis_Property<"primary" | "secondary">
}

export interface Line_Chart_State extends Line_Chart_Options {

}