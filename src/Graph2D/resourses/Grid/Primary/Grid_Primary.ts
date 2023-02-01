import { Axis_Obj } from "../../../../tools/Axis_Obj/Axis_Obj_Types";
import { Axis_Property, Graph2D, Primary_Grid, RecursivePartial } from "../../../Graph2D_Types";
import { Grid_Method_Generator } from "../Grid_Types";
import { Primary_Grid_Generator } from "./Grid_Primary_Types";

function PrimaryGrid({state, graphHandler, getLineDash} : Grid_Method_Generator) : Primary_Grid_Generator {

//----------------- Draw ----------------------

    function draw(xMin : number, xMax : number, yMin : number, yMax:number){
        if(state.grid.primary.x.enable)
            drawByAxis("x", yMin, yMax, xMin, xMax);
        if(state.grid.primary.y.enable)
            drawByAxis("y", xMin, xMax, yMin, yMax);
    }

//---------------------------------------------
//-------------- Draw By Axis -----------------

    function drawByAxis(axis : "x" | "y", start:number, end:number, limitMin:number, limitMax:number){
        const positions = (state.axisObj.primary.obj as Axis_Property<Axis_Obj>)[axis].positions;

        state.context.canvas.save();
        state.context.canvas.translate(state.context.clientRect.x, state.context.clientRect.y);

        state.context.canvas.strokeStyle = state.grid.primary[axis].color;
        state.context.canvas.globalAlpha = state.grid.primary[axis].opacity;
        state.context.canvas.lineWidth = state.grid.primary[axis].width;
        state.context.canvas.setLineDash(getLineDash(state.grid.primary[axis].style));
        state.context.canvas.beginPath();
        positions.forEach(item=>{
            const coord = Math.round(state.scale.primary[axis].map(item)) + state.grid.primary[axis].width%2 * 0.5;
            if(coord < limitMin || coord > limitMax) return;

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











//---------- Customization Methods ------------
//-------------- Primary Grid -----------------

    function primaryGrid(grid : RecursivePartial<Axis_Property<Primary_Grid>>) : Graph2D;
    function primaryGrid(arg : void) : Axis_Property<Primary_Grid>;
    function primaryGrid(grid : RecursivePartial<Axis_Property<Primary_Grid>>|void) : Graph2D|Axis_Property<Primary_Grid>|undefined{
        if(typeof grid === "undefined")
            return state.grid.primary;

        if(typeof grid === "object"){
            if(grid.x == null && grid.y==null) return graphHandler;
            if(grid.x?.color === state.grid.primary.x.color && 
               grid.x?.opacity === state.grid.primary.x.opacity &&
               grid.x?.enable === state.grid.primary.x.enable &&
               grid.x?.style === state.grid.primary.x.style &&
               grid.x?.width === state.grid.primary.x.width &&
               grid.y?.color === state.grid.primary.y.color && 
               grid.y?.opacity === state.grid.primary.y.opacity &&
               grid.y?.enable === state.grid.primary.y.enable &&
               grid.y?.style === state.grid.primary.y.style &&
               grid.y?.width === state.grid.primary.y.width ) return graphHandler;

            if(grid.x?.enable !=null) state.grid.primary.x.enable = grid.x.enable;
            if(grid.x?.color !=null) state.grid.primary.x.color = grid.x.color;
            if(grid.x?.opacity !=null) state.grid.primary.x.opacity = grid.x.opacity<0?0:(grid.x.opacity>1?1:grid.x.opacity);
            if(grid.x?.style !=null) state.grid.primary.x.style = grid.x.style;
            if(grid.x?.width !=null) state.grid.primary.x.width = grid.x.width;
            if(grid.y?.enable !=null) state.grid.primary.y.enable = grid.y.enable;
            if(grid.y?.color !=null) state.grid.primary.y.color = grid.y.color;
            if(grid.y?.opacity !=null) state.grid.primary.y.opacity = grid.y.opacity<0?0:(grid.y.opacity>1?1:grid.y.opacity);
            if(grid.y?.style !=null) state.grid.primary.y.style = grid.y.style;
            if(grid.y?.width !=null) state.grid.primary.y.width = grid.y.width;
        
            state.draw.client();
            return graphHandler;
        }
    }

//---------------------------------------------


    return {
        draw,
        primaryGrid
    }

}

export default PrimaryGrid;