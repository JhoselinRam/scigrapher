import { Axis_Property } from "../../../../Graph2D/Graph2D_Types"
import { Area, Area_Callback, Area_Data } from "../../Area_Types"

export interface Area_Data_Methods{
    dataX : Area_Data_Generated,
    dataY : Area_Data_Generated,
    baseX : Area_Data_Generated,
    baseY : Area_Data_Generated,
    axisUsed : {
        (axis:Partial<Axis_Property<"primary" | "secondary">>, callback?:Area_Callback) : Area,
        (arg:void) : Axis_Property<"primary" | "secondary">
    }
}

export type Area_Data_Generated = {
    (data : Area_Data, callback?:Area_Callback) : Area,
    (arg:void) : Array<number>
}