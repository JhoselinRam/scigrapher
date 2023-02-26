import { Graph2D_State } from "../../../../Graph2D/Graph2D_Types";
import { getLineDash, getGraphRect, isCallable } from "../../../../tools/Helplers/Helplers.js";
import { Mapping } from "../../../../tools/Mapping/Mapping_Types";
import { Line_Chart_Method_Generator } from "../../LineChart_Types";
import { Create_Error_Props, Create_Marker_Props, Draw_Line, Draw_Line_Helper_Props, Interpret_Line_Coords_Props } from "./Draw_Line_Types";

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
        if(dataState.errorBar.x.enable || dataState.errorBar.y.enable)
            drawErrorBars({context:state.context.data, dataState, xPositions, yPositions, dataHandler, xScale, yScale});


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

    context.strokeStyle = dataState.marker.color;
    context.fillStyle = dataState.marker.color;
    context.globalAlpha = dataState.marker.opacity;
    context.setLineDash(getLineDash(dataState.marker.style));
    xPositions.forEach((positionX,i)=>{
        const positionY = yPositions[i];
        const x = Math.round(xScale.map(positionX)) + dataState.marker.width%2 * 0.5;
        const y = Math.round(yScale.map(positionY)) + dataState.marker.width%2 * 0.5;
        const size = typeof dataState.marker.size === "number"? dataState.marker.size : (isCallable(dataState.marker.size)?dataState.marker.size(positionX,positionY,i,dataHandler) : dataState.marker.size[i]);
        const marker = createMarker({size, type:dataState.marker.type});
        
        context.save();

        context.translate(x,y);
        context.lineWidth = dataState.marker.width;
        dataState.marker.filled? context.fill(marker) : context.stroke(marker);
        
        context.restore();
    });
}

