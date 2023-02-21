import { Axis_Property, Graph2D, RecursivePartial, Secondary_Grid } from "../../../Graph2D_Types";

export interface Secondary_Grid_Generator {
    draw : (xMin : number, xMax : number, yMin : number, yMax:number)=>void,
    secondaryGrid : {
        (grid : Secondary_Grid_Modifier, callback?:(handler?:Graph2D)=>void) : Graph2D,
        (arg : void) : Axis_Property<Secondary_Grid>
    }
}

export interface Secondary_Grid_Modifier extends RecursivePartial<Axis_Property<Secondary_Grid>> {
    grid ?: Secondary_Grid
}