import { Area, Area_Callback, Area_Data } from "../../Area_Types"

export interface Area_Data_Methods{
    dataX : Area_Data_Generated,
    dataY : Area_Data_Generated,
    baseX : Area_Data_Generated,
    baseY : Area_Data_Generated,
}

export type Area_Data_Generated = {
    (data : Area_Data, callback?:Area_Callback) : Area,
    (arg:void) : Array<number>
}