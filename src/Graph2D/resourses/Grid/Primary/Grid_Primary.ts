import { Axis_Obj } from "../../../../tools/Axis_Obj/Axis_Obj_Types";
import { Axis_Property } from "../../../Graph2D_Types";
import { Grid_Method_Generator } from "../Grid_Types";
import { Primary_Grid } from "./Grid_Primary_Types";

function PrimaryGrid({state, graphHandler, getLineDash, getMinMaxCoords} : Grid_Method_Generator) : Primary_Grid {

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
        const positions = (state.axisObj.primary.obj as Axis_Property<Axis_Obj>)[axis].positions;

        state.context.canvas.save();
        state.context.canvas.translate(state.context.clientRect.x, state.context.clientRect.y);

        state.context.canvas.strokeStyle = state.grid.primary[axis].color;
        state.context.canvas.globalAlpha = state.grid.primary[axis].opacity;
        state.context.canvas.lineWidth = state.grid.primary[axis].width;
        state.context.canvas.setLineDash(getLineDash(state.grid.primary[axis].style));
        state.context.canvas.beginPath();
        positions.forEach(item=>{
            const coord = Math.round(state.scale.primary[axis].map(item)) + state.axis[axis].tickWidth%2 * 0.5;
            if(axis === "x"){
                state.context.canvas.moveTo(coord, start);
                state.context.canvas.lineTo(coord, end);
            }
            if(axis === "y"){
                state.context.canvas.moveTo(start, coord);
                state.context.canvas.lineTo(end, coord);
            }
        });
        state.context.canvas.stroke();

        state.context.canvas.restore();
    }

//---------------------------------------------

    return {
        draw
    }

}

export default PrimaryGrid;