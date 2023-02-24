import { Graph2D_State } from "../../../../Graph2D/Graph2D_Types";
import { getLineDash, getGraphRect, isCallable } from "../../../../tools/Helplers/Helplers.js";
import { Mapping } from "../../../../tools/Mapping/Mapping_Types";
import { Line_Chart_Method_Generator, Line_Chart_State } from "../../LineChart_Types";
import { Draw_Line, Draw_Line_Helper_Props, Interpret_Line_Coords_Props } from "./Draw_Line_Types";

function DrawLine({dataHandler, dataState} : Line_Chart_Method_Generator) : Draw_Line{

//--------------- Draw Data -------------------

    function drawData(state : Graph2D_State){
        //Guard conditions
        if(dataState.useAxis.x === "secondary" && state.scale.secondary.x == null){
            console.error("Dataset uses secondary x axis, but it's not defined yet");
            return;
        }
        if(dataState.useAxis.y === "secondary" && state.scale.secondary.y == null){
            console.error("Dataset uses secondary y axis, but it's not defined yet");
            return;
        }

        const xScale = dataState.useAxis.x === "primary"? state.scale.primary.x : state.scale.secondary.x as Mapping;
        const yScale = dataState.useAxis.y === "primary"? state.scale.primary.y : state.scale.secondary.y as Mapping;
        const [xPositions, yPositions] = interpretCoordinates({dataState, dataHandler});
        const clipRect = getGraphRect(state); 

        //Common canvas configurations
        state.context.data.save();
        state.context.data.beginPath();
        state.context.data.rect(clipRect.x, clipRect.y, clipRect.width, clipRect.height);
        state.context.data.clip();
        state.context.data.translate(state.context.clientRect.x, state.context.clientRect.y);

        if(dataState.line.enable)
            drawLines({context:state.context.data, dataState, xPositions, yPositions, dataHandler, xScale, yScale});
        if(dataState.marker.enable)
            drawMarkers({context:state.context.data, dataState, xPositions, yPositions, dataHandler, xScale, yScale});

        state.context.data.restore();

    }

//---------------------------------------------

    return {
        drawData
    }

}

export default DrawLine;





//--------------- Draw Lines ------------------

function drawLines({xPositions, yPositions, context, dataState, xScale, yScale} : Draw_Line_Helper_Props){    
    context.strokeStyle = dataState.line.color;
    context.globalAlpha = dataState.line.opacity;
    context.lineWidth = dataState.line.width;
    context.setLineDash(getLineDash(dataState.line.style));
    context.beginPath();
    context.moveTo(xScale.map(xPositions[0]), yScale.map(yPositions[0]));
    xPositions.forEach((positionX,i)=>{
        if(i === 0) return;
        const x = xScale.map(positionX);
        const y = yScale.map(yPositions[i]);
        context.lineTo(x ,y);
    });
    context.stroke();
}

//---------------------------------------------
//------------- Draw Markers ------------------

function drawMarkers({xPositions, yPositions, context, dataState, dataHandler, xScale, yScale} : Draw_Line_Helper_Props){
    const marker = createMarker(dataState);

    context.strokeStyle = dataState.marker.color;
    context.fillStyle = dataState.marker.color;
    context.globalAlpha = dataState.marker.opacity;
    xPositions.forEach((positionX,i)=>{
        const positionY = yPositions[i];
        const x = xScale.map(positionX);
        const y = yScale.map(positionY);
        const scale = typeof dataState.marker.size === "number"? dataState.marker.size : (isCallable(dataState.marker.size)?dataState.marker.size(positionX,positionY,i,dataHandler) : dataState.marker.size[i]);

        context.save();

        context.translate(x,y);
        context.scale(scale, scale);
        context.lineWidth = 1/Math.abs(scale);
        dataState.marker.filled? context.fill(marker) : context.stroke(marker);
        
        context.restore();
    })
}

//---------------------------------------------
//--------- Interpret Coordinates -------------

