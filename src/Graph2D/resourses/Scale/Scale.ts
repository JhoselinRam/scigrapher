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
        
        switch(state.axis.position){
            case "center":
                xMin = state.canvas.marginStart;
                xMax = state.context.clientRect.width - state.canvas.marginEnd;
                yMin = state.context.clientRect.height - state.canvas.marginBottom;
                yMax = state.canvas.marginTop;
                break;

            case "bottom-left":
                xMin = state.canvas.marginStart;
                xMax= state.context.clientRect.width - state.canvas.marginEnd;
                yMin = state.context.clientRect.height - state.canvas.marginBottom;
                yMax = state.canvas.marginTop;
                break;

            case "bottom-right":
                xMin = state.canvas.marginStart;
                xMax= state.context.clientRect.width - state.canvas.marginEnd;
                yMin = state.context.clientRect.height - state.canvas.marginBottom;
                yMax = state.canvas.marginTop;
                break;

            case "top-left":
                xMin = state.canvas.marginStart;
                xMax= state.context.clientRect.width - state.canvas.marginEnd;
                yMin = state.context.clientRect.height - state.canvas.marginBottom;
                yMax = state.canvas.marginTop;
                break;

            case "top-right":
                xMin = state.canvas.marginStart;
                xMax= state.context.clientRect.width - state.canvas.marginEnd;
                yMin = state.context.clientRect.height - state.canvas.marginBottom;
                yMax = state.canvas.marginTop;
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