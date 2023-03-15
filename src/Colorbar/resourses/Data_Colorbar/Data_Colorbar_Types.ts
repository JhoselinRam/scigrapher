import { Colorbar, Colorbar_Callback, Colorbar_Data, Colorbar_Entries } from "../../Colorbar_Types"

export interface Colorbar_Data_Methods {
    data : {
        (data:Colorbar_Data, callback?:Colorbar_Callback) : Colorbar,
        (arg:void) : Colorbar_Entries
    }
}