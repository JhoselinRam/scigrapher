import { Axis_Property } from "../../../../Graph2D/Graph2D_Types"
import { Line_Chart, Line_Char_Data, Marker_Size } from "../../LineChart_Types"

export interface Bind_Line{
    data : {
        (data : Partial<Axis_Property<Line_Char_Data>>, callback?:(handler?:Line_Chart)=>void) : Line_Chart,
        (arg:void) : Axis_Property<Array<number>>
    },
    markerSize : {
        (size : Marker_Size, callback?:(handler?:Line_Chart)=>void):Line_Chart,
        (arg:void) : number | Array<number>
    }
}