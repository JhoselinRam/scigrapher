import { Graph2D_State } from "../../../../Graph2D/Graph2D_Types";
import { Mapping } from "../../../../tools/Mapping/Mapping_Types";
import { Draw_Data_Callback } from "../../../Data_Types";
import { Line_Chart_State } from "../../LineChart_Types";

export interface Draw_Line {
    drawData : Draw_Data_Callback
}

export interface Draw_Line_Helper_Props {
    state : Graph2D_State,
    dataState : Line_Chart_State,
    xPositions : Array<number>,
    yPositions : Array<number>
}

export interface Interpret_Line_Coords_Props {
    xScale : Mapping,
    yScale : Mapping,
    dataState : Line_Chart_State
}
