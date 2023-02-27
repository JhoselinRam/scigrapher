import { Line_Chart, Line_Char_Data } from "../../LineChart_Types";

export interface Area {
    areaDataX : {
        (data : Line_Char_Data, callback?:(handler?:Line_Chart)=>void) : Line_Chart,
        (arg:void) : Array<number>
    },
    areaDataY : {
        (data : Line_Char_Data, callback?:(handler?:Line_Chart)=>void) : Line_Chart,
        (arg:void) : Array<number>
    },
    areaEnable : Area_Modifier<boolean>,
    areaPolar : Area_Modifier<boolean>,
    areaColor : Area_Modifier<string>,
    areaOpacity : Area_Modifier<number>
}

export type Area_Properties = "enable" | "color" | "opacity" | "polar";

export interface Area_Property_Generator<T> {
    container : T,
    property : Area_Properties
}

export type Area_Modifier<T> = {
    (value : T, callback?:(handler?:Line_Chart)=>void) : Line_Chart,
    (arg : void) : T
}