import { Mapping } from "../../../tools/Mapping/Mapping_Types";
import { Axis_Property, Graph2D, Rect } from "../../Graph2D_Types";

export interface Properties{
    canvasElements : ()=>Array<HTMLCanvasElement>,
    clientRect : ()=> Rect,
    graphRect : ()=>Rect,
    draw : ()=>Graph2D,
    mapping : ()=>Graph2D_Mappings
}

export interface Graph2D_Mappings {
    primary : Axis_Property<Mapping>,
    secondary : Partial<Axis_Property<Mapping>>
}