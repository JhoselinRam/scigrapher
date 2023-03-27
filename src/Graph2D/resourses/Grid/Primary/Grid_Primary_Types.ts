import { Axis_Property, Graph2D, graphCallback, Primary_Grid, Rect, RecursivePartial } from "../../../Graph2D_Types"

export interface Primary_Grid_Generator {
    draw : (graphRect : Rect)=>void,
    primaryGrid : {
        (grid : Primary_Grid_Modifier, callback?:graphCallback) : Graph2D,
        (arg : void) : Axis_Property<Primary_Grid>
    }
}

export interface Primary_Grid_Modifier extends RecursivePartial<Axis_Property<Primary_Grid>> {
    grid ?: Partial<Primary_Grid>
}