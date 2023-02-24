import { Line_Chart, Line_Char_Data, Marker_Size } from "../../LineChart_Types"

export interface Bind_Line{
    xData : {
        (data : Line_Char_Data, callback?:(handler?:Line_Chart)=>void) : Line_Chart,
        (arg:void) : Array<number>
    },
    yData : {
        (data : Line_Char_Data, callback?:(handler?:Line_Chart)=>void) : Line_Chart,
        (arg:void) : Array<number>
    },
    markerSize : {
        (size : Marker_Size, callback?:(handler?:Line_Chart)=>void):Line_Chart,
        (arg:void) : number | Array<number>
    }
}