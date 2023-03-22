import { Graph2D_Save_Asset } from "../../../../Graph2D/Graph2D_Types.js";
import { isCallable } from "../../../../tools/Helplers/Helplers.js";
import { Field_Property } from "../../../Data_Types";
import { Vector_Field, Vector_Field_Callback, Vector_Field_Method_Generator, Vector_Field_Options, Vector_Property_Generator } from "../../Vector_Field_Types";
import { Dynamic_Properties, Dynamic_Property_Method, Generator_Props, Properties_Vector, Static_Properties, Static_Property_Method } from "./Properties_Vector_Types";

function PropertiesVector({dataHandler, dataState, graphHandler} : Vector_Field_Method_Generator) : Properties_Vector{

//----------- Generated Methods ---------------
    const props = {dataState, dataHandler, graphHandler}
    
    const color = generateDynamicPropertyMethod<string>({property:"color", ...props});
    const opacity = generateDynamicPropertyMethod<number>({property:"opacity", ...props});
    const style = generateDynamicPropertyMethod<string>({property:"style", ...props});
    const width = generateDynamicPropertyMethod<number>({property:"width", ...props});

    const normalize = generateStaticPropertyMethod<boolean>({property:"normalize", ...props});
    const maxLength = generateStaticPropertyMethod<number>({property:"maxLength", ...props});
    const enable = generateStaticPropertyMethod<boolean>({property:"enable", ...props});

//---------------------------------------------
//-------------- Save -------------------------

    function save() : Graph2D_Save_Asset{
        const options: Vector_Field_Options = {
            id : dataState.id,
            enable : dataState.enable,
            maxLength : dataState.maxLength,
            normalize : dataState.normalize,
            useAxis : {...dataState.useAxis},
            data : {
                x : dataHandler.dataX(),
                y : dataHandler.dataY(),
            },
            mesh : {
                x : dataHandler.meshX(),
                y : dataHandler.meshY(),
            },
            color : dataHandler.color(),
            opacity : dataHandler.opacity(),
            width : dataHandler.width(),
            style : dataHandler.style(),
        }

        return {
            options,
            assetType : "vectorfield"
        }
    }

//---------------------------------------------

    return {
        color,
        enable,
        maxLength,
        normalize,
        opacity,
        style,
        width,
        save
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
