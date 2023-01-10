import { Mapping } from "../tools/Mapping/Mapping_Types";
import { Axis } from "./resourses/Axis/Axis_Types";
import { Background } from "./resourses/Background/Background_Types";

export interface Graph2D extends Background, Omit<Axis, "compute">{

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
        xLabelColor : string,
        xLabelOpacity : number
        yBaseColor : string,
        yBaseOpacity : number,
        yTickColor : string,
        yTickOpacity : number,
        yLabelColor : string,
        yLabelOpacity : number,
        xContained : boolean,
        xDynamic : boolean,
        yContained : boolean,
        yDynamic : boolean
    },
    secondary : {
        x : {
            start : number,
            end : number,
            position : "top" | "bottom",
            type : Omit<Axis_Type, "polar">,
            unit : string,
            baseColor : string,
            baseOpacity : number,
            tickColor : string,
            tickOpacity : number,
            labelColor : string,
            labelOpacity : number
        },
        y : {
            start : number,
            end : number,
            position : "top" | "bottom",
            type : Omit<Axis_Type, "polar">,
            unit : string,
            baseColor : string,
            baseOpacity : number,
            tickColor : string,
            tickOpacity : number,
            labelColor : string,
            labelOpacity : number
        }
    }
}

export interface Graph2D_State extends Graph2D_Options {
    container : HTMLDivElement,
    id  : string,
    render : ()=>void,
    fullCompute : ()=>void,
    secondaryEnabled : Axis_Modifier<boolean>
    scale : {
        primary : Axis_Modifier<Mapping>
        secondary : Axis_Modifier<Mapping>
        reference : Axis_Modifier<Mapping>
    }
    compute : {
        scale : ()=>void,
        axis : ()=>void
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
    [P in keyof T] : RecursivePartial<T[P]>
}

export type RequiredExept<T, K extends keyof T> = Pick<ChildrenPartial<T>,K> & Omit<T,K>

export type Axis_Modifier<T> = {
    x : T,
    y : T
}