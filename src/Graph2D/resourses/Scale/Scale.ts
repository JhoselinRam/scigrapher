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
                const primaryScaleY = mapping({from:[state.axis.y.start, state.axis.y.start], to:[yMin, yMax]});

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
                xMin = state.margin.x.start;
                xMax = state.context.clientRect.width - state.margin.x.end;
                yMin = state.context.clientRect.height - state.margin.y.start;
                yMax = state.margin.y.end;
                break;

            case "bottom-left":
                xMin = state.margin.x.start;
                xMax= state.context.clientRect.width - state.margin.x.end;
                yMin = state.context.clientRect.height - state.margin.y.start;
                yMax = state.margin.y.end;
                break;

            case "bottom-right":
                xMin = state.margin.x.start;
                xMax= state.context.clientRect.width - state.margin.x.end;
                yMin = state.context.clientRect.height - state.margin.y.start;
                yMax = state.margin.y.end;
                break;

            case "top-left":
                xMin = state.margin.x.start;
                xMax= state.context.clientRect.width - state.margin.x.end;
                yMin = state.context.clientRect.height - state.margin.y.start;
                yMax = state.margin.y.end;
                break;

            case "top-right":
                xMin = state.margin.x.start;
                xMax= state.context.clientRect.width - state.margin.x.end;
                yMin = state.context.clientRect.height - state.margin.y.start;
                yMax = state.margin.y.end;
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