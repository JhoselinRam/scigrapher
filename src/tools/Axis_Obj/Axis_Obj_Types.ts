import { Graph2D_State, Primary_Axis } from "../../Graph2D/Graph2D_Types";
import { Mapping } from "../Mapping/Mapping_Types";

export interface CreateAxis_Props {
    state : Graph2D_State,
    axis : "x" | "y",
    ticks ?: "auto" | number | Array<number>
}

export interface Axis_Obj {
    positions : Array<number>,
    labels : Array<string>,
    draw : (options:Draw_Axis_Props)=>void
    rects ?: Array<Label_Rect>
}

export interface Label_Rect {
    x : number,
    y : number,
    width : number,
    height : number
}

export interface Draw_Axis_Props {
    context : {
        clientRect : {
            x : number,
            y : number,
            width : number,
            height : number
        },
        canvas : CanvasRenderingContext2D,
        margin : {
            start : number,
            end : number,
            top: number,
            bottom : number
        }
    },
    type : "centerX" | "centerY" | "left" | "right" | "top" | "bottom",
    color : Draw_Axis_Properties<string>,
    opacity : Draw_Axis_Properties<number>,
    width : Omit<Draw_Axis_Properties<number>, "text">,
    tickSize : number,
    text : {
        font : string,
        size : string
    },
    position ?: number,
    dynamic ?: boolean,
    contained ?: boolean
}

type Draw_Axis_Properties<T> = {
    base : T,
    tick : T,
    text : T
}