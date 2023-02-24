import { Mapping } from "../../../../tools/Mapping/Mapping_Types";
import { Draw_Data_Callback } from "../../../Data_Types";
import { Line_Chart, Line_Chart_State } from "../../LineChart_Types";

export interface Draw_Line {
    drawData : Draw_Data_Callback
}

export interface Draw_Line_Helper_Props {
    context : CanvasRenderingContext2D,
    dataState : Line_Chart_State,
    xPositions : Array<number>,
    yPositions : Array<number>,
    dataHandler : Line_Chart,
    xScale : Mapping,
    yScale : Mapping
}

export interface Interpret_Line_Coords_Props {
    dataState : Line_Chart_State,
    dataHandler : Line_Chart
}
