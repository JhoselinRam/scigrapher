import { Graph2D_State, Rect } from "../../../Graph2D/Graph2D_Types";
import { Mapping } from "../../../tools/Mapping/Mapping_Types";
import { Line_Chart_State } from "../LineChart_Types";

export interface Draw {
    _drawData : (state : Graph2D_State)=>void
}

export interface Draw_Helper_Props {
    state : Graph2D_State,
    dataState : Line_Chart_State,
    xPositions : Array<number>,
    yPositions : Array<number>
}

export interface Interpret_Coords_Props {
    xScale : Mapping,
    yScale : Mapping,
    dataState : Line_Chart_State
}
