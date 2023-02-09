import { computePositions, createLabels } from "../../../tools/Axis_Obj/Axis_Obj.js";
import mapping from "../../../tools/Mapping/Mapping.js";
import { Mapping } from "../../../tools/Mapping/Mapping_Types.js";
import { Axis_Property, Method_Generator } from "../../Graph2D_Types";
import { MinMaxCoords, Scale } from "./Scale_Types";

function Scale({state}:Method_Generator) : Scale{

//--------------- Compute Scale ---------------

    function compute(){
        const {xMin, xMax, yMin, yMax} = getMinMaxCoords();
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

        const primaryScaleX = mapping({from:[state.axis.x.start, state.axis.x.end], to:[xMin, xMax], type:xType});
        const primaryScaleY = mapping({from:[state.axis.y.start, state.axis.y.end], to:[yMin, yMax], type:yType});

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
                to:[xMin, xMax],
                type
            });
        }
        if(state.secondary.y != null && state.secondary.y.enable){
            const type = state.secondary.y.type === "rectangular" ? "linear" : "log";
            
            secondaryScale.y = mapping({
                from:[state.secondary.y.start, state.secondary.y.end], 
                to:[yMin, yMax],
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

        let secondaryAxisHeight = 0;
        let secondaryAxisWidth = 0;

        // Set auxiliar dummy scales
        const auxScaleX = mapping({
            from:[state.axis.x.start, state.axis.x.end], 
            to:[state.margin.x.start, state.context.clientRect.width - state.margin.x.end]
        });
        
        const auxScaleY = mapping({
            from:[state.axis.y.start, state.axis.y.end], 
            to:[state.context.clientRect.height - state.margin.y.start, state.margin.y.end]
        });

        
        if(state.secondary.x != null && state.secondary.x.enable){
            const secondaryScaleX = mapping({
                from:[state.secondary.x.start, state.secondary.x.end], 
                to:[state.margin.x.start, state.context.clientRect.width - state.margin.x.end]
            });
            const secondaryPositionsX = computePositions(secondaryScaleX, state.secondary.x.ticks, state.secondary.x.minSpacing);
            const secondaryLabelsX = createLabels(secondaryPositionsX, "x", state, "secondary");

            secondaryAxisHeight = secondaryLabelsX.maxHeight + state.labelOffset + state.secondary.x.tickSize;
        }
        
        if(state.secondary.y != null && state.secondary.y.enable){
            const secondaryScaleY = mapping({
                from:[state.secondary.y.start, state.secondary.y.end], 
                to:[state.context.clientRect.height - state.margin.y.start, state.margin.y.end]
            });
            const secondaryPositionsY = computePositions(secondaryScaleY, state.secondary.y.ticks, state.secondary.y.minSpacing);
            const secondaryLabelsY = createLabels(secondaryPositionsY, "y", state, "secondary");

            secondaryAxisWidth = secondaryLabelsY.maxWidth + state.labelOffset + state.secondary.y.tickSize;
        }
        

        //Compute axis size
        const auxPositionsX = computePositions(auxScaleX, state.axis.x.ticks, state.axis.x.minSpacing);
        const labelsX = createLabels(auxPositionsX, "x", state, "primary");
        const auxPositionsY = computePositions(auxScaleY, state.axis.y.ticks, state.axis.y.minSpacing);
        const labelsY = createLabels(auxPositionsY, "y", state, "primary");

        const axisHeight = labelsX.maxHeight + state.labelOffset + state.axis.x.tickSize;
        const axisWidth = labelsY.maxWidth + state.labelOffset + state.axis.y.tickSize;

        state.axisObj.primary = {
            width : axisWidth,
            height : axisHeight
        }
        
        state.axisObj.secondary = {
            width : secondaryAxisWidth,
            height : secondaryAxisHeight
        }
        
        switch(state.axis.position){
            case "center":
                xMin = state.margin.x.start;
                xMax = state.context.clientRect.width - state.margin.x.end;
                yMin = state.context.clientRect.height - state.margin.y.start;
                yMax = state.margin.y.end;
                break;

            case "bottom-left":
                xMin = state.margin.x.start + axisWidth;
                xMax= state.context.clientRect.width - state.margin.x.end - secondaryAxisWidth;
                yMin = state.context.clientRect.height - state.margin.y.start - axisHeight;
                yMax = state.margin.y.end + secondaryAxisHeight;
                break;

            case "bottom-right":
                xMin = state.margin.x.start + secondaryAxisWidth;
                xMax= state.context.clientRect.width - state.margin.x.end - axisWidth;
                yMin = state.context.clientRect.height - state.margin.y.start - axisHeight;
                yMax = state.margin.y.end + secondaryAxisHeight;
                break;

            case "top-left":
                xMin = state.margin.x.start + axisWidth;
                xMax= state.context.clientRect.width - state.margin.x.end - secondaryAxisWidth;
                yMin = state.context.clientRect.height - state.margin.y.start - secondaryAxisHeight;
                yMax = state.margin.y.end + axisHeight;
                break;

            case "top-right":
                xMin = state.margin.x.start + secondaryAxisWidth;
                xMax= state.context.clientRect.width - state.margin.x.end - axisWidth;
                yMin = state.context.clientRect.height - state.margin.y.start - secondaryAxisHeight;
                yMax = state.margin.y.end + axisHeight;
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