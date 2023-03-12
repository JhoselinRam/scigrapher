import { Axis_Property, BorderProperties, Graph2D, graphCallback, RecursivePartial } from "../../Graph2D_Types";

export interface Border{
    draw : ()=>void,
    border : {
        (border : Border_Modifier, callback?:graphCallback) : Graph2D,
        (arg : void) : Axis_Property<{start : BorderProperties, end : BorderProperties}>
    }
}

export interface Draw_Border {
    border : BorderProperties,
    from : [number, number],
    to : [number, number],
    context : CanvasRenderingContext2D
}

export interface Border_Modifier extends RecursivePartial<Axis_Property<{
    start : BorderProperties,
    end : BorderProperties
}>> {
    border ?: BorderProperties,
}