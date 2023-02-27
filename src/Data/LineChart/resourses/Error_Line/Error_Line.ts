import { Axis_Property } from "../../../../Graph2D/Graph2D_Types.js";
import { isCallable } from "../../../../tools/Helplers/Helplers.js";
import { Line_Chart, Line_Chart_Method_Generator, Property_Generator, Property_Modifier } from "../../LineChart_Types";
import { Error_Line, Error_Properties } from "./Error_Line_Types";

function ErrorLine({dataHandler, dataState} : Line_Chart_Method_Generator) : Error_Line {

//------------ Generated Methods --------------

    const errorbarType = generateErrorModifier<string>(dataState.errorBar.type, "type", "x");
    const errorbarColorX = generateErrorModifier<string>(dataState.errorBar.x.color, "color", "x");
    const errorbarOpacityX = generateErrorModifier<number>(dataState.errorBar.x.opacity, "opacity", "x");
    const errorbarWidthX = generateErrorModifier<number>(dataState.errorBar.x.width, "width", "x");
    const errorbarStyleX = generateErrorModifier<string>(dataState.errorBar.x.style, "style", "x");
    const errorbarDataX = generateErrorModifier<number>(dataState.errorBar.x.data, "data", "x");
    const errorbarColorY = generateErrorModifier<string>(dataState.errorBar.y.color, "color", "y");
    const errorbarOpacityY = generateErrorModifier<number>(dataState.errorBar.y.opacity, "opacity", "y");
    const errorbarWidthY = generateErrorModifier<number>(dataState.errorBar.y.width, "width", "y");
    const errorbarStyleY = generateErrorModifier<string>(dataState.errorBar.y.style, "style", "y");
    const errorbarDataY = generateErrorModifier<number>(dataState.errorBar.y.data, "data", "y");

//---------------------------------------------
//---------------- Enable ---------------------

    function errorbarEnable(enable:Partial<Axis_Property<boolean>>, callback?:(handler?:Line_Chart)=>void) : Line_Chart;
    function errorbarEnable(arg : void) : Axis_Property<boolean>;
    function errorbarEnable(enable:Partial<Axis_Property<boolean>> | void, callback?:(handler?:Line_Chart)=>void) : Line_Chart | Axis_Property<boolean> | undefined{
        if(typeof enable === "undefined" && callback == null)
            return {
                x : dataState.errorBar.x.enable,
                y : dataState.errorBar.y.enable
            }

        if(typeof enable === "object"){
            if(enable.x == null || enable.y == null) return dataHandler;
            if(enable.x === dataState.errorBar.x.enable && enable.y === dataState.errorBar.y.enable) return dataHandler;

            if(enable.x != null) dataState.errorBar.x.enable = enable.x;
            if(enable.y != null) dataState.errorBar.y.enable = enable.y;

            if(callback != null) callback(dataHandler);
            dataState.dirtify();
            return dataHandler;
        }
    }


//---------------------------------------------
//--------------- Generator -------------------

function generateErrorModifier<T>(container:Property_Generator<T>, property:Error_Properties, axis:"x"|"y") : Property_Modifier<T>{ 
        
    function errorbarProperty(value : Property_Generator<T>, callback?:(handler?:Line_Chart)=>void) : Line_Chart;
    function errorbarProperty(arg : void) : T | Array<T>;
    function errorbarProperty(value : Property_Generator<T> | void, callback?:(handler?:Line_Chart)=>void) : Line_Chart | T | Array<T> | undefined{
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
            if(property === "type")
                (dataState.errorBar.type as Property_Generator<T>) = typeof value === "object"? (value as Array<T>).slice() : value;
            else
                (dataState.errorBar[axis][property] as Property_Generator<T>) = typeof value === "object"? (value as Array<T>).slice() : value;

            if(callback != null) callback(dataHandler);
            dataState.dirtify();
            return dataHandler;
        }
    }

    return errorbarProperty;
}

//---------------------------------------------

    return {
        errorbarColorX,
        errorbarColorY,
        errorbarDataX,
        errorbarDataY,
        errorbarEnable,
        errorbarOpacityX,
        errorbarOpacityY,
        errorbarStyleX,
        errorbarStyleY,
        errorbarType,
        errorbarWidthX,
        errorbarWidthY
    }
}

export default ErrorLine;