import { Line_Chart, Line_Chart_Callback, Marker_Type, Property_Modifier } from "../../LineChart_Types"

export interface Marker_Line {
    markerSize : Property_Modifier<number>,
    markerColor : Property_Modifier<string>,
    markerOpacity : Property_Modifier<number>,
    markerFilled : Property_Modifier<boolean>,
    markerWidth : Property_Modifier<number>,
    markerStyle : Property_Modifier<string>,
    markerType : Property_Modifier<Marker_Type>,
    markerEnable : {
        (enable : boolean, callback?:Line_Chart_Callback) : Line_Chart,
        (arg : void) : boolean
    }
}

export type Marker_Properties = "color" | "opacity" | "filled" | "width" | "style" | "size" | "type"