import { Graph2D, Graph2D_State, Rect } from "../../../../Graph2D/Graph2D_Types";
import { Mapping } from "../../../../tools/Mapping/Mapping_Types";
import { Field_Property } from "../../../Data_Types";
import { Heat_Map, Heat_Map_State } from "../../Heat_Map_Types";

export interface Draw_Heat{
    drawData : (state:Graph2D_State)=>void;
}

export interface Draw_Heat_Helper {
    xScale : Mapping,
    yScale : Mapping,
    data : Field_Property<number>,
    meshX : Field_Property<number>,
    meshY : Field_Property<number>,
    state : Graph2D_State,
    dataState : Heat_Map_State,
    dataset : Heat_Map,
    graph : Graph2D,
    clip : Rect
}

export interface Get_Color_Function{
    data : Field_Property<number>,
    dataState : Heat_Map_State
}