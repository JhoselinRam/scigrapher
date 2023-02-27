import { Line_Chart, Line_Char_Data } from "../../LineChart_Types"

export interface Data_Line {
    dataX : {
        (data : Line_Char_Data, callback?:(handler?:Line_Chart)=>void) : Line_Chart,
        (arg:void) : Array<number>
    },
    dataY : {
        (data : Line_Char_Data, callback?:(handler?:Line_Chart)=>void) : Line_Chart,
        (arg:void) : Array<number>
    }
}