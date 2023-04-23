import { Dataset_Types } from "../Data/Data_Types";
import { Axis_Property, Graph2D, Graph2D_State, Line_Style, Rect } from "../Graph2D/Graph2D_Types";
import { Legend_Properties } from "./Properties_Legend/Properties_Legend_Types";

export interface Legend extends
Omit<Legend_Properties, "save"> {
    
}

export interface Legend_Options {
    enable : boolean,
    border : Legend_Border,
    background :{
        color : string,
        opacity : number
    },
    title : Legend_Title,
    columns : number,
    data : Array<Legend_Data_Entrie>,
    width : number,
    position : Legend_Position,
    id : string,
}

export interface Legend_Border {
    color : string,
    opacity : number,
    width : number,
    style : Line_Style
}

export interface Legend_Text {
    font : string,
    size : string,
    color : string,
    opacity : number,
    specifier : string
}

export interface Legend_Data_Entrie {
    dataset : string,
    label : string,
    text : Legend_Text,
}

export interface Legend_Title extends Legend_Text {
    position : "start" | "end" | "center",
    text : string
}

export type Legend_Position = "top-right" | "top-left" | "bottom-right" | "bottom-left" | "center" | Axis_Property<number>

export interface Legend_State extends Legend_Options {
    compute : ()=>void,
    metrics : {
        x : number,
        y : number,
        width : number,
        height : number,
        textOffset : number,
        titleCoord : number,
        items : Array<Legend_Item>,
        data : Array<Legend_Data_Entrie>
    }
}

export type Legend_Callback = (legend:Legend, graph:Graph2D)=>void;

export interface Legend_Method_Generator {
    legendState : Legend_State,
    legendHandler : Legend,
    state : Graph2D_State,
    graphHandler : Graph2D
}

interface Legend_Item extends Rect {
    drawIcon : DrawIcon
}

export type DrawIcon = <T extends Dataset_Types>(options : Draw_Icon_Props<T>)=>void;

export interface Draw_Icon_Props<T extends Dataset_Types> {
    dataset : T,
    state : Graph2D_State,
    legendState : Legend_State,
    x : number,
    y : number
}