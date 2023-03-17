import { Dataset_Types } from "../Data/Data_Types";
import { Graph2D, Graph2D_State } from "../Graph2D/Graph2D_Types";

export interface Legend {
    id : ()=>string
}

export interface Legend_Options {

}

export interface Legend_State extends Legend_Options {
    id : string
}

export type Legend_Callback = (legend?:Legend, graph?:Graph2D, datasets?:Array<Dataset_Types>)=>void;

export interface Legend_Method_Generator {
    legendState : Legend_State,
    legendHandler : Legend,
    state : Graph2D_State,
    graphHandler : Graph2D
}