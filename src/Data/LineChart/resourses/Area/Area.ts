import { isCallable } from "../../../../tools/Helplers/Helplers.js";
import { Line_Chart, Line_Chart_Method_Generator, Line_Char_Data } from "../../LineChart_Types";
import { Area, Area_Modifier, Area_Property_Generator } from "./Area_Types";

function Area({dataHandler, dataState}:Line_Chart_Method_Generator) : Area {

//--------------- Data X ----------------------

    function areaDataX(data : Line_Char_Data, callback?:(handler?:Line_Chart)=>void) : Line_Chart;
    function areaDataX(arg:void) : Array<number>;
    function areaDataX(data : Line_Char_Data | void, callback?:(handler?:Line_Chart)=>void) : Line_Chart | Array<number> | undefined {
        if(typeof data === "undefined" && callback == null){
            const xData = isCallable(dataState.area.base.x)? dataState.area.base.x(dataHandler) : dataState.area.base.x.slice();
            return xData;
        }

        if(typeof data === "object" || typeof data === "function"){
            dataState.area.base.x = isCallable(data)? data : data.slice();

            if(callback != null) callback(dataHandler);
            dataState.dirtify();
            
            return dataHandler;
        }
    }

//---------------------------------------------
//--------------- Data Y ----------------------

    function areaDataY(data : Line_Char_Data, callback?:(handler?:Line_Chart)=>void) : Line_Chart;
    function areaDataY(arg:void) : Array<number>;
    function areaDataY(data : Line_Char_Data | void, callback?:(handler?:Line_Chart)=>void) : Line_Chart | Array<number> | undefined {
        if(typeof data === "undefined" && callback == null){
            const yData = isCallable(dataState.area.base.y)? dataState.area.base.y(dataHandler) : dataState.area.base.y.slice();
            return yData;
        }

        if(typeof data === "object" || typeof data === "function"){
            dataState.area.base.y = isCallable(data)? data : data.slice();

            if(callback != null) callback(dataHandler);
            dataState.dirtify();
            
            return dataHandler;
        }
    }

//---------------------------------------------
//----------- Generated Methods ---------------

    const areaEnable = generateAreaModifier<boolean>({container : dataState.area.enable, property : "enable"});
    const areaColor = generateAreaModifier<string>({container : dataState.area.color, property : "color"});
    const areaOpacity = generateAreaModifier<number>({container : dataState.area.opacity, property : "opacity"});
    const areaPolar = generateAreaModifier<boolean>({container : dataState.area.polar, property : "polar"});

//---------------------------------------------
//------------- Method Generator --------------

    function generateAreaModifier<T>({container, property} : Area_Property_Generator<T>) : Area_Modifier<T>{

        function areaProperty(value : T, callback?:(handler?:Line_Chart)=>void) : Line_Chart;
        function areaProperty(arg : void) : T;
        function areaProperty(value : T | void, callback?:(handler?:Line_Chart)=>void) : Line_Chart | T | undefined{
            if(typeof value === "undefined" && callback == null)
                return dataState.area[property] as T;

            if(typeof value !== "undefined"){
                if(value === dataState.area[property]) return dataHandler;

                (dataState.area[property] as T) = value;
                if(callback != null) callback(dataHandler);
                dataState.dirtify();
                
                return dataHandler;
            }
        }

        return areaProperty;
    }

//---------------------------------------------


    return {
        areaColor,
        areaDataX,
        areaDataY,
        areaEnable,
        areaOpacity,
        areaPolar
    }
}

export default Area;