import { Axis_Property, Graph2D_Save_Asset } from "../../../../Graph2D/Graph2D_Types";
import { getColorFunction, isCallable } from "../../../../tools/Helplers/Helplers.js";
import { Field_Property } from "../../../Data_Types";
import { Heat_Map, Heat_Map_Callback, Heat_Map_Color, Heat_Map_Method_Generator, Heat_Map_Opacity, Heat_Map_Options } from "../../Heat_Map_Types";
import { Properties_Heat } from "./Properties_Heat_Types";

function PropertiesHeat({dataHandler, dataState, graphHandler} : Heat_Map_Method_Generator) : Properties_Heat{

//--------------- Enable ----------------------

    function enable(enable:boolean, callback?:Heat_Map_Callback) : Heat_Map;
    function enable(arg : void) : boolean;
    function enable(enable:boolean | void, callback?:Heat_Map_Callback) : Heat_Map | boolean | undefined{
        if(typeof enable === "undefined" && callback == null)
            return dataState.enable;

        if(typeof enable === "boolean"){
            if(dataState.enable === enable) return dataHandler;

            dataState.enable = enable;
            if(callback != null) callback(dataHandler, graphHandler);
            dataState.dirtify();

            return dataHandler;
        }
    }

//---------------------------------------------
//---------------- Use Axis -------------------

    function useAxis(axis:Partial<Axis_Property<"primary" | "secondary">>, callback?:Heat_Map_Callback) : Heat_Map;
    function useAxis(arg : void) : Axis_Property<"primary" | "secondary">;
    function useAxis(axis:Partial<Axis_Property<"primary"|"secondary">> | void, callback?:Heat_Map_Callback) : Heat_Map | Axis_Property<"primary"|"secondary"> | undefined{
        if(typeof axis === "undefined" && callback == null){
            return {...dataState.useAxis};
        }
        if(typeof axis === "object"){
            if(axis.x == null && axis.y == null) return dataHandler;
            if(axis.x === dataState.useAxis.x && axis.y === dataState.useAxis.y) return dataHandler;

            if(axis.x != null) dataState.useAxis.x = axis.x;
            if(axis.y != null) dataState.useAxis.y = axis.y;

            if(callback != null) callback(dataHandler, graphHandler);
            dataState.dirtify();

            return dataHandler;
        }
    }

//---------------------------------------------
//---------------- Smooth ---------------------

    function smooth(smooth:boolean, callback?:Heat_Map_Callback) : Heat_Map;
    function smooth(arg : void) : boolean;
    function smooth(smooth:boolean | void, callback?:Heat_Map_Callback) : Heat_Map | boolean | undefined{
        if(typeof smooth === "undefined" && callback == null)
            return dataState.smooth;

        if(typeof smooth === "boolean"){
            if(dataState.smooth === smooth) return dataHandler;

            dataState.smooth = smooth;
            if(callback != null) callback(dataHandler, graphHandler);
            dataState.dirtify();

            return dataHandler;
        }
    }

//---------------------------------------------
//---------------- Opacity --------------------

    function opacity(opacity : Heat_Map_Opacity, callback?:Heat_Map_Callback) : Heat_Map;
    function opacity(arg : void) : number | Field_Property<number>;
    function opacity(opacity : Heat_Map_Opacity | void, callback?:Heat_Map_Callback) : Heat_Map | number | Field_Property<number> | undefined{
        if(typeof opacity === "undefined" && callback == null){
            if(typeof dataState.opacity === "number")
                return dataState.opacity;
            else if(isCallable(dataState.opacity)){
                const meshX = dataHandler.meshX();
                const meshY = dataHandler.meshY();
                const data = dataHandler.data();
                const property : Field_Property<number> = [];

                for(let i=0; i<meshX.length; i++){
                    property.push([]);
                    for(let j=0; j<meshY[i].length; j++){
                        property[i].push(dataState.opacity(data[i][j], meshX[i][j], meshY[i][j], i, j, data, meshX, meshY, dataHandler, graphHandler));
                    }
                }

                return property;
            }else if(typeof dataState.opacity === "object")
                return dataState.opacity.map(row=>row.slice());
            
        }
        if(typeof opacity !== "undefined"){
            dataState.opacity = typeof opacity === "object" ? opacity.map(row=>row.slice()) : opacity;

            if(callback != null) callback(dataHandler, graphHandler);
            dataState.dirtify();

            return dataHandler;
        }
    }

//---------------------------------------------
//--------------- Color -----------------------

    function color(color:Heat_Map_Color, callback?:Heat_Map_Callback) : Heat_Map;
    function color(arg : void) : Field_Property<string>;
    function color(color:Heat_Map_Color | void, callback?:Heat_Map_Callback) : Heat_Map | Field_Property<string> | undefined{
        if(typeof color === "undefined" && callback == null){
            const meshX = dataHandler.meshX();
            const meshY = dataHandler.meshY();
            const data = dataHandler.data();
            const property : Field_Property<string> = [];
            const colorFun = getColorFunction({data, dataState});

            for(let i=0; i<meshX.length; i++){
                property.push([]);
                for(let j=0; j<meshY[i].length; j++){
                    property[i].push(colorFun(data[i][j], meshX[i][j], meshY[i][j], i, j, data, meshX, meshY, dataHandler, graphHandler));
                }
            }

            return property;
        }
        if(typeof color !== "undefined"){
            dataState.color = typeof color === "object" ? color.map(row=>row.slice()) : color;

            if(callback != null) callback(dataHandler, graphHandler);
            dataState.dirtify();

            return dataHandler;
        }
    }

//---------------------------------------------
//----------------- Save ----------------------

    function save() : Graph2D_Save_Asset{
        const options : Heat_Map_Options = {
            id : dataState.id,
            enable : dataState.enable,
            smooth : dataState.smooth,
            mesh : {
                x : dataHandler.meshX(),
                y : dataHandler.meshY()
            },
            data : dataHandler.data(),
            useAxis : {...dataState.useAxis},
            color : dataHandler.color(),
            opacity : dataHandler.opacity(),
        }

        return {
            options,
            assetType : "heatmap"
        }
    }

//---------------------------------------------

    return {
        color,
        enable,
        opacity,
        smooth,
        useAxis,
        save
    }
}

export default PropertiesHeat;