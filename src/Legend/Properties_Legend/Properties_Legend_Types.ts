import { Graph2D_Save_Asset, Rect } from "../../Graph2D/Graph2D_Types";
import { Legend, Legend_Border, Legend_Callback, Legend_Data_Entrie, Legend_Position, Legend_Title } from "../Legend_Types";

export interface Legend_Properties {
    enable : Legend_Static_Method<boolean>, 
    columns : Legend_Static_Method<number>, 
    width : Legend_Static_Method<number>, 
    id : Legend_Static_Method<string>, 
    border : Legend_Dynamic_Method<Legend_Border>, 
    background : Legend_Dynamic_Method<{color:string, opacity:number}>, 
    title : Legend_Dynamic_Method<Legend_Title>, 
    data : {
        (data:Array<Partial<Legend_Data_Entrie>>, callback?:Legend_Callback) : Legend,
        (arg : void) : Array<Legend_Data_Entrie>
    },
    position : {
        (position : Legend_Position, callback?:Legend_Callback) : Legend,
        (arg : void) : string
    },
    metrics : ()=>Rect,
    save : ()=>Graph2D_Save_Asset
}

export type Legend_Static_Properties_Options = "enable" | "columns" | "width" | "id";

export type Legend_Dynamic_Properties_Options = "border" | "background" | "title";

export type Legend_Static_Method<T> = {
    (property : T, callback?:Legend_Callback) : Legend,
    (arg : void) : T
}

export type Legend_Dynamic_Method<T> = {
    (property : Partial<T>, callback?:Legend_Callback) : Legend,
    (arg : void) : T
}
