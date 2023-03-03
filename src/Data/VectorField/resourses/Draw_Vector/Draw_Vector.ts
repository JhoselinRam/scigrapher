import {  Graph2D_State } from "../../../../Graph2D/Graph2D_Types";
import { Vector_Field_Method_Generator } from "../../Vector_Field_Types";
import { Draw_Vector } from "./Draw_Vector_Types";

function DrawVector({dataHandler, dataState, graphHandler}:Vector_Field_Method_Generator) : Draw_Vector {

//--------------- Draw Data -------------------

    function drawData(state : Graph2D_State){
        if(!dataState.enable) return;
        if(dataState.useAxis.x === "secondary" && state.scale.secondary.x == null){
            console.error("Dataset uses secondary x axis, but it's not defined yet");
            return;
        }
        if(dataState.useAxis.y === "secondary" && state.scale.secondary.y == null){
            console.error("Dataset uses secondary y axis, but it's not defined yet");
            return;
        }

        

    }

//---------------------------------------------

    return {
        drawData
    }

}

export default DrawVector;