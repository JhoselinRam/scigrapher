import { Graph2D } from "../../Graph2D_Types"

export interface Events {
    aspectRatio : (options : Aspect_Ratio)=>Graph2D,
    pointerMove : (options : Pointer_Move_Props)=>Graph2D
}

export interface Aspect_Ratio {
    ratio : number,
    axis : "x"|"y",
    anchor : "start" | "end" | number
}

export interface Pointer_Move_Props {
    
}