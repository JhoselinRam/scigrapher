import { Field_Data, Field_Position, Field_Property } from "../../../Data_Types"
import { Heat_Map, Heat_Map_Callback } from "../../Heat_Map_Types"

export interface Data_Heat {
    data : {
        (data : Field_Data<Heat_Map>, callback?:Heat_Map_Callback) : Heat_Map,
        (arg:void) : Field_Property<number>
    },
    meshX : Heat_Position_Generator,
    meshY : Heat_Position_Generator
}

export type Heat_Position_Generator = {
    (data:Field_Position<Heat_Map>, callback?:Heat_Map_Callback) : Heat_Map,
    (arg:void) : Field_Property<number>
}
