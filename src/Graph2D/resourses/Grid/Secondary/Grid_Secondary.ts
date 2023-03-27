import { Axis_Obj } from "../../../../tools/Axis_Obj/Axis_Obj_Types";
import { clamp, getLineDash } from "../../../../tools/Helplers/Helplers.js";
import { Axis_Property, Graph2D, graphCallback, Method_Generator, Rect, Secondary_Grid } from "../../../Graph2D_Types";
import { Secondary_Grid_Generator, Secondary_Grid_Modifier } from "./Grid_Secondary_Types";

function SecondaryGrid({state, graphHandler}:Method_Generator) : Secondary_Grid_Generator {

//----------------- Draw ----------------------

    function draw(graphRect : Rect){
        if(state.grid.secondary.x.enable){
            if(state.axis.type === "rectangular" || state.axis.type === "y-log")
                drawRectangular("x", graphRect);
                
            if(state.axis.type === "polar")
                drawPolar("x", graphRect);

            if(state.axis.type === "x-log" || state.axis.type === "log-log")
                drawLog("x", graphRect);
        }
        if(state.grid.secondary.y.enable){
            if(state.axis.type === "rectangular" || state.axis.type === "x-log")
                drawRectangular("y", graphRect);
                
            if(state.axis.type === "polar")
                drawPolar("y", graphRect);

            if(state.axis.type === "y-log" || state.axis.type === "log-log")
                drawLog("y", graphRect);
        }
    }

//---------------------------------------------
//------------- Draw Rectangular --------------

    function drawRectangular(axis:"x"|"y", graphRect:Rect){
        const scaleUsed = state.scale.primary[axis];
        const positions = (state.axisObj.primary.obj as Axis_Property<Axis_Obj>)[axis].positions.slice();
        positions.push(positions[positions.length-1] + positions[1]-positions[0]); //Adds one more position at the end
        const partition = getPartition(axis, Math.abs(scaleUsed.map(positions[1])-scaleUsed.map(positions[0])));
        const spacing = (scaleUsed.map(positions[1])-scaleUsed.map(positions[0]))/partition;

        state.context.canvas.save();
        state.context.canvas.translate(graphRect.x, graphRect.y);

        state.context.canvas.strokeStyle = state.grid.secondary[axis].color;
        state.context.canvas.globalAlpha = state.grid.secondary[axis].opacity;
        state.context.canvas.lineWidth = state.grid.secondary[axis].width;
        state.context.canvas.setLineDash(getLineDash(state.grid.secondary[axis].style));
        state.context.canvas.beginPath();
        positions.forEach(item=>{

            for(let i=1; i<partition; i++){
                const coord = Math.round(scaleUsed.map(item) - i*spacing) + state.grid.secondary[axis].width%2 * 0.5;
                
                if(axis === "x"){
                    if(coord < 0 || coord > graphRect.width) continue;
                    state.context.canvas.moveTo(coord, 0);
                    state.context.canvas.lineTo(coord, graphRect.height);
                }
                if(axis === "y"){
                    if(coord < 0 || coord > graphRect.height) continue;
                    state.context.canvas.moveTo(0, coord);
                    state.context.canvas.lineTo(graphRect.width, coord);
                }
            }
        });
        state.context.canvas.stroke();

        state.context.canvas.restore();



    }

//---------------------------------------------
//-------------- Get Partition ----------------

    function getPartition(axis:"x"|"y", interval:number, start=0, end=0) : number{
        let spacing = 0;

        if(typeof state.grid.secondary[axis].density === "number")
            spacing = state.grid.secondary[axis].density as number;

        if(state.grid.secondary[axis].density === "auto"){
            if(state.scale.primary[axis].type === "linear"){
                const minPartition = Math.ceil(interval/state.grid.secondary[axis].minSpacing);
                spacing = minPartition<state.grid.secondary[axis].maxDensity? minPartition : state.grid.secondary[axis].maxDensity;
            }
            if(state.scale.primary[axis].type === "log"){
                const domainStart = start<end?start:end;
                const domainEnd = end>start?end:start;
                const tickMultiplier = [5, 4, 3, 2, 1]; //Order is important!!
                spacing = 10;
                
                for(let i=0; i<=tickMultiplier.length; i++){
                    const tickPosition = domainEnd - (domainEnd-domainStart)/spacing;
                    const minTickSpacing = Math.abs(state.scale.primary[axis].map(domainEnd) - state.scale.primary[axis].map(tickPosition));
           
                    if(minTickSpacing>=state.grid.secondary[axis].minSpacing)
                        break;
                    spacing = tickMultiplier[i];
                }
            }
        }

        return spacing;
    }

//---------------------------------------------
//--------------- Draw Polar ------------------

    function drawPolar(axis : "x"|"y", graphRect:Rect){
        const xCenter = Math.round(state.scale.primary.x.map(0));
        const yCenter = Math.round(state.scale.primary.y.map(0));

        if(axis==="x"){
            const positions = (state.axisObj.primary.obj as Axis_Property<Axis_Obj>).x.positions.map(item => Math.abs(item)).sort();
            let radii = positions.filter((item, index)=>{
                
                if(index === positions.length-1)
                    return true;
               
                const tolerance = 0.00000001;
                if(Math.abs(item - positions[index+1]) > tolerance)
                    return true;
                return false;
            });
               
            radii = radii.map(item => state.scale.primary.x.map(item));
            radii.push(radii[radii.length-1] + radii[1] - radii[0]);

            const partition = getPartition("x", radii[1]-radii[0]);
            const spacing = (radii[1]-radii[0])/partition;
            const thetha0 = 0;
            const thetha1 = 2*Math.PI;
            const yCompression = (yCenter - state.scale.primary.y.map(1)) / (state.scale.primary.x.map(1) - xCenter);
 
            state.context.canvas.save();
            state.context.canvas.translate(graphRect.x, graphRect.y);
            state.context.canvas.beginPath();
            state.context.canvas.rect(0, 0, graphRect.width, graphRect.height);
            state.context.canvas.clip();
            state.context.canvas.translate(xCenter, yCenter);
            state.context.canvas.scale(1,yCompression);

            state.context.canvas.strokeStyle = state.grid.secondary.x.color;
            state.context.canvas.globalAlpha = state.grid.secondary.x.opacity;
            state.context.canvas.lineWidth = state.grid.secondary.x.width;
            state.context.canvas.setLineDash(getLineDash(state.grid.secondary.x.style));
            radii.forEach(item=>{
                for(let i=1; i<partition; i++){
                    const radiusUsed = Math.round(item-i*spacing - xCenter) + state.grid.secondary.x.width%2 * 0.5;

                    if(radiusUsed > 0){
                        state.context.canvas.beginPath();
                        state.context.canvas.arc(0, 0, radiusUsed, thetha0, thetha1);
                        state.context.canvas.stroke();
                    }
                }
            });

            state.context.canvas.restore();
        }

        if(axis==="y"){
            const deltaPrimaryAngle = 2*Math.PI/state.grid.polarGrid;
            const density = typeof state.grid.secondary.y.density === "string" ? 4 : state.grid.secondary.y.density;
            const deltaAngle = deltaPrimaryAngle/density;
            const maxRadius = Math.max(Math.hypot(state.axis.x.start,state.axis.y.start), Math.hypot(state.axis.x.start,state.axis.y.end), Math.hypot(state.axis.x.end,state.axis.y.start), Math.hypot(state.axis.x.end,state.axis.y.end));

            state.context.canvas.save();
            state.context.canvas.translate(graphRect.x, graphRect.y);
            state.context.canvas.beginPath();
            state.context.canvas.rect(0, 0, graphRect.width, graphRect.height);
            state.context.canvas.clip();

            state.context.canvas.strokeStyle = state.grid.secondary.y.color;
            state.context.canvas.globalAlpha = state.grid.secondary.y.opacity;
            state.context.canvas.lineWidth = state.grid.secondary.y.width;
            state.context.canvas.setLineDash(getLineDash(state.grid.secondary.y.style));
            state.context.canvas.beginPath();
            for(let i=0; i<state.grid.polarGrid; i++){
                for(let j=1; j<density; j++){
                    const angle = i*deltaPrimaryAngle + j*deltaAngle;
                    const xCoor = state.scale.primary.x.map(maxRadius*Math.cos(angle));
                    const yCoor = state.scale.primary.y.map(maxRadius*Math.sin(angle));

                    state.context.canvas.moveTo(xCenter, yCenter);
                    state.context.canvas.lineTo(xCoor, yCoor);
                }
            }
            state.context.canvas.stroke();


            state.context.canvas.restore();
        }
    }

//---------------------------------------------
//-------------- Draw Log ---------------------

    function drawLog(axis:"x"|"y", graphRect:Rect){
        const drawAt = (state.axisObj.primary.obj as Axis_Property<Axis_Obj>)[axis].positions.slice();
        const magnitudeLeap = Math.floor(Math.log10(Math.abs(drawAt[1]))) - Math.floor(Math.log10(Math.abs(drawAt[0])));
        drawAt.push(drawAt[drawAt.length-1]*Math.pow(10,magnitudeLeap));
        const partition = getPartition(axis, 0, Math.abs(drawAt[0]), Math.abs(drawAt[1]));

        state.context.canvas.save();
        state.context.canvas.translate(graphRect.x, graphRect.y);

        state.context.canvas.strokeStyle = state.grid.secondary[axis].color;
        state.context.canvas.globalAlpha = state.grid.secondary[axis].opacity;
        state.context.canvas.lineWidth = state.grid.secondary[axis].width;
        state.context.canvas.setLineDash(getLineDash(state.grid.secondary[axis].style));
        state.context.canvas.beginPath();
        drawAt.forEach(item=>{
            const spacing = (item - (item/Math.pow(10,magnitudeLeap))) / partition;
           
            for(let i=1; i<partition; i++){ 
                const coord = Math.round(state.scale.primary[axis].map(item-i*spacing)) + state.grid.secondary[axis].width%2 * 0.5;

                
                if(axis === "x"){
                    if(coord < 0 || coord > graphRect.width) continue;
                    state.context.canvas.moveTo(coord, 0);
                    state.context.canvas.lineTo(coord, graphRect.height);
                }
                if(axis === "y"){
                    state.context.canvas.moveTo(0, coord);
                    state.context.canvas.lineTo(graphRect.width, coord);
                }
            }
            
        });
        state.context.canvas.stroke();

        state.context.canvas.restore();
    }

//---------------------------------------------












//---------- Customization Methods ------------
//------------- Secondary Grid ----------------

function secondaryGrid(grid : Secondary_Grid_Modifier, callback?:graphCallback) : Graph2D;
function secondaryGrid(arg : void) : Axis_Property<Secondary_Grid>;
function secondaryGrid(grid : Secondary_Grid_Modifier|void, callback?:graphCallback) : Graph2D|Axis_Property<Secondary_Grid>|undefined{
    if(typeof grid === "undefined" && callback == null)
        return {...state.grid.secondary};

    if(typeof grid === "object"){
        if(grid.grid==null && grid.x == null && grid.y==null) return graphHandler;
        

        if(grid.grid != null){
            state.grid.secondary.x = {...state.grid.secondary.x, ...grid.grid};
            state.grid.secondary.y = {...state.grid.secondary.y, ...grid.grid};
        }
        
        if(grid.x != null) state.grid.secondary.x = {...state.grid.secondary.x, ...grid.x}; 
        if(grid.y != null) state.grid.secondary.y = {...state.grid.secondary.y, ...grid.y};
        
        state.grid.secondary.x.opacity = clamp(state.grid.secondary.x.opacity, 0, 1);
        state.grid.secondary.y.opacity = clamp(state.grid.secondary.y.opacity, 0, 1);

    
        if(callback != null) callback(graphHandler, state.data.map(set=>set.dataset));
        state.dirty.client = true;
        
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