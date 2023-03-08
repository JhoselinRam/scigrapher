import { Graph2D, RecursivePartial } from "../../Graph2D/Graph2D_Types";
import { linspace, meshgrid } from "../../tools/Helplers/Helplers.js";
import DataGeneral from "../Data_General.js";
import { Draw_Data_Callback, Field_Property, Partialize } from "../Data_Types";
import { Heat_Map, Heat_Map_Options, Heat_Map_State } from "./Heat_Map_Types";
import DrawHeat from "./resourses/Draw_Heat/Draw_Heat.js";



//------------ Counterfit Data ----------------
//---------------------------------------------

const x = linspace(-2, 2, 40);
const y = linspace(-1.5, 1.5, 40);
const [X,Y] = meshgrid(x,y);

function counterData(){
    const a = 1;
    const w = 4*Math.PI;
    const data : Field_Property<number> = [];

    for(let i=0; i<X.length; i++){
        data.push([]);
        for(let j=0; j<X[i].length; j++){
            const r = Math.hypot(X[i][j], Y[i][j]);
            data[i].push(a*Math.cos(w*r));
        }
    }
    return data;
}

//---------------------------------------------
//---------------------------------------------









const defaultOptions : Heat_Map_Options = {
    enable : true,
    useAxis : {x:"primary", y:"primary"},
    mesh : {x:X , y:Y},
    data : counterData(),
    color : "viridis",
    smooth : true,
    opacity : 1
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
    const draw = DrawHeat({dataHandler : dataHandler as Heat_Map, dataState, graphHandler});

    //Main handler population
    dataHandler.id = general.id;
    dataHandler.index = general.index;



//---------------------------------------------
    return [dataHandler as Heat_Map, draw.drawData];
}