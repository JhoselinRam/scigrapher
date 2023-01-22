import { Mapping } from "../Mapping/Mapping_Types";

export interface CreateAxis_Props {
    scale : Mapping,
    suffix ?: string,
    ticks ?: "auto" | number | Array<number>
}

export interface Axis_Obj {
    positions : Array<number>,
    labels : Array<string>,
    draw : (options:Draw_Axis_Props)=>void
}

export interface Draw_Axis_Props {
    type : "centerX" | "centerY" | "left" | "right" | "top" | "bottom",
    color : Draw_Axis_Properties<string>,
    opacity : Draw_Axis_Properties<number>
    position ?: number,
    dynamic ?: boolean,
    contained ?: boolean
}

type Draw_Axis_Properties<T> = {
    base : T,
    tick : T,
    text : T
}