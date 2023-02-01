import { Axis_Obj } from "../../../../tools/Axis_Obj/Axis_Obj_Types";
import { Axis_Property } from "../../../Graph2D_Types";
import { Grid_Method_Generator } from "../Grid_Types";
import { Secondary_Grid } from "./Grid_Secondary_Types";

function SecondaryGrid({state, graphHandler, getLineDash, getMinMaxCoords}:Grid_Method_Generator) : Secondary_Grid {

//----------------- Draw ----------------------

    function draw(){
        if(state.grid.secondary.x.enable)
            drawByAxis("x");
        if(state.grid.secondary.y.enable)
            drawByAxis("y");
    }

//---------------------------------------------
//---------------------------------------------

    function drawByAxis(axis:"x"|"y"){
        const [start, end] = getMinMaxCoords(axis);
        const positions = (state.axisObj.primary.obj as Axis_Property<Axis_Obj>)[axis].positions;
        const drawAt = positions.map(item=>state.scale.primary[axis].map(item));    //Maps to "linear space" so it works on log scales
        drawAt.push(drawAt[drawAt.length-1] + drawAt[1]-drawAt[0]); //Adds one more position at the end
        const partition = getPartition(axis, Math.abs(drawAt[1]-drawAt[0]));
        const spacing = (drawAt[1]-drawAt[0])/partition;

        state.context.canvas.save();
        state.context.canvas.translate(state.context.clientRect.x, state.context.clientRect.y);

        state.context.canvas.strokeStyle = state.grid.secondary[axis].color;
        state.context.canvas.globalAlpha = state.grid.secondary[axis].opacity;
        state.context.canvas.lineWidth = state.grid.secondary[axis].width;
        state.context.canvas.setLineDash(getLineDash(state.grid.secondary[axis].style));
        state.context.canvas.beginPath();
        drawAt.forEach(item=>{
            for(let i=1; i<partition; i++){
                const coord = Math.round(item-i*spacing) + state.grid.secondary[axis].width%2 * 0.5;
                if(axis === "x"){
                    state.context.canvas.moveTo(coord, start);
                    state.context.canvas.lineTo(coord, end);
                }
                if(axis === "y"){
                    state.context.canvas.moveTo(start, coord);
                    state.context.canvas.lineTo(end, coord);
                }
            }
        });
        state.context.canvas.stroke();

        state.context.canvas.restore();



    }

//---------------------------------------------
//---------------------------------------------

    function getPartition(axis:"x"|"y", interval:number) : number{
        let spacing = 0;

        if(typeof state.grid.secondary[axis].density === "number")
            spacing = state.grid.secondary[axis].density as number;

        if(state.grid.secondary[axis].density === "auto"){
            const minPartition = Math.ceil(interval/state.grid.secondary[axis].minSpacing);
            spacing = minPartition<state.grid.secondary[axis].maxDensity? minPartition : state.grid.secondary[axis].maxDensity;
        }

        return spacing;
    }

//---------------------------------------------

    return {
        draw
    };

}

export default SecondaryGrid;