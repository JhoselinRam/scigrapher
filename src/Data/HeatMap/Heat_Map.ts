import { Graph2D, RecursivePartial } from "../../Graph2D/Graph2D_Types";
import DataGeneral from "../Data_General.js";
import { Draw_Data_Callback, Partialize } from "../Data_Types";
import { Heat_Map, Heat_Map_Options, Heat_Map_State } from "./Heat_Map_Types";

const defaultOptions : Heat_Map_Options = {
    enable : true,
    useAxis : {x:"primary", y:"primary"},
    mesh : {x:[[0]] , y:[[0]]},
    data : [[0]],
    color : "auto",
    smoot : false
}

export function HeatMap(options:Partialize<Heat_Map_Options>, graphHandler : Graph2D, dirtify:(sort?:boolean)=>void) : [Heat_Map, Draw_Data_Callback]{
    //State of the data set
    const dataState : Heat_Map_State = {
        id : crypto.randomUUID(),
        index : 0,
        dirtify,
        ...defaultOptions, ...options,
        useAxis : {...defaultOptions.useAxis, ...options.useAxis},
        mesh : {...defaultOptions.mesh, ...options.mesh},
    }

    //Main handler
    const dataHandler : RecursivePartial<Heat_Map> = {};

    //Method generators
    const general = DataGeneral<Heat_Map, Heat_Map_State>({dataHandler : dataHandler as Heat_Map, dataState, graphHandler});

    //Main handler population
    dataHandler.id = general.id;
    dataHandler.index = general.index;



//---------------------------------------------
    return [dataHandler as Heat_Map, (arg)=>{}];
}