import { Axis_Property } from "../../../../Graph2D/Graph2D_Types"
import { Line_Chart, Line_Char_Data } from "../../LineChart_Types"

export interface Bind_Line{
    data : {
        (data : Partial<Axis_Property<Line_Char_Data>>) : Line_Chart,
        (arg:void) : Axis_Property<Array<number>>
    }
}