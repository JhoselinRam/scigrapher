import mapping from "../../../tools/Mapping/Mapping.js";
import { Mapping } from "../../../tools/Mapping/Mapping_Types";
import { Axis_Modifier, Method_Generator } from "../../Graph2D_Types";
import { MinMaxCoords, Scale } from "./Scale_Types";

function Scale({state}:Method_Generator) : Scale{
    const defaultScale : Axis_Modifier<Mapping> = {x:mapping({from:[0,1],to:[0,1]}),y:mapping({from:[0,1],to:[0,1]})};
    const primary : Axis_Modifier<Mapping> = defaultScale;
    const secondary : Axis_Modifier<Mapping> = defaultScale;
    const reference : Axis_Modifier<Mapping> = defaultScale;

//--------------- Compute Scale ---------------

    function compute(){
        const {xMin, xMax, yMin, yMax} = getMinMaxCoords();

        switch(state.axis.type){
            case "rectangular":
                primary.x = mapping({from:[state.canvas.xStart, state.canvas.xEnd], to:[xMin, xMax]});
                primary.y = mapping({from:[state.canvas.yStart, state.canvas.yEnd], to:[yMin, yMax]});
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
        const containerWidth = state.container.clientWidth;
        const containerHeight = state.container.clientHeight;
        let xMin : number;
        let xMax : number;
        let yMin : number;
        let yMax : number;
        
        switch(state.axis.position){
            case "center":
                xMin = state.canvas.marginStart;
                xMax = containerWidth - state.canvas.marginEnd;
                yMin = containerHeight - state.canvas.marginBottom;
                yMax = state.canvas.marginTop;
                break;

            case "bottomLeft":
                xMin = state.canvas.marginStart;
                xMax= containerWidth - state.canvas.marginEnd;
                yMin = containerHeight - state.canvas.marginBottom;
                yMax = state.canvas.marginTop;
                break;

            case "bottomRight":
                xMin = state.canvas.marginStart;
                xMax= containerWidth - state.canvas.marginEnd;
                yMin = containerHeight - state.canvas.marginBottom;
                yMax = state.canvas.marginTop;
                break;

            case "topLeft":
                xMin = state.canvas.marginStart;
                xMax= containerWidth - state.canvas.marginEnd;
                yMin = containerHeight - state.canvas.marginBottom;
                yMax = state.canvas.marginTop;
                break;

            case "topRight":
                xMin = state.canvas.marginStart;
                xMax= containerWidth - state.canvas.marginEnd;
                yMin = containerHeight - state.canvas.marginBottom;
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
        compute,
        primary,
        secondary,
        reference
    }
}

export default Scale;