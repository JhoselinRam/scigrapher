import { Mapping } from "../../../tools/Mapping/Mapping_Types";
import { Axis_Modifier } from "../../Graph2D_Types";

export interface Scale{
    compute : ()=>void,
    primary  : Axis_Modifier<Mapping>
    secondary  : Axis_Modifier<Mapping>
    reference  : Axis_Modifier<Mapping>
}

export interface MinMaxCoords{
    xMin : number,
    xMax : number,
    yMin : number,
    yMax : number,
}