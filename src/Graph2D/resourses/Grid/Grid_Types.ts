import { Axis_Property, Graph2D, Method_Generator, RecursivePartial } from "../../Graph2D_Types";
import { Primary_Grid_Generator } from "./Primary/Grid_Primary_Types";
import { Secondary_Grid_Generator } from "./Secondary/Grid_Secondary_Types";

export interface Grid extends 
Omit<Primary_Grid_Generator, "draw">,
Omit<Secondary_Grid_Generator, "draw">{
    draw : ()=>void,
    gridColor : {
        (color:Grid_Modifier<string>, callback?:(handler?:Graph2D)=>void): Graph2D,
        (arg:void):Grid_Property<string>
    },
    gridOpacity : {
        (opacity:Grid_Modifier<number>, callback?:(handler?:Graph2D)=>void): Graph2D,
        (arg:void):Grid_Property<number>
    },
    gridStyle : {
        (style:Grid_Modifier<string>, callback?:(handler?:Graph2D)=>void): Graph2D,
        (arg:void):Grid_Property<string>
    },
    gridWidth : {
        (width:Grid_Modifier<number>, callback?:(handler?:Graph2D)=>void): Graph2D,
        (arg:void):Grid_Property<number>
    },
    polarGrid : {
        (density:number, callback?:(handler?:Graph2D)=>void) : Graph2D,
        (arg:void) : number
    }
}

export interface Grid_Method_Generator extends Method_Generator {
    getLineDash : (style:string)=>Array<number>,
    getMinMaxCoords : ()=>[number,number, number, number]
}

export interface Grid_Property<T> extends Axis_Property<{
    primary : T,
    secondary : T
}>{}

export interface Grid_Modifier<T> extends RecursivePartial<Grid_Property<T>>{
    grid ?: T,
    primary ?: T,
    secondary ?: T
}
