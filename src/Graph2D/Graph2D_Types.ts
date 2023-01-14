import { Mapping } from "../tools/Mapping/Mapping_Types";
import { Axis } from "./resourses/Axis/Axis_Types";
import { Background } from "./resourses/Background/Background_Types";
import { Labels } from "./resourses/Labels/Labels_Types";

export interface Graph2D extends 
    Background, 
    Omit<Axis,"compute" | "draw">, 
    Omit<Labels,"compute" | "draw">{
}

export type Axis_Position = "center" | "bottomLeft" | "bottomRight" | "topLeft" | "topRight";
export type Axis_Type = "rectangular" | "polar" | "x-log" | "y-log" | "log-log";

export interface Graph2D_Options{
    background : {
        color : string,
        opacity : number
    },
    canvas : {
        marginStart : number,
        marginEnd : number,
        marginTop : number,
        marginBottom : number
    },
    axis : {
        xStart : number,
        xEnd : number,
        yStart : number,
        yEnd : number,
        position : Axis_Position,
        type : Axis_Type,
        xUnit : string,
        yUnit : string,
        xBaseColor : string,
        xBaseOpacity : number,
        xTickColor : string,
        xTickOpacity : number,
        xTextColor : string,
        xTextOpacity : number
        yBaseColor : string,
        yBaseOpacity : number,
        yTickColor : string,
        yTickOpacity : number,
        yTextColor : string,
        yTextOpacity : number,
        xContained : boolean,
        xDynamic : boolean,
        yContained : boolean,
        yDynamic : boolean
    },
    secondary : {
        x : Secondary_Axis<"top" | "bottom">,
        y : Secondary_Axis<"left" | "right">
    },
    labels : {
        title : LabelProperties,
        subtitle : LabelProperties,
        xPrimary :LabelProperties,
        yPrimary :LabelProperties,
        xSecondary : LabelProperties,
        ySecondary : LabelProperties
    }
}

type LabelProperties = {
    text : string,
    font : string,
    color : string,
    opacity : number,
    filled : boolean,
    position : "start" | "center" | "end"
}

type Secondary_Axis<T> = {
    start : number,
    end : number,
    position : T,
    type : Omit<Axis_Type, "polar">,
    unit : string,
    baseColor : string,
    baseOpacity : number,
    tickColor : string,
    tickOpacity : number,
    textColor : string,
    textOpacity : number
} 

export interface Graph2D_State extends Graph2D_Options {
    container : HTMLDivElement,
    render : ()=>void,
    secondaryEnabled : Axis_Property<boolean>,
    context : {
        drawRect : {
            x : number,
            y : number,
            width : number,
            height : number
        },
        canvas : CanvasRenderingContext2D
    },
    scale : {
        primary : Axis_Property<Mapping>
        secondary : Axis_Property<Mapping>
        reference : Axis_Property<Mapping>
    }
    compute : {
        full : ()=>void,
        scale : ()=>void,
        axis : ()=>void,
        labels : ()=>void
    },
    draw : {
        full : ()=>void,
        axis : ()=>void,
        labels : ()=>void
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