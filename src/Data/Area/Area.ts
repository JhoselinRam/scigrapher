import { Graph2D, Graph2D_Save_Callback } from "../../Graph2D/Graph2D_Types";
import DataGeneral from "../Data_General.js";
import { Draw_Data_Callback, Partialize } from "../Data_Types";
import { Area, Area_Data, Area_Options, Area_State } from "./Area_Types";
import AreaData from "./resourses/Area_Data/Area_Data.js";
import DrawArea from "./resourses/Area_Draw/Area_Draw.js";
import AreaProperties from "./resourses/Area_Properties/Area_Properties.js";

const defaultOptions : Area_Options = {
    enable : true,
    color : "#0043e0",
    opacity : 0.3,
    polar : false,
    data : {
        x : [],
        y : []
    },
    base : {
        x : [],
        y : []
    } ,
    id : "auto"
}

export function Area_Dataset(options : Partialize<Area_Options>, graphHandler : Graph2D, dirtify:(sort?:boolean)=>void) : [Area, Draw_Data_Callback, Graph2D_Save_Callback]{

    //State of the area
    const dataState : Area_State = {
        ...defaultOptions, ...options,
        id : (options.id != null && options.id!=="auto")? options.id : crypto.randomUUID(),
        index : 0,
        dirtify,
        useAxis : {x:"primary", y:"primary"},
        datasetType : "area",
        base : {
            x : options.base?.x != null ? options.base.x as Area_Data : defaultOptions.base.x,  
            y : options.base?.y != null ? options.base.y as Area_Data : defaultOptions.base.y,  
        },
        data : {
            x : options.data?.x != null ? options.data.x as Area_Data : defaultOptions.data.x,  
            y : options.data?.y != null ? options.data.y as Area_Data : defaultOptions.data.y,  
        }
    }

    //Main object handler
    const dataHandler : Partial<Area> = {};
    
    //Method generators
    const general = DataGeneral<Area,Area_State>({dataHandler : dataHandler as Area, dataState, graphHandler});
    const draw = DrawArea({dataHandler : dataHandler as Area, dataState, graphHandler});
    const data = AreaData({dataHandler : dataHandler as Area, dataState, graphHandler});
    const properties = AreaProperties({dataHandler : dataHandler as Area, dataState, graphHandler});

    //Main object population
    dataHandler.id = general.id;
    dataHandler.index = general.index;
    dataHandler.datasetType = ()=>dataState.datasetType;
    dataHandler.dataX = data.dataX;
    dataHandler.dataY = data.dataY;
    dataHandler.baseX = data.baseX;
    dataHandler.baseY = data.baseY;
    dataHandler.enable = properties.enable;
    dataHandler.polar = properties.polar;
    dataHandler.color = properties.color;
    dataHandler.opacity = properties.opacity;



    return [dataHandler as Area, draw.draw, properties.save];
}