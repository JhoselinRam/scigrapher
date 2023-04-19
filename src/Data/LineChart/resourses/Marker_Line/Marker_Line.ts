import { isCallable } from "../../../../tools/Helplers/Helplers.js";
import { Line_Chart, Line_Chart_Callback, Line_Chart_Method_Generator, Marker_Type, Property_Generator, Property_Modifier } from "../../LineChart_Types";
import { Marker_Line, Marker_Properties } from "./Marker_Line_Types";

function MarkerLine({dataHandler, dataState, graphHandler} : Line_Chart_Method_Generator) : Marker_Line{

//------------ Generated Methods --------------

const markerSize = generateMarkerModifier<number>("size");
const markerColor = generateMarkerModifier<string>("color");
const markerOpacity = generateMarkerModifier<number>("opacity");
const markerWidth = generateMarkerModifier<number>("width");
const markerStyle = generateMarkerModifier<string>("style");
const markerType = generateMarkerModifier<Marker_Type>("type");
const markerFilled = generateMarkerModifier<boolean>("filled");

//---------------------------------------------
//---------------- Enable ---------------------

    function markerEnable(enable : boolean, callback?:Line_Chart_Callback) : Line_Chart;
    function markerEnable(arg : void) : boolean;
    function markerEnable(enable : boolean | void, callback?:Line_Chart_Callback) : Line_Chart | boolean | undefined{
        if(typeof enable === "undefined" && callback == null)
            return dataState.marker.enable;
        
        if(typeof enable === "boolean"){
            if(dataState.marker.enable === enable) return dataHandler;

            dataState.marker.enable = enable;
            if(callback != null) callback(dataHandler, graphHandler);
            dataState.dirtify();

            return dataHandler;
        }
    }

//---------------------------------------------
//--------------- Generator -------------------

    function generateMarkerModifier<T>(property:Marker_Properties) : Property_Modifier<T>{
        
        function markerProperty(value : Property_Generator<T>, callback?:Line_Chart_Callback) : Line_Chart;
        function markerProperty(arg : void) : T | Array<T>;
        function markerProperty(value : Property_Generator<T> | void, callback?:Line_Chart_Callback) : Line_Chart | T | Array<T> | undefined{
            if(typeof value === "undefined" && callback == null){
                const candidate = dataState.marker[property] as Property_Generator<T>;
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
                (dataState.marker[property] as Property_Generator<T>) = typeof value === "object"? (value as Array<T>).slice() : value;

                if(callback != null) callback(dataHandler, graphHandler);
                dataState.dirtify();
                return dataHandler;
            }
        }

        return markerProperty;
    }

//---------------------------------------------




    return{
        markerSize,
        markerColor,
        markerFilled,
        markerOpacity,
        markerStyle,
        markerType,
        markerWidth,
        markerEnable
    }
}

export default MarkerLine;