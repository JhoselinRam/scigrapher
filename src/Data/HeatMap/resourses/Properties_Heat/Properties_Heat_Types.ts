import { Axis_Property, Graph2D_Save_Asset } from "../../../../Graph2D/Graph2D_Types"
import { Field_Property } from "../../../Data_Types"
import { Heat_Map, Heat_Map_Callback, Heat_Map_Color, Heat_Map_Opacity } from "../../Heat_Map_Types"

export interface Properties_Heat{
    enable : {
        (enable:boolean, callback?:Heat_Map_Callback) : Heat_Map,
        (arg : void) : boolean
    },
    useAxis : {
        (axis:Partial<Axis_Property<"primary" | "secondary">>, callback?:Heat_Map_Callback) : Heat_Map,
        (arg : void) : Axis_Property<"primary" | "secondary">
    },
    smooth : {
        (smooth:boolean, callback?:Heat_Map_Callback) : Heat_Map,
        (arg : void) : boolean
    },
    opacity : {
        (opacity : Heat_Map_Opacity, callback?:Heat_Map_Callback) : Heat_Map,
        (arg : void) : number | Field_Property<number>
    },
    color : {
        (color:Heat_Map_Color, callback?:Heat_Map_Callback) : Heat_Map,
        (arg : void) : Field_Property<string>
    },
    save : ()=>Graph2D_Save_Asset
}