import { Graph2D, RecursivePartial } from "../../Graph2D/Graph2D_Types";
import DataGeneral from "../Data_General.js";
import { Draw_Data_Callback, Partialize } from "../Data_Types";
import DrawVector from "./resourses/Draw_Vector/Draw_Vector.js";
import { Vector_Field, Vector_Field_Options, Vector_Field_State } from "./Vector_Field_Types";

const defaultOptions : Vector_Field_Options = {
    useAxis : {x:"primary", y:"primary"},
    mesh : {x:[[-1, -0.5, 0, 0.5, 1],
               [-1, -0.5, 0, 0.5, 1],
               [-1, -0.5, 0, 0.5, 1],
               [-1, -0.5, 0, 0.5, 1],
               [-1, -0.5, 0, 0.5, 1]], 
            
            y:[[1, 1, 1, 1, 1],
               [0.5, 0.5, 0.5, 0.5, 0.5],
               [0, 0, 0, 0, 0],
               [-0.5, -0.5, -0.5, -0.5, -0.5],
               [-1, -1, -1, -1, -1]]
        },
    data : {x:[[1,1,1,1,1],
               [1,1,1,1,1],
               [1,1,1,1,1],
               [1,1,1,1,1],
               [1,1,1,1,1],], 
            
           y:[[1,1,1,1,1],
              [1,1,1,1,1],
              [1,1,1,1,1],
              [1,1,1,1,1],
              [1,1,1,1,1],]},
    color : "#000000",
    opacity : 1,
    width : 1,
    style  : "solid",
    normalized : true,
    maxLenght : 20,
    enable : true
}

export function VectorField(options : Partialize<Vector_Field_Options>, graphHandler : Graph2D, dirtify:(sort?:boolean)=>void) : [Vector_Field, Draw_Data_Callback] {
    //State of the data set
    const dataState : Vector_Field_State = {
        id : crypto.randomUUID(),
        dirtify,
        index : 0,
        ...defaultOptions, ...options,
        useAxis : {...defaultOptions.useAxis, ...options.useAxis},
        mesh : {...defaultOptions.mesh, ...options.mesh},
        data : {...defaultOptions.data, ...options.data}
    };
     //Main handler
    const dataHandler : RecursivePartial<Vector_Field> = {};

    //Method generators
    const general = DataGeneral<Vector_Field, Vector_Field_State>({dataHandler : dataHandler as Vector_Field, dataState, graphHandler});
    const draw = DrawVector({dataHandler : dataHandler as Vector_Field, dataState, graphHandler});

    //Main handler population
    dataHandler.id = general.id;
    dataHandler.index = general.index;

    return [dataHandler as Vector_Field, draw.drawData];
}