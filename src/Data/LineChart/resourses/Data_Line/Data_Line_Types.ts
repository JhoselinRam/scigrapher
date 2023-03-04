import { Axis_Property } from "../../../../Graph2D/Graph2D_Types"
import { Line_Chart, Line_Chart_Callback, Line_Char_Data } from "../../LineChart_Types"

export interface Data_Line {
    dataX : {
        (data : Line_Char_Data, callback?:Line_Chart_Callback) : Line_Chart,
        (arg:void) : Array<number>
    },
    dataY : {
        (data : Line_Char_Data, callback?:Line_Chart_Callback) : Line_Chart,
        (arg:void) : Array<number>
    },
    axisUsed : {
        (axis:Partial<Axis_Property<"primary" | "secondary">>, callback?:Line_Chart_Callback) : Line_Chart,
        (arg:void) : Axis_Property<"primary" | "secondary">
    }
}