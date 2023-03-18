import { Area, Area_Callback } from "../../Area_Types";

export interface Area_Properties_Methods{
    enable : Area_Properties_Generated<boolean>,
    polar : Area_Properties_Generated<boolean>,
    color : Area_Properties_Generated<string>,
    opacity : Area_Properties_Generated<number>,
}

export type Area_Properties_Options = "enable" | "polar" | "color" | "opacity";

export type Area_Properties_Generated<T> = {
    (property : T, callback ?: Area_Callback) : Area,
    (arg : void) : T
}