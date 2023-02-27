import { isCallable } from "../../../../tools/Helplers/Helplers.js";
import { Line_Chart, Line_Chart_Method_Generator, Property_Generator, Property_Modifier } from "../../LineChart_Types";
import { Marker_Line, Marker_Properties } from "./Marker_Line_Types";

function MarkerLine({dataHandler, dataState} : Line_Chart_Method_Generator) : Marker_Line{

//------------ Generated Methods --------------

const markerSize = generateMarkerModifier<number>(dataState.marker.size, "size");
const markerColor = generateMarkerModifier<string>(dataState.marker.color, "color");
const markerOpacity = generateMarkerModifier<number>(dataState.marker.opacity, "opacity");
const markerWidth = generateMarkerModifier<number>(dataState.marker.width, "width");
const markerStyle = generateMarkerModifier<string>(dataState.marker.style, "style");
const markerType = generateMarkerModifier<string>(dataState.marker.type, "type");
const markerFilled = generateMarkerModifier<boolean>(dataState.marker.filled, "filled");

//---------------------------------------------
//---------------- Enable ---------------------

    function markerEnable(enable : boolean, callback?:(handler?:Line_Chart)=>void) : Line_Chart;
    function markerEnable(arg : void) : boolean;
    function markerEnable(enable : boolean | void, callback?:(handler?:Line_Chart)=>void) : Line_Chart | boolean | undefined{
        if(typeof enable === "undefined" && callback == null)
            return dataState.marker.enable;
        
        if(typeof enable === "boolean"){
            if(dataState.marker.enable === enable) return dataHandler;

            dataState.marker.enable = enable;
            if(callback != null) callback(dataHandler);
            dataState.dirtify();

            return dataHandler;
        }
    }

//---------------------------------------------
//--------------- Generator -------------------

    function generateMarkerModifier<T>(container:Property_Generator<T>, property:Marker_Properties) : Property_Modifier<T>{
        
        function markerProperty(value : Property_Generator<T>, callback?:(handler?:Line_Chart)=>void) : Line_Chart;
        function markerProperty(arg : void) : T | Array<T>;
        function markerProperty(value : Property_Generator<T> | void, callback?:(handler?:Line_Chart)=>void) : Line_Chart | T | Array<T> | undefined{
            if(typeof value === "undefined" && callback == null){
                if(isCallable(container)){
                    const xPositions = dataHandler.dataX();
                    const y = dataHandler.dataY();
                    const generator = container;

                    return xPositions.map((x,i)=>generator(x,y[i],i,dataHandler));
                }else if(typeof container !== "object"){
                    return container;
                }else{
                    return (container as Array<T>).slice();
                }
            }
            if(typeof value !== "undefined"){
                (dataState.marker[property] as Property_Generator<T>) = typeof value === "object"? (value as Array<T>).slice() : value;

                if(callback != null) callback(dataHandler);
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