import { Line_Chart, Line_Chart_Callback, Property_Modifier } from "../../LineChart_Types"

export interface Line {
    lineEnable : {
        (enable : boolean, callback?:Line_Chart_Callback) : Line_Chart,
        (arg : void) : boolean
    },
    lineColor : Property_Modifier<string>,
    lineOpacity : Property_Modifier<number>,
    lineWidth : Property_Modifier<number>,
    lineStyle : Property_Modifier<string>
}

export type Line_Properties = "color" | "opacity" | "width" | "style"