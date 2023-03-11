import { Axis_Property, Graph2D, graphCallback, Rect, RecursivePartial, Secondary_Grid } from "../../../Graph2D_Types";

export interface Secondary_Grid_Generator {
    draw : (graphRect : Rect)=>void,
    secondaryGrid : {
        (grid : Secondary_Grid_Modifier, callback?:graphCallback) : Graph2D,
        (arg : void) : Axis_Property<Secondary_Grid>
    }
}

export interface Secondary_Grid_Modifier extends RecursivePartial<Axis_Property<Secondary_Grid>> {
    grid ?: Secondary_Grid
}