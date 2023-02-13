import { Graph2D } from "../../Graph2D_Types"

export interface Events {
    aspectRatio : (options : Aspect_Ratio_Props)=>Graph2D,
    pointerMove : (options : Pointer_Move_Props)=>Graph2D
}

export interface Aspect_Ratio_Props {
    ratio : number,
    axis : "x"|"y",
    anchor : "start" | "end" | number
}

export interface Pointer_Move_Props {
    enable : boolean,
    callBack ?: (handler:Graph2D)=>void,
    delay : number,
    hoverCursor : string,
    moveCursor : string,
    defaultCursor : string,
    pointerCapture : boolean
}

export interface Move_Graph {
    x : number,
    y : number
}