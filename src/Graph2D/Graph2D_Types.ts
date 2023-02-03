import { Axis_Obj } from "../tools/Axis_Obj/Axis_Obj_Types";
import { Mapping } from "../tools/Mapping/Mapping_Types";
import { Axis } from "./resourses/Axis/Axis_Types";
import { Background } from "./resourses/Background/Background_Types";
import { Grid } from "./resourses/Grid/Grid_Types";
import { Labels } from "./resourses/Labels/Labels_Types";
import { Margin } from "./resourses/Margin/Margin_Types";

export interface Graph2D extends 
    Omit<Background, "draw" | "drawClientRect">, 
    Omit<Axis,"compute" | "draw">, 
    Omit<Labels,"compute" | "draw">,
    Omit<Grid, "compute" | "draw">,
    Margin{}

export type Axis_Position = "center" | "bottom-left" | "bottom-right" | "top-left" | "top-right";
export type Axis_Type = "rectangular" | "polar" | "x-log" | "y-log" | "log-log";

export interface Graph2D_Options{
    background : {
        color : string,
        opacity : number
    },
    margin : Axis_Property<{
        start : number,
        end : number
    }>,
    axis : {
        type : Axis_Type,
        position : Axis_Position,
        overlapPriority : "x" | "y"
    } & Axis_Property<Primary_Axis>,
    secondary : Partial<Axis_Property<Secondary_Axis>>,
    labels : {
        title ?: LabelProperties,
        subtitle ?: LabelProperties,
        xPrimary ?:LabelProperties,
        yPrimary ?:LabelProperties,
        xSecondary ?: LabelProperties,
        ySecondary ?: LabelProperties
    },
    grid : {
        primary : Axis_Property<Primary_Grid>,
        secondary : Axis_Property<Secondary_Grid>
    }
}

export interface Primary_Grid {
    enable : boolean,
    color : string,
    opacity : number,
    width : number,
    style : string
}

export interface Secondary_Grid extends Primary_Grid {
    minSpacing : number,
    maxDensity : number,
    density : "auto" | number
}

export type LabelProperties = {
    enable : boolean,
    text : string,
    font : string,
    size : string,
    color : string,
    opacity : number,
    filled : boolean,
    position : "start" | "center" | "end"
}

export interface Primary_Axis {
    start : number,
    end : number,
    unit : string,
    baseColor : string,
    baseOpacity : number,
    baseWidth : number,
    tickColor : string,
    tickOpacity : number,
    tickWidth : number,
    tickSize :number,
    textColor : string,
    textOpacity : number,
    textFont : string,
    textSize : string,
    dynamic : boolean,
    contained : boolean,
    ticks : "auto" | number | Array<number>,
    minSpacing : number,
    overlap : boolean
}

export interface Secondary_Axis extends Omit<Primary_Axis, "dynamic"|"contained"|"overlap"> {
    enable : boolean,
    type : "rectangular" | "log"
} 

export interface Graph2D_State extends Graph2D_Options {
    container : HTMLDivElement,
    render : ()=>void,
    labelOffset : number,
    context : {
        clientRect : {
            x : number,
            y : number,
            width : number,
            height : number
        },
        canvas : CanvasRenderingContext2D
    },
    scale : {
        primary : Axis_Property<Mapping>
        secondary : Partial<Axis_Property<Mapping>>
    }
    compute : {
        full : ()=>void,
        client : ()=>void,
        scale : ()=>void,
        axis : ()=>void,
        labels : ()=>void
    },
    draw : {
        full : ()=>void,
        client : ()=>void,
        background : ()=>void,
        backgroundClientRect : ()=>void,
        labels : ()=>void
        axis : ()=>void,
        grid : ()=>void
    },
    axisObj : {
        primary : {
            width : number,
            height : number,
            obj ?: Axis_Property<Axis_Obj>
        },
        secondary : {
            width : number,
            height : number,
            obj ?: Partial<Axis_Property<Axis_Obj>>
        }
    }
}

export interface Method_Generator{
    state : Graph2D_State,
    graphHandler : Graph2D
}

export type RecursivePartial<T> = {
    [P in keyof T]?: RecursivePartial<T[P]>;
}

type ChildrenPartial<T> = {
    [P in keyof T] : Partial<T[P]>
}

export type RequiredExept<T, K extends keyof T> = Pick<ChildrenPartial<T>,K> & Omit<T,K>

export type Axis_Property<T> = {
    x : T,
    y : T
}