import { Graph2D, Rect } from "../../Graph2D_Types";

export interface Properties{
    canvasElements : ()=>Array<HTMLCanvasElement>,
    clientRect : ()=> Rect,
    graphRect : ()=>Rect,
    draw : ()=>Graph2D,
}