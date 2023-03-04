import { Graph2D } from "../../../../Graph2D/Graph2D_Types";
import { Field_Property } from "../../../Data_Types";
import { Vector_Field, Vector_Field_Callback, Vector_Field_State, Vector_Property_Generator } from "../../Vector_Field_Types";

export interface Properties_Vector{
    vectorColor : Dynamic_Property_Method<string>,
    vectorOpacity : Dynamic_Property_Method<number>,
    vectorWidth : Dynamic_Property_Method<number>,
    vectorStyle : Dynamic_Property_Method<string>,
    vectorEnable : Static_Property_Method<boolean>,
    vectorNormalized : Static_Property_Method<boolean>,
    vectorMaxLength : Static_Property_Method<number>
}

export type Static_Properties = "normalized" | "maxLenght" | "enable";

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