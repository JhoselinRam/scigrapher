import { isCallable } from "../../../../tools/Helplers/Helplers.js";
import { Line_Chart, Line_Chart_Callback, Line_Chart_Method_Generator, Property_Generator, Property_Modifier } from "../../LineChart_Types";
import { Line, Line_Properties } from "./Line_Types";

function Line({dataHandler, dataState, graphHandler} : Line_Chart_Method_Generator) : Line {

//------------ Generated Methods --------------

    const lineColor = generateLineModifier<string>("color");
    const lineOpacity = generateLineModifier<number>("opacity");
    const lineWidth = generateLineModifier<number>("width");
    const lineStyle = generateLineModifier<string>("style");

//---------------------------------------------
//----------------- Enable --------------------

    function lineEnable(enable : boolean, callback?:Line_Chart_Callback) : Line_Chart;
    function lineEnable(arg : void) : boolean;
    function lineEnable(enable : boolean | void, callback?:Line_Chart_Callback) : Line_Chart | boolean | undefined{
        if(typeof enable === "undefined" && callback == null)
            return dataState.line.enable;
    
        if(typeof enable === "boolean"){
            if(enable === dataState.line.enable) return dataHandler;

            dataState.line.enable = enable;
            if(callback != null) callback(dataHandler, graphHandler);
            dataState.dirtify();

            return dataHandler;
        }
    }


//---------------------------------------------
//--------------- Generator -------------------

    function generateLineModifier<T>(property:Line_Properties) : Property_Modifier<T>{
                
        function lineProperty(value : Property_Generator<T>, callback?:Line_Chart_Callback) : Line_Chart;
        function lineProperty(arg : void) : T | Array<T>;
        function lineProperty(value : Property_Generator<T> | void, callback?:Line_Chart_Callback) : Line_Chart | T | Array<T> | undefined{
            if(typeof value === "undefined" && callback == null){
                const candidate = dataState.line[property] as Property_Generator<T>
                if(isCallable(candidate)){
                    const xPositions = dataHandler.dataX();
                    const y = dataHandler.dataY();
                    const generator = candidate;

                    return xPositions.map((x,i)=>generator(x, y[i], i, xPositions, y, dataHandler, graphHandler));
                }else if(typeof candidate !== "object"){
                    return candidate;
                }else{
                    return (candidate as Array<T>).slice();
                }
            }
            if(typeof value !== "undefined"){
                (dataState.line[property] as Property_Generator<T>) = typeof value === "object"? (value as Array<T>).slice() : value;

                if(callback != null) callback(dataHandler, graphHandler);
                dataState.dirtify();
                return dataHandler;
            }
        }

        return lineProperty;
    }

//---------------------------------------------
    
    
    return {
        lineColor,
        lineEnable,
        lineOpacity,
        lineStyle,
        lineWidth
    }
}

export default Line;