import { Rect } from "../../../Graph2D/Graph2D_Types";
import { Colorbar, Colorbar_Callback, Colorbar_Floating, Colorbar_Line, Colorbar_Marker, Colorbar_Position } from "../../Colorbar_Types";

export interface Colorbar_Properties_Methods {
    enable : Colorbar_Property_Generator<boolean>,
    reverse : Colorbar_Property_Generator<boolean>,
    unit : Colorbar_Property_Generator<string>,
    size : Colorbar_Property_Generator<number>,
    opacity : Colorbar_Property_Generator<number>,
    width : Colorbar_Property_Generator<number>,
    border : Colorbar_Object_Generator<Colorbar_Line>, 
    ticks : Colorbar_Object_Generator<Colorbar_Marker>, 
    id : ()=>string,
    position : {
        (position:Colorbar_Position, callback?:Colorbar_Callback) : Colorbar,
        (arg:void) : string
    },
    metrics : ()=>Rect
}

export type Colorbar_Property_Options = "enable" | "reverse" | "unit" | "position" | "size" | "opacity" | "width";
export type Colorbar_Object_Options = "border" | "ticks"

export type Colorbar_Property_Generator<T> = {
    (property:T, callback?:Colorbar_Callback) : Colorbar,
    (arg:void) : T
}

export type Colorbar_Object_Generator<T> = {
    (property:Partial<T>, callback?:Colorbar_Callback) : Colorbar,
    (arg:void) : T
}