import { Dataset_Types } from "../Data/Data_Types";
import { Axis_Property, Graph2D, Graph2D_State, Line_Style } from "../Graph2D/Graph2D_Types";
import { Colorbar_Data_Methods } from "./resourses/Data_Colorbar/Data_Colorbar_Types";
import { Colorbar_Properties_Methods } from "./resourses/Properties_Colorbar/Properties_Colorbar_Types";
import { ColorBar_Text_Methods } from "./resourses/Text_Colorbar/Text_Colorbar_Types";

export interface Colorbar extends
ColorBar_Text_Methods,
Omit<Colorbar_Properties_Methods, "save">,
Colorbar_Data_Methods
{}

export interface Colorbar_Options {
    enable : boolean,               
    reverse : boolean,              
    ticks : Colorbar_Marker,        
    unit : string,                  
    size : number,                  
    opacity : number,               
    label : Colorbar_Text,          
    title : Colorbar_Title,         
    width : number,                 
    border : Colorbar_Line,         
    data : Colorbar_Data
    position : Colorbar_Position,   
    id : string,
}

export type Colorbar_Entries = Array<{color:string, position:number, label:string}>;

export type Colorbar_Ticks = number | Array<string> | Array<{position:number, label:string}>;

export type Colorbar_Position = "x-start" | "x-end" | "y-start" | "y-end" | Colorbar_Floating;

export type Colorbar_Data = string | Colorbar_Entries;

export interface Colorbar_Text {
    font : string,
    size : string,
    specifier : string,
    color : string,
    opacity : number,
    position : "start" | "end"
}

export interface Colorbar_Title extends Colorbar_Text{
    text:string,
    reverse : boolean
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

export interface Colorbar_Marker extends Colorbar_Line {
    density : Colorbar_Ticks
}

export interface Colorbar_State extends Colorbar_Options {
    metrics : {
        position : Axis_Property<number>,
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
    entries : Colorbar_Entries,
    gradientObject : CanvasGradient
} 

export interface Colorbar_Method_Generator {
    barState : Colorbar_State,
    barHandler : Colorbar,
    state : Graph2D_State, 
    graphHandler : Graph2D
}

export type Colorbar_Callback = (bar?:Colorbar, graphHandler?:Graph2D, datasets?:Array<Dataset_Types>)=>void;
