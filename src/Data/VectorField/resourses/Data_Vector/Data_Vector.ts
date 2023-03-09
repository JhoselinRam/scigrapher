import { Axis_Property, Graph2D } from "../../../../Graph2D/Graph2D_Types";
import { isCallable } from "../../../../tools/Helplers/Helplers.js";
import { Field_Data, Field_Position, Field_Property } from "../../../Data_Types";
import { Vector_Field, Vector_Field_Callback, Vector_Field_Method_Generator, Vector_Field_State } from "../../Vector_Field_Types";
import { Data_Method_Generator, Data_Vector, Position_Method_Generator } from "./Data_Vector_Types";

function DataVector({dataHandler, dataState, graphHandler}:Vector_Field_Method_Generator) : Data_Vector {

//------------ Generated Methods --------------

const dataX = generateDataMethod(dataState.data, "x", dataHandler, graphHandler, dataState);
const dataY = generateDataMethod(dataState.data, "y", dataHandler, graphHandler, dataState);
const meshX = generatePositionMethod(dataState.mesh, "x", dataHandler, graphHandler, dataState);
const meshY = generatePositionMethod(dataState.mesh, "y", dataHandler, graphHandler, dataState);

//---------------------------------------------
//---------------- Axis Used ------------------

function axisUsed(axis:Partial<Axis_Property<"primary" | "secondary">>, callback?:Vector_Field_Callback) : Vector_Field;
function axisUsed(arg:void) : Axis_Property<"primary" | "secondary">;
function axisUsed(axis:Partial<Axis_Property<"primary" | "secondary">> | void, callback?:Vector_Field_Callback) : Vector_Field | Axis_Property<"primary" | "secondary"> | undefined{
    if(typeof axis === "undefined" && callback == null)
        return {...dataState.useAxis};
    
    if(typeof axis === "object"){
        if(axis.x == null && axis.y == null) return dataHandler;
        if(axis.x === dataState.useAxis.x && axis.y === dataState.useAxis.y) return dataHandler;

        if(axis.x != null) dataState.useAxis.x = axis.x;
        if(axis.y != null) dataState.useAxis.y = axis.y;

        if(callback != null) callback(dataHandler, graphHandler);
        dataState.dirtify();
        return dataHandler;
    }
}

//---------------------------------------------

    return {
        dataX,
        dataY,
        meshX,
        meshY,
        axisUsed
    }
}

export default DataVector





//-------- Generate Position Method -----------
function generatePositionMethod(container:Axis_Property<Field_Position<Vector_Field>>, axis:"x"|"y", dataHandler:Vector_Field, graphHandler:Graph2D, dataState:Vector_Field_State) : Position_Method_Generator{

    //---------------------------------------------

    function fieldData(data:Field_Position<Vector_Field>, callback?:Vector_Field_Callback) : Vector_Field;
    function fieldData(arg:void) : Field_Property<number>;
    function fieldData(data:Field_Position<Vector_Field> | void, callback?:Vector_Field_Callback) : Vector_Field | Field_Property<number> | undefined{
        if(typeof data === "undefined" && callback == null){
            const candidate = container[axis];
            let property : Field_Property<number> = [];

            if(isCallable(candidate))
                property = candidate(dataHandler, graphHandler);
            else
                property = candidate.map(row=>row.slice());

            return property;
        }

        if(typeof data === "function" || typeof data === "object"){
            container[axis] = isCallable(data)? data : data.map(row=>row.slice());
            if(callback != null) callback(dataHandler, graphHandler);
            dataState.dirtify();

            return dataHandler;
        }
    }

    //---------------------------------------------

    return fieldData;

}
//---------------------------------------------
//----------- Generate Data Method ------------
function generateDataMethod(container:Axis_Property<Field_Data<Vector_Field>>, axis:"x"|"y", dataHandler:Vector_Field, graphHandler:Graph2D, dataState:Vector_Field_State) : Data_Method_Generator{

    //---------------------------------------------

    function fieldData(data:Field_Data<Vector_Field>, callback?:Vector_Field_Callback) : Vector_Field;
    function fieldData(arg:void) : Field_Property<number>;
    function fieldData(data:Field_Data<Vector_Field> | void, callback?:Vector_Field_Callback) : Vector_Field | Field_Property<number> | undefined{
        if(typeof data === "undefined" && callback == null){
            const candidate = container[axis];
            const mesX = dataHandler.meshX();
            const meshY = dataHandler.meshY();
            let property : Field_Property<number> = [];

            if(isCallable(candidate))
                for(let i=0; i<mesX.length; i++){
                    property.push([]);
                    for(let j=0; j<mesX[i].length; j++){
                        property[i].push(candidate(mesX[i][j], meshY[i][j], i, j, mesX, meshY, dataHandler, graphHandler));
                    }
                }
            else
                property = candidate.map(row=>row.slice());

            return property;
        }

        if(typeof data === "function" || typeof data === "object"){
            container[axis] = isCallable(data)? data : data.map(row=>row.slice());
            if(callback != null) callback(dataHandler, graphHandler);
            dataState.dirtify();

            return dataHandler;
        }
    }

    //---------------------------------------------

    return fieldData;

}
//---------------------------------------------