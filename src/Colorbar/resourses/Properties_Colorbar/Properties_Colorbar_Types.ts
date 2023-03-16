import { Colorbar, Colorbar_Callback, Colorbar_Floating, Colorbar_Line, Colorbar_Marker, Colorbar_Position } from "../../Colorbar_Types";

export interface Colorbar_Properties_Methods {
    enable : Colorbar_Property_Generator<boolean>,
    reverse : Colorbar_Property_Generator<boolean>,
    unit : Colorbar_Property_Generator<string>,
    position : Colorbar_Property_Generator<Colorbar_Position>,
    size : Colorbar_Property_Generator<number>,
    opacity : Colorbar_Property_Generator<number>,
    width : Colorbar_Property_Generator<number>,
    border : Colorbar_Object_Generator<Colorbar_Line>, 
    floating : Colorbar_Object_Generator<Colorbar_Floating>, 
    ticks : Colorbar_Object_Generator<Colorbar_Marker>, 
}

export type Colorbar_Property_Options = "enable" | "reverse" | "unit" | "position" | "size" | "opacity" | "width";
export type Colorbar_Object_Options = "border" | "ticks" | "floating"

export type Colorbar_Property_Generator<T> = {
    (property:T, callback?:Colorbar_Callback) : Colorbar,
    (arg:void) : T
}

export type Colorbar_Object_Generator<T> = {
    (property:Partial<T>, callback?:Colorbar_Callback) : Colorbar,
    (arg:void) : T
}