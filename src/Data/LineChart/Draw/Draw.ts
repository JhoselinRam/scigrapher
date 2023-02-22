import { Graph2D_State } from "../../../Graph2D/Graph2D_Types";
import { getLineDash, getGraphRect } from "../../../tools/Helplers/Helplers.js";
import { Mapping } from "../../../tools/Mapping/Mapping_Types";
import { Line_Chart_Method_Generator, Line_Chart_State } from "../LineChart_Types";
import { Draw, Draw_Helper_Props, Interpret_Coords_Props } from "./Draw_Types";

function Draw({dataHandler, dataState} : Line_Chart_Method_Generator) : Draw{

//--------------- Draw Data -------------------

    function _drawData(state : Graph2D_State){
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
        const [xPositions, yPositions] = interpretCoordinates({xScale, yScale, dataState});
        const clipRect = getGraphRect(state); 

        //Common canvas configurations
        state.context.data.save();
        state.context.data.beginPath();
        state.context.data.rect(clipRect.x, clipRect.y, clipRect.width, clipRect.height);
        state.context.data.clip();
        state.context.data.translate(state.context.clientRect.x, state.context.clientRect.y);

        if(dataState.line.enable)
            drawLines({state, dataState, xPositions, yPositions});
        if(dataState.marker.enable)
            drawMarkers({state, dataState, xPositions, yPositions});

        state.context.data.restore();

    }

//---------------------------------------------

    return {
        _drawData
    }

}

export default Draw;





//--------------- Draw Lines ------------------

function drawLines({xPositions, yPositions, state, dataState} : Draw_Helper_Props){    
    state.context.data.strokeStyle = dataState.line.color;
    state.context.data.globalAlpha = dataState.line.opacity;
    state.context.data.lineWidth = dataState.line.width;
    state.context.data.setLineDash(getLineDash(dataState.line.style));
    state.context.data.beginPath();
    state.context.data.moveTo(xPositions[0], yPositions[0]);
    xPositions.forEach((x,i)=>{
        if(i === 0) return;
        const y = yPositions[i];
        state.context.data.lineTo(x ,y);
    });
    state.context.data.stroke();
}

//---------------------------------------------
//------------- Draw Markers ------------------

function drawMarkers({xPositions, yPositions, state, dataState} : Draw_Helper_Props){
    const marker = createMarker(dataState);
    state.context.data.strokeStyle = dataState.marker.color;
    state.context.data.fillStyle = dataState.marker.color;
    state.context.data.globalAlpha = dataState.marker.opacity;
    xPositions.forEach((x,i)=>{
        const y = yPositions[i];
        state.context.data.save();

        state.context.data.translate(x,y);
        dataState.marker.filled? state.context.data.fill(marker) : state.context.data.stroke(marker);
        
        state.context.data.restore();
    })
}

//---------------------------------------------
//--------- Interpret Coordinates -------------

function interpretCoordinates({xScale, yScale, dataState} : Interpret_Coords_Props) : [Array<number>, Array<number>]{
    let xPositions : Array<number> = [];
    let yPositions : Array<number> = [];
    const xData = isCallable(dataState.x)? dataState.x() : dataState.x;
    const yData = isCallable(dataState.y)? dataState.y() : dataState.y;

    //Some warning
    if(xData.length !== yData.length) console.error("Length of x and y data arrays are different, this may led to undefined behavior")

    if(dataState.polar){
        xData.forEach((x, i)=>{
            const y = yData[i];

            xPositions.push(xScale.map(x*Math.cos(y)));
            yPositions.push(yScale.map(x*Math.sin(y)));
        });
    }else{
        xPositions = xData.map(point => xScale.map(point));
        yPositions = yData.map(point => yScale.map(point));
    }

    return [xPositions, yPositions];
}

//---------------------------------------------
//-------------- Is Callable ------------------

function isCallable(candidate : unknown) :  candidate is Function{
    return typeof candidate === "function";
}

