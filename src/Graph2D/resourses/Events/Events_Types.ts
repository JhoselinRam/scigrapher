import { Mapping } from "../../../tools/Mapping/Mapping_Types";
import { Axis_Property, Graph2D, RecursivePartial } from "../../Graph2D_Types"

export type Aspect_Ratio_Axis = "x" | "y" | "xSecondary" | "ySecondary"

export interface Events {
    aspectRatio : (options : Partial<Aspect_Ratio>)=>Graph2D,
    pointerMove : (options : Partial<Pointer_Move_Props>)=>Graph2D,
    pointerZoom : (options : RecursivePartial<Pointer_Zoom_Props>)=>Graph2D,
    containerResize : (options : RecursivePartial<Resize_Event_Props>)=>Graph2D
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
    primaryAxis : boolean,
    secondaryAxis : boolean
}

export interface Pointer_Zoom_Props extends Pointer_Move_Props{
    type : "area" | "drag",
    strength : number,
    anchor : "pointer" | "center" | [number,number]
    rect : {
        background : string,
        opacity : number,
        borderColor : string,
        borderWidth : number,
        borderOpacity : number
    }
}

export type Move_Event = Axis_Property<number>
export type Zoom_Event = Axis_Property<number> & {
    type : "area" | "drag",
    shiftKey : boolean,
    anchor : "center" | "pointer" | [number, number],
    touch : boolean
}

export interface Event_Cursor {
    hover : string,
    move : string,
    default : string
}

export interface Move_State {
    enable : boolean,
    callback ?: (handler : Graph2D)=>void,
    delay : number,
    onMove : (position : Move_Event)=>void, 
    positionA : Axis_Property<number>,
    primaryAxis : boolean,
    secondaryAxis : boolean
}

export interface Zoom_State extends Omit<Move_State, "onMove">{
    type : "area" | "drag",
    strength : number,
    anchor : "center" | "pointer" | [number, number],
    onZoom : (zoom : Zoom_Event)=>void,
    positionB : Axis_Property<number>,
    rect : {
        background : string,
        opacity : number,
        borderColor : string,
        borderWidth : number,
        borderOpacity : number
    },
    touch : {
        onZoomTouch : ()=>void,
        distance : number,
        anchor : Axis_Property<number>
    }
}

export interface Pointer_State {
    pointers : Array<Pointer_Info>   
    lastDomain : Axis_Property<{
        start : number,
        end : number
    }>,
    lastScale : Axis_Property<Mapping>,
    pointerCapture : boolean
}

export interface Pointer_Info {
    id : number,
    position : Axis_Property<number>
}

export interface Resize_Event_Props {
    enable : boolean,
    preserveAspectRatio : boolean,
    anchor : "center" | [number, number],
    secondaryAnchor : "center" | [number, number],
    callback ?: (handler:Graph2D)=>void,
    delay : number,
    primaryAxis : boolean,
    secondaryAxis : boolean
}

export interface Resize_State extends Resize_Event_Props {
    onResize : (container : ResizeObserverEntry)=>void,
    observer : ResizeObserver,
    reset : boolean
}

export interface Resize_Axis {
    start : number,
    end : number,
    anchor : number,
    scale : Mapping,
    lastSize : number,
    newSize : number
}