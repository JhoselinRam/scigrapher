import { Graph2D_State } from "../Graph2D/Graph2D_Types";
import { Line_Chart } from "./LineChart/LineChart_Types";

export interface Data_Object {
    _drawData : (state : Graph2D_State)=>void
}

export type Dataset_Types = Line_Chart