import { Graph2D_State } from "../../Graph2D/Graph2D_Types";

export interface CreateAxis_Props {
    state : Graph2D_State,
    axis : "x" | "y",
    scale : "primary" | "secondary"
}

export interface Axis_Obj {
    positions : Array<number>,
    labels : Array<string>,
    draw : ()=>void,
    rects : Array<Label_Rect>
}

export interface Label_Rect {
    x : number,
    y : number,
    width : number,
    height : number
}

export interface Create_Labels {
    labels : Array<string>,
    maxWidth : number,
    maxHeight : number
}

export interface Compute_Sizes {
    translation : number,
    axisStart : number,
    axisEnd : number
} 