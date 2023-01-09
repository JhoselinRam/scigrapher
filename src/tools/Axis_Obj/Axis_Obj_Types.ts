import { Mapping } from "../Mapping/Mapping_Types";

export interface CreateAxis_Props {
    scale : Mapping,
    type : "bottom" | "top" | "left" | "right",
    suffix ?: string,
    ticks ?: "auto" | number | Array<number>
}

export interface Axis_Obj {
    positions : Array<number>,
    labels : Array<string>,
    draw : ()=>void
}