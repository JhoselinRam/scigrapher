import { Mapping } from "../Mapping/Mapping_Types";

export interface CreateAxis_Props {
    scale : Mapping,
    type : "bottom" | "top" | "left" | "right",
    suffix ?: string,
    baseColor : string,
    baseOpacity : string,
    tickColor : string,
    tickOpacity : string,
    labelColor : string,
    labelOpacity : string
}

export interface Axis_Obj {

}