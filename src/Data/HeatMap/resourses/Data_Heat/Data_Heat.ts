import { Axis_Property, Graph2D } from "../../../../Graph2D/Graph2D_Types";
import { isCallable } from "../../../../tools/Helplers/Helplers.js";
import { Field_Data, Field_Position, Field_Property } from "../../../Data_Types";
import { Heat_Map, Heat_Map_Callback, Heat_Map_Method_Generator, Heat_Map_State } from "../../Heat_Map_Types";
import { Data_Heat, Heat_Position_Generator } from "./Data_Heat_Types";

function DataHeat({dataHandler, dataState, graphHandler}:Heat_Map_Method_Generator) : Data_Heat{

//----------- Generated Methods ---------------

const meshX = generatePositionMethod(dataState.mesh, "x", dataHandler, graphHandler, dataState);
const meshY = generatePositionMethod(dataState.mesh, "y", dataHandler, graphHandler, dataState);

//---------------------------------------------
//---------------------------------------------

function data(data:Field_Data<Heat_Map>, callback?:Heat_Map_Callback) : Heat_Map;
    function data(arg:void) : Field_Property<number>;
    function data(data:Field_Data<Heat_Map> | void, callback?:Heat_Map_Callback) : Heat_Map | Field_Property<number> | undefined{
        if(typeof data === "undefined" && callback == null){
            const mesX = dataHandler.meshX();
            const meshY = dataHandler.meshY();
            let property : Field_Property<number> = [];

            if(isCallable(dataState.data))
                for(let i=0; i<mesX.length; i++){
                    property.push([]);
                    for(let j=0; j<mesX[i].length; j++){
                        property[i].push(dataState.data(mesX[i][j], meshY[i][j], i, j, mesX, meshY, dataHandler, graphHandler));
                    }
                }
            else
                property = dataState.data.map(row=>row.slice());

            return property;
        }

        if(typeof data === "function" || typeof data === "object"){
            dataState.data = isCallable(data)? data : data.map(row=>row.slice());
            if(callback != null) callback(dataHandler, graphHandler);
            dataState.dirtify();

            return dataHandler;
        }
    }

//---------------------------------------------

    return {
        data,
        meshX, 
        meshY
    }
}

export default DataHeat;






//-------- Generate Position Method -----------
function generatePositionMethod(container:Axis_Property<Field_Position<Heat_Map>>, axis:"x"|"y", dataHandler:Heat_Map, graphHandler:Graph2D, dataState:Heat_Map_State) : Heat_Position_Generator{

    //---------------------------------------------

    function fieldData(data:Field_Position<Heat_Map>, callback?:Heat_Map_Callback) : Heat_Map;
    function fieldData(arg:void) : Field_Property<number>;
    function fieldData(data:Field_Position<Heat_Map> | void, callback?:Heat_Map_Callback) : Heat_Map | Field_Property<number> | undefined{
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