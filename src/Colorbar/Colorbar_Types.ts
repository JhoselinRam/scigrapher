import { Graph2D, Graph2D_State, Line_Style } from "../Graph2D/Graph2D_Types";

export interface Colorbar{

}

export interface Colorbar_Options {
    enable : boolean,
    reverse : boolean,
    ticks : Colorbar_Ticks,
    unit : string,
    position : Colorbar_Position,
    size : number,
    opacity : number
    label : Colorbar_Label,
    width : number,
    floating : Colorbar_Floating,
    border : Colorbar_Border,
    data : Colorbar_Data
}

export type Colorbar_Ticks = number | Array<string> | Array<{position:number, label:string}>;

export type Colorbar_Position = "x-start" | "x-end" | "y-start" | "y-end" | "floating";

export type Colorbar_Data = string | Colorbar_Gradient;

export interface Colorbar_Label {
    font : string,
    size : string,
    color : string,
    opacity : number,
    width : number,
    position : "in" | "out",
    title : string
}

export interface Colorbar_Floating {
    x : number,
    y : number,
    orientation : "vertical" | "horizontal"
}

export interface Colorbar_Border {
    color : string,
    opacity : number,
    style : Line_Style,
    width : number
}

export interface Colorbar_State extends Colorbar_Options {
    id : string,
    absoluteSize : {
        width : number,
        height : number
    },
    gradient : Colorbar_Gradient
}

export type Colorbar_Gradient = Array<{color:string, position:number, label:string}>

export interface Colorbar_Method_Generator {
    barState : Colorbar_State,
    barHandler : Colorbar,
    state : Graph2D_State, 
    graphHandler : Graph2D
}
