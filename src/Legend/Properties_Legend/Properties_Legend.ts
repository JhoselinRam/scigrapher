import { Graph2D_Save_Asset, Rect } from "../../Graph2D/Graph2D_Types";
import { Legend, Legend_Border, Legend_Callback, Legend_Data_Entrie, Legend_Method_Generator, Legend_Options, Legend_Position, Legend_Title } from "../Legend_Types";
import { Legend_Data_Props, Legend_Dynamic_Method, Legend_Dynamic_Properties_Options, Legend_Properties, Legend_Static_Method, Legend_Static_Properties_Options } from "./Properties_Legend_Types";

function LegendProperties({graphHandler, legendHandler, legendState, state} : Legend_Method_Generator) : Legend_Properties{

//----------- Generated Methods ---------------

    const enable = generateStaticMethod<boolean>("enable", {graphHandler, legendHandler, legendState, state});
    const columns = generateStaticMethod<number>("columns", {graphHandler, legendHandler, legendState, state});
    const width = generateStaticMethod<number>("width", {graphHandler, legendHandler, legendState, state});
    const id = generateStaticMethod<string>("id", {graphHandler, legendHandler, legendState, state});
    
    const border = generateDynamicMethod<Legend_Border>("border", {graphHandler, legendHandler, legendState, state});
    const background = generateDynamicMethod<{color:string, opacity:number}>("background", {graphHandler, legendHandler, legendState, state});
    const title = generateDynamicMethod<Legend_Title>("title", {graphHandler, legendHandler, legendState, state});

//---------------------------------------------
//---------------- Data -----------------------

    const defaultLabel : Legend_Data_Entrie = {
        dataset : "",
        label : "",
        text : {
            color : "#000000",
            opacity : 1,
            font : "Arial, Helvetica Neue, Helvetica, sans-serif",
            size : "12px",
            specifier : ""
        }
    }

    function data(data:Legend_Data_Props, callback?:Legend_Callback) : Legend;
    function data(arg : void) : Array<Legend_Data_Entrie>;
    function data(data:Legend_Data_Props | void, callback?:Legend_Callback) : Legend | Array<Legend_Data_Entrie> | undefined{
        if(typeof data === "undefined" && callback == null)
            return legendState.data.slice();

        if(typeof data === "object"){
            const newData = data.slice();

            newData.forEach((item, i)=>{ newData[i] = {...defaultLabel ,...item, text:{...defaultLabel.text ,...item.text}} });
            
            legendState.data = newData as Array<Legend_Data_Entrie>;
            legendState.compute();
            if(callback != null) callback(legendHandler, graphHandler);
            state.dirty.data = true;

            return legendHandler;
        }
    } 


//---------------------------------------------
//--------------- Position --------------------

    function position(position : Legend_Position, callback?:Legend_Callback) : Legend;
    function position(arg : void) : string;
    function position(position : Legend_Position | void, callback?:Legend_Callback) : Legend | string | undefined{
        if(typeof position === "undefined" && callback == null){
            if(typeof legendState.position === "object")
                return "floating";
            if(typeof legendState.position === "string")
                return legendState.position;            
        }

        if(typeof position !== "undefined"){
            if(typeof position === "string" && legendState.position === position)return legendHandler;
            if(typeof position === "object" && typeof legendState.position === "object" && position.x===legendState.position.x && position.y===legendState.position.y)return legendHandler;
        
            legendState.position = position;
            legendState.compute();
            if(callback != null) callback(legendHandler, graphHandler);
            state.dirty.data = true;

            return legendHandler;
            
        }  
    }

//---------------------------------------------
//--------------- Metrics ---------------------

    function metrics() : Rect{
        return {
            x : legendState.metrics.x,
            y : legendState.metrics.y,
            width : legendState.metrics.width,
            height : legendState.metrics.height
        }
    }

//---------------------------------------------
//----------------- Save ----------------------

    function save() : Graph2D_Save_Asset {
        const options :Legend_Options = {
            enable : legendState.enable,
            columns : legendState.columns,
            width : legendState.width,
            id : legendState.id,
            position : legendState.position,
            data : legendState.data,
            border : {...legendState.border},
            background : {...legendState.background},
            title : {...legendState.title},
        }

        return {
            options,
            assetType : "legend"
        }
    }

//---------------------------------------------

    return {
        background,
        border,
        columns,
        enable,
        title,
        width,
        data,
        position,
        metrics,
        id,
        save
    }
}

export default LegendProperties;















//------------ Static Generator ---------------

function generateStaticMethod<T>(option:Legend_Static_Properties_Options, {graphHandler,legendHandler, legendState, state} : Legend_Method_Generator) : Legend_Static_Method<T>{

    function staticMethod(property:T, callback?:Legend_Callback) : Legend;
    function staticMethod(arg : void) : T;
    function staticMethod(property:T | void, callback?:Legend_Callback) : Legend | T | undefined{
        if(typeof property === "undefined" && callback == null)
            return legendState[option] as T;

        if(typeof property !== "undefined"){
            if(property === legendState[option]) return legendHandler;

            (legendState[option] as T) = property;
            legendState.compute();
            if(callback != null) callback(legendHandler, graphHandler);
            state.dirty.data = true;

            return legendHandler;
        }
    }

    return staticMethod;

}

//---------------------------------------------
//------------ Dynamic Methods ----------------

function generateDynamicMethod<T>(option:Legend_Dynamic_Properties_Options, {graphHandler,legendHandler, legendState, state} : Legend_Method_Generator) : Legend_Dynamic_Method<T>{

    function dynamicMethod(property:Partial<T>, callback?:Legend_Callback) : Legend;
    function dynamicMethod(arg : void) : T;
    function dynamicMethod(property:Partial<T> | void, callback?:Legend_Callback) : Legend | T | undefined{
        
        if(typeof property === "undefined" && callback == null)
            return {...(legendState[option] as T)};

        if(typeof property === "object"){
            (legendState[option] as T) = {...legendState[option], ...property} as T;
            legendState.compute();
            if(callback != null) callback(legendHandler, graphHandler);
            state.dirty.data = true;

            return legendHandler;
        }
    }

    return dynamicMethod;

}

//---------------------------------------------