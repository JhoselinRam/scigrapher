import { Graph2D, Graph2D_Save_Asset } from "../../../../Graph2D/Graph2D_Types";
import { Field_Property } from "../../../Data_Types";
import { Vector_Field, Vector_Field_Callback, Vector_Field_State, Vector_Property_Generator } from "../../Vector_Field_Types";

export interface Properties_Vector{
    color : Dynamic_Property_Method<string>,
    opacity : Dynamic_Property_Method<number>,
    width : Dynamic_Property_Method<number>,
    style : Dynamic_Property_Method<string>,
    enable : Static_Property_Method<boolean>,
    normalize : Static_Property_Method<boolean>,
    maxLength : Static_Property_Method<number>,
    save : ()=>Graph2D_Save_Asset
}

export type Static_Properties = "normalize" | "maxLength" | "enable";

export type Dynamic_Properties = "color" | "opacity" | "width" | "style";

export type Static_Property_Method<T> = {
    (property:T, callback?:Vector_Field_Callback) : Vector_Field,
    (arg:void) : T
}

export type Dynamic_Property_Method<T> = {
    (property:Vector_Property_Generator<T>, callback?:Vector_Field_Callback) : Vector_Field,
    (arg:void) : T | Field_Property<T>
}

export interface Generator_Props<T>{
    dataState : Vector_Field_State,
    dataHandler : Vector_Field,
    graphHandler : Graph2D,
    property : T
}