//---------------------------------------------
//---------------------------------------------

    function drawErrorBars({context, dataHandler, dataState, xPositions, xScale, yPositions, yScale} : Draw_Line_Helper_Props){
        xPositions.forEach((positionX , i)=>{
            const positionY = yPositions[i];
            let xError = 0;
            let yError = 0;
            
            if(dataState.errorBar.x.enable)
                xError = typeof dataState.errorBar.x.data === "number"? dataState.errorBar.x.data : (isCallable(dataState.errorBar.x.data)? dataState.errorBar.x.data(positionX, positionY, i, dataHandler) : dataState.errorBar.x.data[i]);
            if(dataState.errorBar.y.enable)
                yError = typeof dataState.errorBar.y.data === "number"? dataState.errorBar.y.data : (isCallable(dataState.errorBar.y.data)? dataState.errorBar.y.data(positionX, positionY, i, dataHandler) : dataState.errorBar.y.data[i]);
            

            if(dataState.errorBar.x.enable){
               const xPath = createErrorBar({position:{x:positionX,y:positionY}, error:{x:xError, y:yError}, scale:{x:xScale, y:yScale}, width:{x:dataState.errorBar.x.width, y :dataState.errorBar.y.width}, type:dataState.errorBar.type, axis:"x"});

                context.save();
                context.strokeStyle = dataState.errorBar.x.color;
                context.globalAlpha = dataState.errorBar.x.opacity;
                context.lineWidth = dataState.errorBar.x.width;
                context.setLineDash(getLineDash(dataState.errorBar.x.style));
                context.stroke(xPath);
                context.restore();
            }
            
            if(dataState.errorBar.y.enable){
               const yPath = createErrorBar({position:{x:positionX,y:positionY}, error:{x:xError, y:yError}, scale:{x:xScale, y:yScale}, width:{x:dataState.errorBar.x.width, y :dataState.errorBar.y.width}, type:dataState.errorBar.type, axis:"y"});

                context.save();
                context.strokeStyle = dataState.errorBar.y.color;
                context.globalAlpha = dataState.errorBar.y.opacity;
                context.lineWidth = dataState.errorBar.y.width;
                context.setLineDash(getLineDash(dataState.errorBar.y.style));
                context.stroke(yPath);
                context.restore();
            }
        });
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

function createMarker({type, size} : Create_Marker_Props) : Path2D {
    const path = new Path2D();
    
    
    switch(type){
        case "circle":{
            let absoluteSize = Math.round(8 * size);
            absoluteSize += absoluteSize%2; 
            path.ellipse(0, 0, absoluteSize/2, absoluteSize/2, 0, 0, 2*Math.PI)
        }
        break;

        case "square":{
            let absoluteSize = 8 * size;
            absoluteSize += absoluteSize%2;
            path.moveTo(-absoluteSize/2, absoluteSize/2);
            path.lineTo(absoluteSize/2, absoluteSize/2);
            path.lineTo(absoluteSize/2, -absoluteSize/2);
            path.lineTo(-absoluteSize/2, -absoluteSize/2);
            path.closePath();
        }
        break;
            
        case "h-rect":{
            const absoluteSize = 11 * size;
            const minor = Math.round(absoluteSize/4);
            const mayor = Math.round(absoluteSize/2);
            path.moveTo(-mayor, minor);
            path.lineTo(mayor, minor);
            path.lineTo(mayor, -minor);
            path.lineTo(-mayor, -minor);
            path.closePath();
        }
        break;
            
        case "v-rect":{
            const absoluteSize = 11 * size;
            const minor = Math.round(absoluteSize/4);
            const mayor = Math.round(absoluteSize/2);
            path.moveTo(-minor, mayor);
            path.lineTo(minor, mayor);
            path.lineTo(minor, -mayor);
            path.lineTo(-minor, -mayor);
            path.closePath();
        }
        break;

        case "triangle":{
            const absoluteSize = 11 * size;
            path.moveTo(0, Math.round(-absoluteSize/2));
            path.lineTo(Math.round(absoluteSize/2*Math.cos(7/6*Math.PI)), -Math.round(absoluteSize/2*Math.sin(7/6*Math.PI)));
            path.lineTo(Math.round(absoluteSize/2*Math.cos(11/6*Math.PI)), -Math.round(absoluteSize/2*Math.sin(11/6*Math.PI)));
            path.closePath();
        }
        break;
            
        case "inv-triangle":{
            const absoluteSize = 11 * size;
            path.moveTo(0, Math.round(absoluteSize/2));
            path.lineTo(Math.round(absoluteSize/2*Math.cos(7/6*Math.PI)), Math.round(absoluteSize/2*Math.sin(7/6*Math.PI)));
            path.lineTo(Math.round(absoluteSize/2*Math.cos(11/6*Math.PI)), Math.round(absoluteSize/2*Math.sin(11/6*Math.PI)));
            path.closePath();
        }
        break;

        case "cross":{
            const absoluteSize = 10 * size;
            const minor = Math.round(absoluteSize/6);
            const mayor = Math.round(absoluteSize/2);
            path.moveTo(-minor, -mayor);
            path.lineTo(minor, -mayor);
            path.lineTo(minor, -minor);
            path.lineTo(mayor, -minor);
            path.lineTo(mayor, minor);
            path.lineTo(minor, minor);
            path.lineTo(minor, mayor);
            path.lineTo(-minor, mayor);
            path.lineTo(-minor, minor);
            path.lineTo(-mayor, minor);
            path.lineTo(-mayor, -minor);
            path.lineTo(-minor, -minor);
            path.closePath();
        }
        break;

        case "star":{
            const absoluteSize = 14 * size;
            const angle = Math.PI/2;
            const angle0 = angle + 2*Math.PI/10;
            const r = Math.round(absoluteSize/2);
            const r0 = Math.hypot(r*0.22451398828979263, r*0.3090169943749474); //Some algebra
            path.moveTo(0, -r);
            for(let i=1; i<=5; i++){
                path.lineTo(Math.round(r0*Math.cos(angle0+(i-1)*2*Math.PI/5)), Math.round(-r0*Math.sin(angle0+(i-1)*2*Math.PI/5)));
                path.lineTo(Math.round(r*Math.cos(angle+i*2*Math.PI/5)), Math.round(-r*Math.sin(angle+i*2*Math.PI/5)));
            }
        }
        break;
    }

    return path;
}

//---------------------------------------------
//---------------------------------------------

function createErrorBar({ position, error, scale, type, axis, width } : Create_Error_Props) : Path2D{
    const path = new Path2D;

    switch(type){
        case "rectangle":
            if(axis === "x"){
                const start = Math.round(scale.x.map(position.x - error.x)) + width.y%2 * 0.5;
                const end = Math.round(scale.x.map(position.x + error.x)) + width.y%2 * 0.5;
                const compStart = Math.round(scale.y.map(position.y - error.y)) + width.x%2 * 0.5;
                const compEnd = Math.round(scale.y.map(position.y + error.y)) + width.x%2 * 0.5;
                
                path.moveTo(start, compStart);
                path.lineTo(end, compStart);
                path.moveTo(start, compEnd);
                path.lineTo(end, compEnd);
            }
            if(axis === "y"){
                const start = Math.round(scale.y.map(position.y - error.y)) + width.x%2 * 0.5;
                const end = Math.round(scale.y.map(position.y + error.y)) + width.x%2 * 0.5;
                const compStart = Math.round(scale.x.map(position.x - error.x)) + width.y%2 * 0.5;
                const compEnd = Math.round(scale.x.map(position.x + error.x)) + width.y%2 * 0.5;
                
                path.moveTo(compStart, start);
                path.lineTo(compStart, end);
                path.moveTo(compEnd, start);
                path.lineTo(compEnd, end);
            }
            break;

        case "corner":{
            const size = 4;
            if(axis === "x"){
                const start = Math.round(scale.x.map(position.x - error.x)) + width.y%2 * 0.5;
                const end = Math.round(scale.x.map(position.x + error.x)) + width.y%2 * 0.5;
                const compStart = Math.round(scale.y.map(position.y - error.y)) + width.x%2 * 0.5;
                const compEnd = Math.round(scale.y.map(position.y + error.y)) + width.x%2 * 0.5;

                path.moveTo(start, compStart);
                path.lineTo(start+size, compStart);
                path.moveTo(end-size, compStart);
                path.lineTo(end, compStart);
                path.moveTo(start, compEnd);
                path.lineTo(start+size, compEnd);
                path.moveTo(end-size, compEnd);
                path.lineTo(end, compEnd);
            }
            if(axis === "y"){
                const start = Math.round(scale.y.map(position.y - error.y)) + width.x%2 * 0.5;
                const end = Math.round(scale.y.map(position.y + error.y)) + width.x%2 * 0.5;
                const compStart = Math.round(scale.x.map(position.x - error.x)) + width.y%2 * 0.5;
                const compEnd = Math.round(scale.x.map(position.x + error.x)) + width.y%2 * 0.5;

                path.moveTo(compStart, end);
                path.lineTo(compStart, end+size);
                path.moveTo(compStart, start-size);
                path.lineTo(compStart, start);
                path.moveTo(compEnd, end);
                path.lineTo(compEnd, end+size);
                path.moveTo(compEnd, start-size);
                path.lineTo(compEnd, start);
            }
        }
            break;

        case "cross":
            if(axis === "x"){
                const start = Math.round(scale.x.map(position.x-error.x)) + width.x%2 * 0.5;
                const end = Math.round(scale.x.map(position.x+error.x)) + width.x%2 * 0.5;
                const comp = Math.round(scale.y.map(position.y)) + width.x%2 * 0.5;

                path.moveTo(start, comp);
                path.lineTo(end, comp);
            }
            if(axis === "y"){
                const start = Math.round(scale.y.map(position.y-error.y)) + width.y%2 * 0.5;
                const end = Math.round(scale.y.map(position.y+error.y)) + width.y%2 * 0.5;
                const comp = Math.round(scale.x.map(position.x)) + width.y%2 * 0.5;

                path.moveTo(comp, start);
                path.lineTo(comp, end);
            }
            break;

        case "tail-cross":{
            const tail = 3;
            if(axis === "x"){
                const start = Math.round(scale.x.map(position.x-error.x)) + width.x%2 * 0.5;
                const end = Math.round(scale.x.map(position.x+error.x)) + width.x%2 * 0.5;
                const comp = Math.round(scale.y.map(position.y)) + width.x%2 * 0.5;

                path.moveTo(start, comp);
                path.lineTo(end, comp);
                path.moveTo(start, comp+tail);
                path.lineTo(start, comp-tail);
                path.moveTo(end, comp+tail);
                path.lineTo(end, comp-tail);
            }
            if(axis === "y"){
                const start = Math.round(scale.y.map(position.y-error.y)) + width.y%2 * 0.5;
                const end = Math.round(scale.y.map(position.y+error.y)) + width.y%2 * 0.5;
                const comp = Math.round(scale.x.map(position.x)) + width.y%2 * 0.5;

                path.moveTo(comp, start);
                path.lineTo(comp, end);
                path.moveTo(comp+tail, start);
                path.lineTo(comp-tail, start);
                path.moveTo(comp+tail, end);
                path.lineTo(comp-tail, end);
            }
        }
            break;
    }

    return path;
}

//---------------------------------------------