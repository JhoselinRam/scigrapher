import { Graph2D, Graph2D_Save_Callback, RecursivePartial } from "../../Graph2D/Graph2D_Types";
import DataGeneral from "../Data_General.js";
import { Draw_Data_Callback, Partialize } from "../Data_Types";
import { Heat_Map, Heat_Map_Options, Heat_Map_State } from "./Heat_Map_Types";
import DataHeat from "./resourses/Data_Heat/Data_Heat.js";
import DrawHeat from "./resourses/Draw_Heat/Draw_Heat.js";
import PropertiesHeat from "./resourses/Properties_Heat/Properties_Heat.js";

const defaultOptions : Heat_Map_Options = {
    enable : true,
    useAxis : {x:"primary", y:"primary"},
    mesh : {x:[[0]] , y:[[0]]},
    data : [[0]],
    color : "viridis",
    smooth : false,
    opacity : 1,
    id : "auto"
}

export function HeatMap(options:Partialize<Heat_Map_Options>, graphHandler : Graph2D, dirtify:(sort?:boolean)=>void) : [Heat_Map, Draw_Data_Callback, Graph2D_Save_Callback]{
    //State of the data set
    const dataState : Heat_Map_State = {
        ...defaultOptions, ...options,
        id : (options.id != null && options.id!=="auto")? options.id : crypto.randomUUID(),
        index : 0,
        datasetType : "heatmap",
        dirtify,
        useAxis : {...defaultOptions.useAxis, ...options.useAxis},
        mesh : {...defaultOptions.mesh, ...options.mesh},
    }

    //Main handler
    const dataHandler : RecursivePartial<Heat_Map> = {};

    //Method generators
    const general = DataGeneral<Heat_Map, Heat_Map_State>({dataHandler : dataHandler as Heat_Map, dataState, graphHandler});
    const draw = DrawHeat({dataHandler : dataHandler as Heat_Map, dataState, graphHandler});
    const data = DataHeat({dataHandler : dataHandler as Heat_Map, dataState, graphHandler});
    const properties = PropertiesHeat({dataHandler : dataHandler as Heat_Map, dataState, graphHandler});

    //Main handler population
    dataHandler.id = general.id;
    dataHandler.index = general.index;
    dataHandler.data = data.data;
    dataHandler.meshX = data.meshX;
    dataHandler.meshY = data.meshY;
    dataHandler.enable = properties.enable;
    dataHandler.useAxis = properties.useAxis;
    dataHandler.smooth = properties.smooth;
    dataHandler.color = properties.color;
    dataHandler.opacity = properties.opacity;
    dataHandler.datasetType = ()=>dataState.datasetType;

//---------------------------------------------
    return [dataHandler as Heat_Map, draw.drawData, properties.save];
}