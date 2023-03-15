import { Colorbar, Colorbar_Callback, Colorbar_Position } from "../../Colorbar_Types";

export interface Colorbar_Properties_Methods {
    enable : Colorbar_Property_Generator<boolean>,
    reverse : Colorbar_Property_Generator<boolean>,
    unit : Colorbar_Property_Generator<string>,
    position : Colorbar_Property_Generator<Colorbar_Position>,
    size : Colorbar_Property_Generator<number>,
    opacity : Colorbar_Property_Generator<number>,
    width : Colorbar_Property_Generator<number>
}

export type Colorbar_Property_Options = "enable" | "reverse" | "unit" | "position" | "size" | "opacity" | "width";

export type Colorbar_Property_Generator<T> = {
    (property:T, callback?:Colorbar_Callback) : Colorbar,
    (arg:void) : T
}