function interpretCoordinates({ dataState, dataHandler } : Interpret_Line_Coords_Props) : [Array<number>, Array<number>]{
    let xPositions : Array<number> = [];
    let yPositions : Array<number> = [];
    const xData = isCallable(dataState.data.x)? dataState.data.x(dataHandler) : dataState.data.x;
    const yData = isCallable(dataState.data.y)? dataState.data.y(dataHandler) : dataState.data.y;

    //Some warning
    if(xData.length !== yData.length) console.error("Length of x and y data arrays are different, this may led to undefined behavior")

    if(dataState.polar){
        xData.forEach((x, i)=>{
            const y = yData[i];

            xPositions.push(x*Math.cos(y));
            yPositions.push(x*Math.sin(y));
        });
    }else{
        xPositions = xData;
        yPositions = yData;
    }

    return [xPositions, yPositions];
}

//---------------------------------------------
//------------- Create Marker ------------------

function createMarker(dataState : Line_Chart_State) : Path2D {
    const path = new Path2D();
    
    
    switch(dataState.marker.type){
        case "circle":{
            const size = 8;
            path.ellipse(0, 0, size/2, size/2, 0, 0, 2*Math.PI)
        }
        break;

        case "square":{
            const size = 8;
            path.moveTo(-size/2, size/2);
            path.lineTo(size/2, size/2);
            path.lineTo(size/2, -size/2);
            path.lineTo(-size/2, -size/2);
            path.closePath();
        }
        break;
            
        case "h-rect":{
            const size = 11;
            path.moveTo(-size/2, size/4);
            path.lineTo(size/2, size/4);
            path.lineTo(size/2, -size/4);
            path.lineTo(-size/2, -size/4);
            path.closePath();
        }
        break;
            
        case "v-rect":{
            const size = 11;
            path.moveTo(-size/4, size/2);
            path.lineTo(size/4, size/2);
            path.lineTo(size/4, -size/2);
            path.lineTo(-size/4, -size/2);
            path.closePath();
        }
        break;

        case "triangle":{
            const size = 11;
            path.moveTo(0, -size/2);
            path.lineTo(size/2*Math.cos(7/6*Math.PI), -size/2*Math.sin(7/6*Math.PI));
            path.lineTo(size/2*Math.cos(11/6*Math.PI), -size/2*Math.sin(11/6*Math.PI));
            path.closePath();
        }
        break;
            
        case "inv-triangle":{
            const size = 11;
            path.moveTo(0, size/2);
            path.lineTo(size/2*Math.cos(7/6*Math.PI), size/2*Math.sin(7/6*Math.PI));
            path.lineTo(size/2*Math.cos(11/6*Math.PI), size/2*Math.sin(11/6*Math.PI));
            path.closePath();
        }
        break;

        case "cross":{
            const size = 10;
            path.moveTo(-size/6, -size/2);
            path.lineTo(size/6, -size/2);
            path.lineTo(size/6, -size/6);
            path.lineTo(size/2, -size/6);
            path.lineTo(size/2, size/6);
            path.lineTo(size/6, size/6);
            path.lineTo(size/6, size/2);
            path.lineTo(-size/6, size/2);
            path.lineTo(-size/6, size/6);
            path.lineTo(-size/2, size/6);
            path.lineTo(-size/2, -size/6);
            path.lineTo(-size/6, -size/6);
            path.closePath();
        }
        break;

        case "star":{
            const size = 14;
            const angle = Math.PI/2;
            const angle0 = angle + 2*Math.PI/10;
            const r = size/2;
            const r0 = Math.hypot(r*0.22451398828979263, r*0.3090169943749474); //Some algebra
            path.moveTo(0, -r);
            for(let i=1; i<=5; i++){
                path.lineTo(r0*Math.cos(angle0+(i-1)*2*Math.PI/5), -r0*Math.sin(angle0+(i-1)*2*Math.PI/5));
                path.lineTo(r*Math.cos(angle+i*2*Math.PI/5), -r*Math.sin(angle+i*2*Math.PI/5));
            }
        }
        break;
    }

    return path;
}

//---------------------------------------------