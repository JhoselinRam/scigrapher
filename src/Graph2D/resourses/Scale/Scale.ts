import mapping from "../../../tools/Mapping/Mapping.js";
import { Mapping } from "../../../tools/Mapping/Mapping_Types.js";
import { Axis_Property, Method_Generator } from "../../Graph2D_Types";
import { MinMaxCoords, Scale } from "./Scale_Types";

function Scale({state}:Method_Generator) : Scale{

//--------------- Compute Scale ---------------

    function compute(){
        //const {xMin, xMax, yMin, yMax} = getMinMaxCoords();
        const graphRect = state.context.graphRect();

        let xType : "linear" | "log" = "linear";
        let yType : "linear" | "log" = "linear";

        switch(state.axis.type){
            case "x-log":
                xType = "log";
                break;

            case "y-log":
                yType = "log";
                break;

            case "log-log":
                xType = "log";
                yType = "log";
                break;
        }

        const primaryScaleX = mapping({from:[state.axis.x.start, state.axis.x.end], to:[0, graphRect.width], type:xType});
        const primaryScaleY = mapping({from:[state.axis.y.start, state.axis.y.end], to:[0, graphRect.height], type:yType});

        state.scale.primary = {
            x : primaryScaleX,
            y : primaryScaleY
        }; 



        if(state.axis.position === "center") return;

        //Secondary scale
        const secondaryScale : Partial<Axis_Property<Mapping>> = {};

        if(state.secondary.x != null && state.secondary.x.enable){
            const type = state.secondary.x.type === "rectangular" ? "linear" : "log";
            
            secondaryScale.x = mapping({
                from:[state.secondary.x.start, state.secondary.x.end], 
                to:[0, graphRect.width],
                type
            });
        }
        if(state.secondary.y != null && state.secondary.y.enable){
            const type = state.secondary.y.type === "rectangular" ? "linear" : "log";
            
            secondaryScale.y = mapping({
                from:[state.secondary.y.start, state.secondary.y.end], 
                to:[0, graphRect.height],
                type
            });
        }
        
        state.scale.secondary = secondaryScale;

    }

//---------------------------------------------
//---------------------------------------------

    function getMinMaxCoords() : MinMaxCoords{
        let xMin : number;
        let xMax : number;
        let yMin : number;
        let yMax : number;
        
        switch(state.axis.position){
            case "center":
                xMin = state.marginUsed.x.start;
                xMax = state.context.clientRect.width - state.marginUsed.x.end;
                yMin = state.context.clientRect.height - state.marginUsed.y.start;
                yMax = state.marginUsed.y.end;
                break;

            case "bottom-left":
                xMin = state.marginUsed.x.start + state.axisObj.primary.width;
                xMax= state.context.clientRect.width - state.marginUsed.x.end - state.axisObj.secondary.width;
                yMin = state.context.clientRect.height - state.marginUsed.y.start - state.axisObj.primary.height;
                yMax = state.marginUsed.y.end + state.axisObj.secondary.height;
                break;

            case "bottom-right":
                xMin = state.marginUsed.x.start + state.axisObj.secondary.width;
                xMax= state.context.clientRect.width - state.marginUsed.x.end - state.axisObj.primary.width;
                yMin = state.context.clientRect.height - state.marginUsed.y.start - state.axisObj.primary.height;
                yMax = state.marginUsed.y.end + state.axisObj.secondary.height;
                break;

            case "top-left":
                xMin = state.marginUsed.x.start + state.axisObj.primary.width;
                xMax= state.context.clientRect.width - state.marginUsed.x.end - state.axisObj.secondary.width;
                yMin = state.context.clientRect.height - state.marginUsed.y.start - state.axisObj.secondary.height;
                yMax = state.marginUsed.y.end + state.axisObj.primary.height;
                break;

            case "top-right":
                xMin = state.marginUsed.x.start + state.axisObj.secondary.width;
                xMax= state.context.clientRect.width - state.marginUsed.x.end - state.axisObj.primary.width;
                yMin = state.context.clientRect.height - state.marginUsed.y.start - state.axisObj.secondary.height;
                yMax = state.marginUsed.y.end + state.axisObj.primary.height;
                break;
        }

        return {
            xMin,
            xMax,
            yMin,
            yMax
        }
    }

//---------------------------------------------

    return {
        compute
    }
}

export default Scale;