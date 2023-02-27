import { Line_Chart, Property_Generator } from "../../LineChart_Types"

export interface Marker_Line {
    markerSize : Property_Modifier<number>,
    markerColor : Property_Modifier<string>,
    markerOpacity : Property_Modifier<number>,
    markerFilled : Property_Modifier<boolean>,
    markerWidth : Property_Modifier<number>,
    markerStyle : Property_Modifier<string>,
    markerType : Property_Modifier<string>,
    markerEnable : {
        (enable : boolean, callback?:(handler?:Line_Chart)=>void) : Line_Chart,
        (arg : void) : boolean
    }
}

export type Property_Modifier<T> = {
    (property : Property_Generator<T>, callback?:(handler?:Line_Chart)=>void):Line_Chart,
    (arg:void) : T | Array<T>
}

export type Marker_Properties = "color" | "opacity" | "filled" | "width" | "style" | "size" | "type"