//---------------------------------------------
//------------- Create Marker ------------------

function createMarker(dataState : Line_Chart_State) : Path2D {
    const baseSize = 150;
    const path = new Path2D();


    switch(dataState.marker.type){
        case "circle":
            path.ellipse(0, 0, baseSize/2, baseSize/2, 0, 0, 2*Math.PI)
        break;

        case "square":
            path.moveTo(-baseSize/2, baseSize/2);
            path.lineTo(baseSize/2, baseSize/2);
            path.lineTo(baseSize/2, -baseSize/2);
            path.lineTo(-baseSize/2, -baseSize/2);
            path.closePath();
        break;
            
        case "h-rect":
            path.moveTo(-baseSize/2, baseSize/4);
            path.lineTo(baseSize/2, baseSize/4);
            path.lineTo(baseSize/2, -baseSize/4);
            path.lineTo(-baseSize/2, -baseSize/4);
            path.closePath();
        break;
            
        case "v-rect":
            path.moveTo(-baseSize/4, baseSize/2);
            path.lineTo(baseSize/4, baseSize/2);
            path.lineTo(baseSize/4, -baseSize/2);
            path.lineTo(-baseSize/4, -baseSize/2);
            path.closePath();
        break;

        case "triangle":
            path.moveTo(0, -baseSize/2);
            path.lineTo(baseSize/2*Math.cos(7/6*Math.PI), -baseSize/2*Math.sin(7/6*Math.PI));
            path.lineTo(baseSize/2*Math.cos(11/6*Math.PI), -baseSize/2*Math.sin(11/6*Math.PI));
            path.closePath();
        break;
            
        case "inv-triangle":
            path.moveTo(0, baseSize/2);
            path.lineTo(baseSize/2*Math.cos(7/6*Math.PI), baseSize/2*Math.sin(7/6*Math.PI));
            path.lineTo(baseSize/2*Math.cos(11/6*Math.PI), baseSize/2*Math.sin(11/6*Math.PI));
            path.closePath();
        break;

        case "cross":
            path.moveTo(-baseSize/6, -baseSize/2);
            path.lineTo(baseSize/6, -baseSize/2);
            path.lineTo(baseSize/6, -baseSize/6);
            path.lineTo(baseSize/2, -baseSize/6);
            path.lineTo(baseSize/2, baseSize/6);
            path.lineTo(baseSize/6, baseSize/6);
            path.lineTo(baseSize/6, baseSize/2);
            path.lineTo(-baseSize/6, baseSize/2);
            path.lineTo(-baseSize/6, baseSize/6);
            path.lineTo(-baseSize/2, baseSize/6);
            path.lineTo(-baseSize/2, -baseSize/6);
            path.lineTo(-baseSize/6, -baseSize/6);
            path.closePath();
        break;

        case "star":{
            const angle = Math.PI/2;
            const angle0 = angle + 2*Math.PI/10;
            const r = baseSize/2;
            const r0 = Math.hypot(r*0.049214217557598486, r*0.309016994374948); //Some algebra
            path.moveTo(0, -r);
            for(let i=1; i<=5; i++){
                //path.lineTo(r0*Math.cos(angle0+i*2*Math.PI/5), -r0*Math.sin(angle0+i*2*Math.PI/5));
                path.lineTo(r*Math.cos(angle+i*2*Math.PI/5), -r*Math.sin(angle+i*2*Math.PI/5));
            }
            path.moveTo(r0*Math.cos(angle0), -r0*Math.sin(angle0));
            for(let i=1; i<=5; i++){
                path.lineTo(r0*Math.cos(angle0+i*2*Math.PI/5), -r0*Math.sin(angle0+i*2*Math.PI/5));
                //path.lineTo(r*Math.cos(angle+i*2*Math.PI/5), -r*Math.sin(angle+i*2*Math.PI/5));
            }
        }
        break;
    }

    return path;
}

//---------------------------------------------