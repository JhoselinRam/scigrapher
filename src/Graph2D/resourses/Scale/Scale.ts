import CreateAxis, { computePositions, createLabels } from "../../../tools/Axis_Obj/Axis_Obj.js";
import mapping from "../../../tools/Mapping/Mapping.js";
import { Method_Generator } from "../../Graph2D_Types";
import { MinMaxCoords, Scale } from "./Scale_Types";

function Scale({state}:Method_Generator) : Scale{

//--------------- Compute Scale ---------------

    function compute(){
        const {xMin, xMax, yMin, yMax} = getMinMaxCoords();

        switch(state.axis.type){
            case "rectangular":
                const primaryScaleX = mapping({from:[state.axis.x.start, state.axis.x.end], to:[xMin, xMax]});
                const primaryScaleY = mapping({from:[state.axis.y.start, state.axis.y.end], to:[yMin, yMax]});

                state.scale.primary = {
                    x : primaryScaleX,
                    y : primaryScaleY
                };  

                break;

            case "polar":
                break;

            case "x-log":
                break;

            case "y-log":
                break;

            case "log-log":
                break;
        }
    }

//---------------------------------------------
//---------------------------------------------

    function getMinMaxCoords() : MinMaxCoords{
        let xMin : number;
        let xMax : number;
        let yMin : number;
        let yMax : number;

        // Set auxiliar dummy scales
        const auxScaleX = mapping({
            from:[state.axis.x.start, state.axis.x.end], 
            to:[state.margin.x.start, state.context.clientRect.width - state.margin.x.end]
        });
        
        const auxScaleY = mapping({
            from:[state.axis.y.start, state.axis.y.end], 
            to:[state.context.clientRect.height - state.margin.y.start, state.margin.y.end]
        });
        state.scale.primary = {x:auxScaleX, y:auxScaleY}

        //Compute axis size
        const auxPositionsX = computePositions(auxScaleX, state.axis.x.ticks, state.axis.x.minSpacing);
        const labelsX = createLabels(auxPositionsX, "x", state);
        const auxPositionsY = computePositions(auxScaleY, state.axis.y.ticks, state.axis.y.minSpacing);
        const labelsY = createLabels(auxPositionsY, "y", state);

        const axisHeight = labelsX.maxHeight + state.labelOffset + state.axis.x.tickSize;
        const axisWidth = labelsY.maxWidth + state.labelOffset + state.axis.y.tickSize;

        state.axisObj.primary = {
            width : axisWidth,
            height : axisHeight
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
                xMax= state.context.clientRect.width - state.margin.x.end;
                yMin = state.context.clientRect.height - state.margin.y.start - axisHeight;
                yMax = state.margin.y.end;
                break;

            case "bottom-right":
                xMin = state.margin.x.start;
                xMax= state.context.clientRect.width - state.margin.x.end - axisWidth;
                yMin = state.context.clientRect.height - state.margin.y.start - axisHeight;
                yMax = state.margin.y.end;
                break;

            case "top-left":
                xMin = state.margin.x.start + axisWidth;
                xMax= state.context.clientRect.width - state.margin.x.end;
                yMin = state.context.clientRect.height - state.margin.y.start;
                yMax = state.margin.y.end + axisHeight;
                break;

            case "top-right":
                xMin = state.margin.x.start;
                xMax= state.context.clientRect.width - state.margin.x.end - axisWidth;
                yMin = state.context.clientRect.height - state.margin.y.start;
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