import { Axis_Property, Graph2D_State } from "../Graph2D/Graph2D_Types";
import { Line_Chart } from "./LineChart/LineChart_Types";

export interface Data_Object {
    _drawObject : (state : Graph2D_State)=>void,
    useAxis : Axis_Property<"primary" | "secondary">
}

export type Dataset_Types = Line_Chart