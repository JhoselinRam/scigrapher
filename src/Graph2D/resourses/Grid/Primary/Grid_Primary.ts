import { Axis_Obj } from "../../../../tools/Axis_Obj/Axis_Obj_Types";
import { getLineDash } from "../../../../tools/Helplers/Helplers.js";
import { Axis_Property, Graph2D, graphCallback, Method_Generator, Primary_Grid, Rect } from "../../../Graph2D_Types";
import { Primary_Grid_Generator, Primary_Grid_Modifier } from "./Grid_Primary_Types";

function PrimaryGrid({state, graphHandler} : Method_Generator) : Primary_Grid_Generator {

//----------------- Draw ----------------------

    function draw(graphRect : Rect){
        if(state.grid.primary.x.enable){
            if(state.axis.type === "polar")
                drawPolar("x", graphRect);
            else
                drawRectangular("x", graphRect);
        }
        
        if(state.grid.primary.y.enable){
            if(state.axis.type === "polar")
            drawPolar("y", graphRect);
        else
            drawRectangular("y", graphRect);
        }
    }

//---------------------------------------------
//------------- Draw Rectangular --------------

    function drawRectangular(axis : "x" | "y", graphRect : Rect){
        const positions = (state.axisObj.primary.obj as Axis_Property<Axis_Obj>)[axis].positions;

        state.context.canvas.save();
        state.context.canvas.translate(graphRect.x, graphRect.y);

        state.context.canvas.strokeStyle = state.grid.primary[axis].color;
        state.context.canvas.globalAlpha = state.grid.primary[axis].opacity;
        state.context.canvas.lineWidth = state.grid.primary[axis].width;
        state.context.canvas.setLineDash(getLineDash(state.grid.primary[axis].style));
        state.context.canvas.beginPath();
        positions.forEach(item=>{
            const coord = Math.round(state.scale.primary[axis].map(item)) + state.grid.primary[axis].width%2 * 0.5;

            if(axis === "x"){
                state.context.canvas.moveTo(coord, 0);
                state.context.canvas.lineTo(coord, graphRect.height);
            }
            if(axis === "y"){
                state.context.canvas.moveTo(0, coord);
                state.context.canvas.lineTo(graphRect.width, coord);
            }
        });
        state.context.canvas.stroke();

        state.context.canvas.restore();
    }

//---------------------------------------------
//--------------- Draw Polar ------------------

    function drawPolar(axis : "x"|"y", graphRect : Rect){
        const xCenter = Math.round(state.scale.primary.x.map(0));
        const yCenter = Math.round(state.scale.primary.y.map(0));

        if(axis === "x"){
            const positions = (state.axisObj.primary.obj as Axis_Property<Axis_Obj>).x.positions.map(item => Math.abs(item));
            const radii = positions.filter((item, index) => item!==0 && positions.indexOf(item)===index);
            const thetha0 = 0;
            const thetha1 = 2*Math.PI;

            state.context.canvas.save();
            state.context.canvas.translate(graphRect.x, graphRect.y);
            state.context.canvas.beginPath();
            state.context.canvas.rect(0, 0, graphRect.width, graphRect.height);
            state.context.canvas.clip();

            state.context.canvas.strokeStyle = state.grid.primary.x.color;
            state.context.canvas.globalAlpha = state.grid.primary.x.opacity;
            state.context.canvas.lineWidth = state.grid.primary.x.width;
            state.context.canvas.setLineDash(getLineDash(state.grid.primary.x.style));
            radii.forEach(radius=>{
                let xRadiusUsed = Math.round(state.scale.primary.x.map(radius) - xCenter) + state.grid.primary.x.width%2 * 0.5;
                let yRadiusUsed = Math.round(state.scale.primary.y.map(radius) - yCenter) + state.grid.primary.x.width%2 * 0.5;

                state.context.canvas.beginPath();
                state.context.canvas.ellipse(xCenter, yCenter, xRadiusUsed, yRadiusUsed, 0,  thetha0, thetha1);
                state.context.canvas.stroke();
            });            

            state.context.canvas.restore();
        }

        if(axis === "y"){
            const deltaAngle = 2*Math.PI/state.grid.polarGrid;
            const maxRadius = Math.max(Math.hypot(state.axis.x.start,state.axis.y.start), Math.hypot(state.axis.x.start,state.axis.y.end), Math.hypot(state.axis.x.end,state.axis.y.start), Math.hypot(state.axis.x.end,state.axis.y.end));

            state.context.canvas.save();
            state.context.canvas.translate(graphRect.x, graphRect.y);
            state.context.canvas.beginPath();
            state.context.canvas.rect(0, 0, graphRect.width, graphRect.height);
            state.context.canvas.clip();

            state.context.canvas.strokeStyle = state.grid.primary.y.color;
            state.context.canvas.globalAlpha = state.grid.primary.y.opacity;
            state.context.canvas.lineWidth = state.grid.primary.y.width;
            state.context.canvas.setLineDash(getLineDash(state.grid.primary.y.style));
            state.context.canvas.beginPath();
            for(let i=0; i<state.grid.polarGrid; i++){
                const xCoor = state.scale.primary.x.map(maxRadius*Math.cos(i*deltaAngle));
                const yCoor = state.scale.primary.y.map(maxRadius*Math.sin(i*deltaAngle));
                
                state.context.canvas.moveTo(xCenter, yCenter);
                state.context.canvas.lineTo(xCoor, yCoor);
            }
            state.context.canvas.stroke();

            state.context.canvas.restore();
        }
    }

//---------------------------------------------











//---------- Customization Methods ------------
//-------------- Primary Grid -----------------

    function primaryGrid(grid : Primary_Grid_Modifier, callback?:graphCallback) : Graph2D;
    function primaryGrid(arg : void) : Axis_Property<Primary_Grid>;
    function primaryGrid(grid : Primary_Grid_Modifier|void, callback?:graphCallback) : Graph2D|Axis_Property<Primary_Grid>|undefined{
        if(typeof grid === "undefined" && callback == null)
            return {...state.grid.primary};

        if(typeof grid === "object"){
            if(grid.grid==null && grid.x == null && grid.y==null) return graphHandler;
            
            
            if(grid.grid?.color!=null){
                state.grid.primary.x.color = grid.grid.color;
                state.grid.primary.y.color = grid.grid.color;
            }
            if(grid.grid?.opacity!=null){
                const newOpacity = grid.grid.opacity<0?0:(grid.grid.opacity>1?1:grid.grid.opacity);
                state.grid.primary.x.opacity = newOpacity;
                state.grid.primary.y.opacity = newOpacity;
            }
            if(grid.grid?.enable!=null){
                state.grid.primary.x.enable = grid.grid.enable;
                state.grid.primary.y.enable = grid.grid.enable;
            }
            if(grid.grid?.style!=null){
                state.grid.primary.x.style = grid.grid.style;
                state.grid.primary.y.style = grid.grid.style;
            }
            if(grid.grid?.width!=null){
                state.grid.primary.x.width = grid.grid.width;
                state.grid.primary.y.width = grid.grid.width;
            }

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

            
            if(callback != null) callback(graphHandler, state.data.map(set=>set.dataset));
            state.dirty.client = true;
            
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