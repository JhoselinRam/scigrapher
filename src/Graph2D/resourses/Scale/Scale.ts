import mapping from "../../../tools/Mapping/Mapping.js";
import { Mapping } from "../../../tools/Mapping/Mapping_Types";
import { Axis_Property, Method_Generator } from "../../Graph2D_Types";
import { MinMaxCoords, Scale } from "./Scale_Types";

function Scale({state}:Method_Generator) : Scale{
    const defaultScale : Axis_Property<Mapping> = {x:mapping({from:[0,1],to:[0,1]}),y:mapping({from:[0,1],to:[0,1]})};
    const primary : Axis_Property<Mapping> = defaultScale;
    const secondary : Axis_Property<Mapping> = defaultScale;
    const reference : Axis_Property<Mapping> = defaultScale;

//--------------- Compute Scale ---------------

    function compute(){
        const {xMin, xMax, yMin, yMax} = getMinMaxCoords();

        switch(state.axis.type){
            case "rectangular":
                primary.x = mapping({from:[state.axis.xStart, state.axis.xEnd], to:[xMin, xMax]});
                primary.y = mapping({from:[state.axis.yStart, state.axis.yEnd], to:[yMin, yMax]});
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

            case "bottom-left":
                xMin = state.canvas.marginStart;
                xMax= containerWidth - state.canvas.marginEnd;
                yMin = containerHeight - state.canvas.marginBottom;
                yMax = state.canvas.marginTop;
                break;

            case "bottom-right":
                xMin = state.canvas.marginStart;
                xMax= containerWidth - state.canvas.marginEnd;
                yMin = containerHeight - state.canvas.marginBottom;
                yMax = state.canvas.marginTop;
                break;

            case "top-left":
                xMin = state.canvas.marginStart;
                xMax= containerWidth - state.canvas.marginEnd;
                yMin = containerHeight - state.canvas.marginBottom;
                yMax = state.canvas.marginTop;
                break;

            case "top-right":
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