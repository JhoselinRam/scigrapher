import { Graph2D, RecursivePartial } from "../../Graph2D/Graph2D_Types";
import { linspace, meshgrid } from "../../tools/Helplers/Helplers.js";
import DataGeneral from "../Data_General.js";
import { Draw_Data_Callback, Partialize } from "../Data_Types";
import DrawVector from "./resourses/Draw_Vector/Draw_Vector.js";
import { Vector_Field, Vector_Field_Options, Vector_Field_State } from "./Vector_Field_Types";

const x = linspace(-1.5,1.5,25);
const y = linspace(-1.5,1.5,25);
const [X,Y] = meshgrid(x,y);

const [dataX, dataY] = (function(){
    const dataX : Array<Array<number>> = [];
    const dataY : Array<Array<number>> = [];

    for(let i=0; i<X.length; i++){
        dataX.push([]);
        dataY.push([]);
        for(let j=0; j<X[0].length; j++){
            const w = Math.atan2(Y[i][j], X[i][j]) + Math.PI/2;
            const r = Math.hypot(X[i][j], Y[i][j]);

            dataX[i].push(r*Math.cos(w));
            dataY[i].push(r*Math.sin(w));
        }
    }

    return [dataX, dataY];
})();




const defaultOptions : Vector_Field_Options = {
    useAxis : {x:"primary", y:"primary"},
    mesh : {x:X, y:Y },
    data : { x:dataX, y:dataY },
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

    //Main handler population
    dataHandler.id = general.id;
    dataHandler.index = general.index;

    return [dataHandler as Vector_Field, draw.drawData];
}