import { Axis_Property, Graph2D, Primary_Grid, RecursivePartial } from "../../../Graph2D_Types"

export interface Primary_Grid_Generator {
    draw : (xMin : number, xMax : number, yMin : number, yMax:number)=>void,
    primaryGrid : {
        (grid : RecursivePartial<Axis_Property<Primary_Grid>>) : Graph2D,
        (arg : void) : Axis_Property<Primary_Grid>
    }
}