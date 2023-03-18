import { Area, Area_Callback, Area_Method_Generator } from "../../Area_Types";
import { Area_Properties_Generated, Area_Properties_Methods, Area_Properties_Options } from "./Area_Properties_Types";

function AreaProperties(props : Area_Method_Generator) : Area_Properties_Methods{

//----------- Generated Methods ---------------

    const enable = generatePropertyMethod<boolean>("enable", props);
    const color = generatePropertyMethod<string>("color", props);
    const opacity = generatePropertyMethod<number>("opacity", props);
    const polar = generatePropertyMethod<boolean>("polar", props);

//---------------------------------------------

    return {
        color,
        enable,
        opacity,
        polar
    }

}

export default AreaProperties;








//------------ Method Generator ---------------

function generatePropertyMethod<T>(option : Area_Properties_Options, {dataHandler, dataState, graphHandler}:Area_Method_Generator) : Area_Properties_Generated<T>{

    function method(property : T, callback ?: Area_Callback) : Area;
    function method(arg : void) : T;
    function method(property : T | void, callback ?: Area_Callback) : Area | T | undefined{
        if(typeof property === "undefined" && callback == null)
            return dataState[option] as T;

        if(typeof property !== "undefined"){
            if(property === dataState[option]) return dataHandler;

            (dataState[option] as T) = property;
            if(callback != null) callback(dataHandler, graphHandler);
            dataState.dirtify();

            return dataHandler;
        }
    }


    return method;

}

//---------------------------------------------