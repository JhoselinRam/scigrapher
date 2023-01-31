import { Primary_Grid } from "./Primary/Grid_Primary_Types";

export interface Grid extends Omit<Primary_Grid, "draw">{
    draw : ()=>void
}