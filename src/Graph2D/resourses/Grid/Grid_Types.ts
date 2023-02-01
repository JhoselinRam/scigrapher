import { Method_Generator } from "../../Graph2D_Types";
import { Primary_Grid } from "./Primary/Grid_Primary_Types";
import { Secondary_Grid } from "./Secondary/Grid_Secondary_Types";

export interface Grid extends 
Omit<Primary_Grid, "draw">,
Omit<Secondary_Grid, "draw">{
    draw : ()=>void
}

export interface Grid_Method_Generator extends Method_Generator {
    getLineDash : (style:string)=>Array<number>,
    getMinMaxCoords : (axis:"x"|"y")=>[number,number]
}