import { Graph2D, Graph2D_State, Line_Style } from "../Graph2D/Graph2D_Types";

export interface Colorbar{

}

export interface Colorbar_Options {
    enable : boolean,
    reverse : boolean,
    ticks : Colorbar_Line & {
        density : Colorbar_Ticks
    },
    unit : string,
    position : Colorbar_Position,
    size : number,
    opacity : number
    label : Colorbar_Text,
    title : Colorbar_Text&{
        text:string,
        reverse : boolean
    },
    width : number,
    floating : Colorbar_Floating,
    border : Colorbar_Line,
    data : Colorbar_Data
}

export type Colorbar_Ticks = number | Array<string> | Array<{position:number, label:string}>;

export type Colorbar_Position = "x-start" | "x-end" | "y-start" | "y-end" | "floating";

export type Colorbar_Data = string | Array<{color:string, position:number, label:string}>;

export interface Colorbar_Text {
    font : string,
    size : string,
    color : string,
    opacity : number,
    position : "start" | "end",
    filled : boolean
}

export interface Colorbar_Floating {
    x : number,
    y : number,
    orientation : "vertical" | "horizontal"
}

export interface Colorbar_Line {
    color : string,
    opacity : number,
    style : Line_Style,
    width : number
}

export interface Colorbar_State extends Colorbar_Options {
    id : string,
    metrics : {
        width : number,
        height : number,
        barCoord : number,
        titleCoord : number,
        labelCoord : number
    },
    gradient : Colorbar_Gradient,
    textOffset : number
}

export interface Colorbar_Gradient {
    entries : Array<{color:string, position:number, label:string}>,
    gradientObject : CanvasGradient
} 

export interface Colorbar_Method_Generator {
    barState : Colorbar_State,
    barHandler : Colorbar,
    state : Graph2D_State, 
    graphHandler : Graph2D
}
