import { Axis_Property, Graph2D, RecursivePartial } from "../../Graph2D_Types"

export type Aspect_Ratio_Axis = "x" | "y" | "xSecondary" | "ySecondary"

export interface Events {
    aspectRatio : (options : Partial<Aspect_Ratio>)=>Graph2D,
    pointerMove : (options : Partial<Pointer_Move_Props>)=>Graph2D,
    pointerZoom : (options : RecursivePartial<Pointer_Zoom_Props>)=>Graph2D
}

export interface Aspect_Ratio {
    ratio : number,
    sourse : Aspect_Ratio_Axis,
    target : Aspect_Ratio_Axis,
    anchor : "start" | "end" | number
}

export interface Pointer_Move_Props {
    enable : boolean,
    callback ?: (handler:Graph2D)=>void;
    delay : number,
    pointerCapture : boolean,
    hoverCursor : string,
    moveCursor : string,
    defaultCursor : string,
}

export interface Pointer_Zoom_Props extends Pointer_Move_Props{
    type : "area" | "drag",
    axis : "x" | "y",
    strength : number,
    rect : {
        background : string,
        opacity : number,
        borderColor : string,
        borderWidth : number,
        borderOpacity : number
        borderStyle : string
    }
}

export type Move_Event = Axis_Property<number>
export type Zoom_Event = Axis_Property<number> & {
    type : "area" | "drag",
    shiftKey : boolean
}