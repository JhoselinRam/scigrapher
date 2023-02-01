import { Axis_Property, Graph2D, RecursivePartial, Secondary_Grid } from "../../../Graph2D_Types";

export interface Secondary_Grid_Generator {
    draw : (xMin : number, xMax : number, yMin : number, yMax:number)=>void,
    secondaryGrid : {
        (grid : RecursivePartial<Axis_Property<Secondary_Grid>>) : Graph2D,
        (arg : void) : Axis_Property<Secondary_Grid>
    }
}