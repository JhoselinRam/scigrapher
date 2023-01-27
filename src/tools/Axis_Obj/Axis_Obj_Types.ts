import { Graph2D_State } from "../../Graph2D/Graph2D_Types";
export interface CreateAxis_Props {
    state : Graph2D_State,
    axis : "x" | "y",
    ticks ?: "auto" | number | Array<number>
}

export interface Axis_Obj {
    positions : Array<number>,
    labels : Array<string>,
    draw : ()=>void
    rects ?: Array<Label_Rect>
}

export interface Label_Rect {
    x : number,
    y : number,
    width : number,
    height : number
}

type Draw_Axis_Properties<T> = {
    base : T,
    tick : T,
    text : T
}