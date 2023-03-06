import { isCallable } from "../../../../tools/Helplers/Helplers.js";
import { Field_Property } from "../../../Data_Types";
import { Vector_Field, Vector_Field_Callback, Vector_Field_Method_Generator, Vector_Property_Generator } from "../../Vector_Field_Types";
import { Dynamic_Properties, Dynamic_Property_Method, Generator_Props, Properties_Vector, Static_Properties, Static_Property_Method } from "./Properties_Vector_Types";

function PropertiesVector({dataHandler, dataState, graphHandler} : Vector_Field_Method_Generator) : Properties_Vector{

//----------- Generated Methods ---------------
    const props = {dataState, dataHandler, graphHandler}
    const vectorColor = generateDynamicPropertyMethod<string>({property:"color", ...props});
    const vectorOpacity = generateDynamicPropertyMethod<number>({property:"opacity", ...props});
    const vectorStyle = generateDynamicPropertyMethod<string>({property:"style", ...props});
    const vectorWidth = generateDynamicPropertyMethod<number>({property:"width", ...props});

    const vectorNormalized = generateStaticPropertyMethod<boolean>({property:"normalized", ...props});
    const vectorMaxLength = generateStaticPropertyMethod<number>({property:"maxLenght", ...props});
    const vectorEnable = generateStaticPropertyMethod<boolean>({property:"enable", ...props});

//---------------------------------------------

    return {
        vectorColor,
        vectorEnable,
        vectorMaxLength,
        vectorNormalized,
        vectorOpacity,
        vectorStyle,
        vectorWidth
    }
}

export default PropertiesVector;






//------------ Static Generator ---------------

function generateStaticPropertyMethod<T>({dataHandler, dataState, graphHandler, property}:Generator_Props<Static_Properties>) : Static_Property_Method<T>{
    function staticMethod(value:T, callback?:Vector_Field_Callback) : Vector_Field;
    function staticMethod(arg:void) : T;
    function staticMethod(value:T | void, callback?:Vector_Field_Callback) : Vector_Field | T | undefined{
        if(typeof value === "undefined" && callback==null)
            return dataState[property] as T;

        if(typeof value !== "undefined"){
            if(value === dataState[property]) return dataHandler;

            (dataState[property] as T) = value;
            if(callback != null) callback(dataHandler, graphHandler);
            dataState.dirtify();

            return dataHandler;
        }
    }

    //---------------------------------------------
    return staticMethod;
}

//---------------------------------------------
//------------ Dynamic Generator --------------

function generateDynamicPropertyMethod<T>({dataHandler, dataState, graphHandler, property}:Generator_Props<Dynamic_Properties>) : Dynamic_Property_Method<T>{
    function dynamicMethod(value:Vector_Property_Generator<T>, callback?:Vector_Field_Callback) : Vector_Field;
    function dynamicMethod(arg:void) : T | Field_Property<T>;
    function dynamicMethod(value:Vector_Property_Generator<T> | void, callback?:Vector_Field_Callback) : Vector_Field | T | Field_Property<T> | undefined{
        if(typeof value === "undefined" && callback == null){
            const candidate = dataState[property] as Vector_Property_Generator<T>;
            
            if(isCallable(candidate)){
                const x = dataHandler.dataX();
                const y = dataHandler.dataY();
                const meshX = dataHandler.meshX();
                const meshY = dataHandler.meshY();
                const values : Field_Property<T> = [];
                
                for(let i=0; i<meshX.length; i++){
                    values.push([]);
                    for(let j=0; j<meshX[i].length; j++){
                        values[i].push(candidate(x[i][j], y[i][j], meshX[i][j], meshY[i][j], i, j, x, y, meshX, meshY, dataHandler, graphHandler));
                    }
                }

                return values;
            }else if(typeof candidate !== "object"){
                return candidate;
            }else{
                return (candidate as Field_Property<T>).map(row=>row.slice());
            }
        } 

        if(typeof value !== "undefined"){
            (dataState[property] as Vector_Property_Generator<T>) = isCallable(value)? value : (typeof value !== "object"? value : (value as Field_Property<T>).map(row=>row.slice()));

            if(callback != null) callback(dataHandler,graphHandler);
            dataState.dirtify();

            return dataHandler;
        }
    }

    //---------------------------------------------
    return dynamicMethod;
}

//---------------------------------------------
