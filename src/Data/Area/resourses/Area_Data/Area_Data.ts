import { Axis_Property } from "../../../../Graph2D/Graph2D_Types.js";
import { isCallable } from "../../../../tools/Helplers/Helplers.js";
import { Area, Area_Callback, Area_Data, Area_Method_Generator } from "../../Area_Types";
import { Area_Data_Generated, Area_Data_Methods } from "./Area_Data_Types";

function AreaData(props : Area_Method_Generator) : Area_Data_Methods{

//----------- Generated Methods ---------------

    const dataX = dataMethodGenerator("data", "x", props);
    const dataY = dataMethodGenerator("data", "y", props);
    const baseX = dataMethodGenerator("base", "x", props);
    const baseY = dataMethodGenerator("base", "y", props);

//---------------------------------------------
//---------------- Axis Used ------------------

function axisUsed(axis:Partial<Axis_Property<"primary" | "secondary">>, callback?:Area_Callback) : Area;
function axisUsed(arg:void) : Axis_Property<"primary" | "secondary">;
function axisUsed(axis:Partial<Axis_Property<"primary" | "secondary">> | void, callback?:Area_Callback) : Area | Axis_Property<"primary" | "secondary"> | undefined{
    if(typeof axis === "undefined" && callback == null)
        return {...props.dataState.useAxis};
    
    if(typeof axis === "object"){
        if(axis.x == null && axis.y == null) return props.dataHandler;
        if(axis.x === props.dataState.useAxis.x && axis.y === props.dataState.useAxis.y) return props.dataHandler;

        if(axis.x != null) props.dataState.useAxis.x = axis.x;
        if(axis.y != null) props.dataState.useAxis.y = axis.y;

        if(callback != null) callback(props.dataHandler, props.graphHandler);
        props.dataState.dirtify();
        return props.dataHandler;
    }
}

//---------------------------------------------

    return {
        baseX, 
        baseY,
        dataX,
        dataY,
        axisUsed
    }

}

export default AreaData;






//------------ Method Generator ---------------

function dataMethodGenerator(property:"data"|"base", axis:"x"|"y", {dataHandler, dataState,graphHandler}:Area_Method_Generator) : Area_Data_Generated{

    function dataMethod(data:Area_Data, callback?:Area_Callback) : Area;
    function dataMethod(arg : void) : Array<number>;
    function dataMethod(data:Area_Data | void, callback?:Area_Callback) : Area | Array<number> | undefined{
        if(typeof data === "undefined" && callback == null){
            const candidate = dataState[property][axis];
            
            if(isCallable(candidate)){
                const areaData = candidate(dataHandler, graphHandler);
                return areaData;
            }
            if(typeof candidate === "object")
                return candidate.slice();
        }

        if(typeof data !== "undefined"){
            dataState[property][axis] = isCallable(data)? data : data.slice();

            if(callback != null) callback(dataHandler, graphHandler);
            dataState.dirtify();
            
            return dataHandler;
        }
    }


    return dataMethod;
}

//---------------------------------------------


