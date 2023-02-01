import { Axis_Obj } from "../../../../tools/Axis_Obj/Axis_Obj_Types";
import { Axis_Property, Graph2D, RecursivePartial, Secondary_Grid } from "../../../Graph2D_Types";
import { Grid_Method_Generator } from "../Grid_Types";
import { Secondary_Grid_Generator } from "./Grid_Secondary_Types";

function SecondaryGrid({state, graphHandler, getLineDash}:Grid_Method_Generator) : Secondary_Grid_Generator {

//----------------- Draw ----------------------

    function draw(xMin : number, xMax : number, yMin : number, yMax:number){
        if(state.grid.secondary.x.enable)
            drawByAxis("x", yMin, yMax, xMin, xMax);
        if(state.grid.secondary.y.enable)
            drawByAxis("y", xMin, xMax, yMin, yMax);
    }

//---------------------------------------------
//---------------------------------------------

    function drawByAxis(axis:"x"|"y", start:number, end:number, limitMin:number, limitMax:number){
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
                if(coord < limitMin || coord > limitMax) return;

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












//---------- Customization Methods ------------
//-------------- Primary Grid -----------------

function secondaryGrid(grid : RecursivePartial<Axis_Property<Secondary_Grid>>) : Graph2D;
function secondaryGrid(arg : void) : Axis_Property<Secondary_Grid>;
function secondaryGrid(grid : RecursivePartial<Axis_Property<Secondary_Grid>>|void) : Graph2D|Axis_Property<Secondary_Grid>|undefined{
    if(typeof grid === "undefined")
        return state.grid.secondary;

    if(typeof grid === "object"){
        if(grid.x == null && grid.y==null) return graphHandler;
        if(grid.x?.color === state.grid.secondary.x.color && 
           grid.x?.opacity === state.grid.secondary.x.opacity &&
           grid.x?.enable === state.grid.secondary.x.enable &&
           grid.x?.style === state.grid.secondary.x.style &&
           grid.x?.width === state.grid.secondary.x.width &&
           grid.x?.density === state.grid.secondary.x.density &&
           grid.x?.minSpacing === state.grid.secondary.x.minSpacing &&
           grid.x?.maxDensity === state.grid.secondary.x.maxDensity &&
           grid.y?.color === state.grid.secondary.y.color && 
           grid.y?.opacity === state.grid.secondary.y.opacity &&
           grid.y?.enable === state.grid.secondary.y.enable &&
           grid.y?.style === state.grid.secondary.y.style &&
           grid.y?.width === state.grid.secondary.y.width &&
           grid.y?.density === state.grid.secondary.y.density &&
           grid.y?.minSpacing === state.grid.secondary.y.minSpacing &&
           grid.y?.maxDensity === state.grid.secondary.y.maxDensity) return graphHandler;

        if(grid.x?.enable !=null) state.grid.secondary.x.enable = grid.x.enable;
        if(grid.x?.color !=null) state.grid.secondary.x.color = grid.x.color;
        if(grid.x?.opacity !=null) state.grid.secondary.x.opacity = grid.x.opacity<0?0:(grid.x.opacity>1?1:grid.x.opacity);
        if(grid.x?.style !=null) state.grid.secondary.x.style = grid.x.style;
        if(grid.x?.width !=null) state.grid.secondary.x.width = grid.x.width;
        if(grid.x?.density !=null) state.grid.secondary.x.density = grid.x.density;
        if(grid.x?.minSpacing !=null) state.grid.secondary.x.minSpacing = grid.x.minSpacing;
        if(grid.x?.maxDensity !=null) state.grid.secondary.x.maxDensity = grid.x.maxDensity;
        if(grid.y?.enable !=null) state.grid.secondary.y.enable = grid.y.enable;
        if(grid.y?.color !=null) state.grid.secondary.y.color = grid.y.color;
        if(grid.y?.opacity !=null) state.grid.secondary.y.opacity = grid.y.opacity<0?0:(grid.y.opacity>1?1:grid.y.opacity);
        if(grid.y?.style !=null) state.grid.secondary.y.style = grid.y.style;
        if(grid.y?.width !=null) state.grid.secondary.y.width = grid.y.width;
        if(grid.y?.density !=null) state.grid.secondary.y.density = grid.y.density;
        if(grid.y?.minSpacing !=null) state.grid.secondary.y.minSpacing = grid.y.minSpacing;
        if(grid.y?.maxDensity !=null) state.grid.secondary.y.maxDensity = grid.y.maxDensity;

    
        state.draw.client();
        return graphHandler;
    }
}

//---------------------------------------------



    return {
        draw,
        secondaryGrid
    };

}

export default SecondaryGrid;