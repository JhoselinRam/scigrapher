import { Mapping } from "../../../tools/Mapping/Mapping_Types";
import { Axis_Property } from "../../Graph2D_Types";

export interface Scale{
    compute : ()=>void,
    primary  : Axis_Property<Mapping>
    secondary  : Axis_Property<Mapping>
    reference  : Axis_Property<Mapping>
}

export interface MinMaxCoords{
    xMin : number,
    xMax : number,
    yMin : number,
    yMax : number,
}