import { Method_Generator } from "../../../Graph2D_Types";
import { Primary_Grid } from "./Grid_Primary_Types";

function PrimaryGrid({state, graphHandler} : Method_Generator) : Primary_Grid {

//----------------- Draw ----------------------

    function draw(){
        if(state.grid.primary.x.enable)
            drawByAxis("x");
        if(state.grid.primary.y.enable)
            drawByAxis("y");
    }

//---------------------------------------------
//-------------- Draw By Axis -----------------

    function drawByAxis(axis : "x" | "y"){
        const [start, end] = getMinMaxCoords(axis);

        state.context.canvas.save();
        state.context.canvas.translate(state.context.clientRect.x, state.context.clientRect.x);

        state.context.canvas.strokeStyle = state.grid.primary[axis].color;

        state.context.canvas.restore();
    }

//---------------------------------------------
//---------------------------------------------

    function getMinMaxCoords(axis : "x" | "y") : [number, number]{
        const clientSize = axis==="x"? state.context.clientRect.height : state.context.clientRect.width;
        const axisSize = axis==="x"? state.axisObj.primary.height : state.axisObj.primary.width;
        const marginStart = axis==="x"? state.margin.y.end : state.margin.x.start;
        const marginEnd = axis==="x"? state.margin.y.start : state.margin.x.end;
        let start = 0;
        let end = clientSize;

        switch(state.axis.position){
            case "bottom-left":
                start = axis==="x"? start : marginStart + axisSize;
                end = axis==="x"? clientSize - marginEnd - axisSize : end;
                break;

            case "bottom-right":
                end = clientSize - marginStart - axisSize;
                break;
            
            case "top-left":
                start = marginStart + axisSize;
                break;

            case "top-right":
                start = axis==="x"? marginStart + axisSize : start;
                end = axis==="x"? end : clientSize - marginEnd - axisSize;
                break;
        }

        return [start, end];
    }

//---------------------------------------------

    return {
        draw
    }

}

export default PrimaryGrid;