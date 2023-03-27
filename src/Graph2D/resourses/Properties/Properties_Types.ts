import { Mapping } from "../../../tools/Mapping/Mapping_Types";
import { Axis_Property, Graph2D, Graph2D_Options, Graph2D_Save_Graph, graphCallback, Rect } from "../../Graph2D_Types";

export interface Properties{
    canvasElements : ()=>Array<HTMLCanvasElement>,
    clientRect : ()=> Rect,
    graphRect : ()=>Rect,
    draw : ()=>Graph2D,
    mapping : ()=>Graph2D_Mappings,
    save : ()=> Graph2D_Save_Graph,
    containerSize : {
        (size:Partial<Container_Size>, callback ?: graphCallback) : Graph2D,
        (arg : void) : Container_Size
    }
}

export interface Graph2D_Mappings {
    primary : Axis_Property<Mapping>,
    secondary : Partial<Axis_Property<Mapping>>
}

export interface Container_Size {
    width : number,
    height : number
}