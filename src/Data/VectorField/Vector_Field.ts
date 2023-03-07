import { Graph2D, RecursivePartial } from "../../Graph2D/Graph2D_Types";
import DataGeneral from "../Data_General.js";
import { Draw_Data_Callback, Partialize } from "../Data_Types";
import DataVector from "./resourses/Data_Vector/Data_Vector.js";
import DrawVector from "./resourses/Draw_Vector/Draw_Vector.js";
import PropertiesVector from "./resourses/Properties_Vector/Properties_Vector.js";
import { Vector_Field, Vector_Field_Options, Vector_Field_State } from "./Vector_Field_Types";

const defaultOptions : Vector_Field_Options = {
    useAxis : {x:"primary", y:"primary"},
    mesh : {x:[[0]], y:[[0]] },
    data : { x:[[0]], y:[[0]] },
    color : "#303030",
    opacity : 1,
    width : 1,
    style  : "solid",
    normalized :true,
    maxLenght :20,
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
    const data = DataVector({dataHandler : dataHandler as Vector_Field, dataState, graphHandler});
    const properties = PropertiesVector({dataHandler : dataHandler as Vector_Field, dataState, graphHandler});

    //Main handler population
    dataHandler.id = general.id;
    dataHandler.index = general.index;
    dataHandler.dataX = data.dataX;
    dataHandler.dataY = data.dataY;
    dataHandler.meshX = data.meshX;
    dataHandler.meshY = data.meshY;
    dataHandler.axisUsed = data.axisUsed;
    dataHandler.vectorColor = properties.vectorColor;
    dataHandler.vectorEnable = properties.vectorEnable;
    dataHandler.vectorMaxLength = properties.vectorMaxLength;
    dataHandler.vectorNormalized = properties.vectorNormalized;
    dataHandler.vectorOpacity = properties.vectorOpacity;
    dataHandler.vectorStyle = properties.vectorStyle;
    dataHandler.vectorWidth = properties.vectorWidth;



//---------------------------------------------
    return [dataHandler as Vector_Field, draw.drawData];
}