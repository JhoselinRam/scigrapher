import { Axis_Property } from "../../../../Graph2D/Graph2D_Types";
import { Mapping } from "../../../../tools/Mapping/Mapping_Types";
import { Draw_Data_Callback } from "../../../Data_Types";
import { Error_Bar_Types, Line_Chart, Line_Chart_State, Marker_Type, Property_Generator } from "../../LineChart_Types";

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
    polar : boolean,
    
    dataHandler : Line_Chart,
}

export interface Create_Marker_Props {
    type : Marker_Type,
    size : number
}

export interface Create_Error_Props {
    position : Axis_Property<number>,
    error : Axis_Property<number>,
    scale : Axis_Property<Mapping>,
    width : Axis_Property<number>,
    type : Error_Bar_Types,
    axis : "x" | "y"
}

export interface Extract_Property_Props<T> {
    x : number,
    y : number,
    index : number,
    handler : Line_Chart,
    property : Property_Generator<T>
}