import { Graph2D_State } from "../../../../Graph2D/Graph2D_Types";
import { getLineDash, isCallable } from "../../../../tools/Helplers/Helplers.js";
import { Mapping } from "../../../../tools/Mapping/Mapping_Types";
import { Line_Chart_Method_Generator } from "../../LineChart_Types";
import { Create_Error_Props, Create_Marker_Props, Draw_Area_Props, Draw_Line, Draw_Line_Helper_Props, Extract_Property_Props } from "./Draw_Line_Types";

function DrawLine({dataHandler, dataState, graphHandler} : Line_Chart_Method_Generator) : Draw_Line{

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
        const xPositions = isCallable(dataState.data.x)? dataState.data.x(dataHandler, graphHandler) : dataState.data.x.slice();
        const yPositions = isCallable(dataState.data.y)? dataState.data.y(dataHandler, graphHandler) : dataState.data.y.slice();
        const clipRect = graphHandler.graphRect(); 

        //Common canvas configurations
        state.context.data.save();
        state.context.data.beginPath();
        state.context.data.rect(clipRect.x, clipRect.y, clipRect.width, clipRect.height);
        state.context.data.clip();
        state.context.data.translate(state.context.clientRect.x, state.context.clientRect.y);

        if(dataState.area.enable){
            const xAreaPositions = isCallable(dataState.area.base.x)? dataState.area.base.x(dataHandler, graphHandler) : dataState.area.base.x.slice();
            const yAreaPositions = isCallable(dataState.area.base.y)? dataState.area.base.y(dataHandler, graphHandler) : dataState.area.base.y.slice();
            xAreaPositions.reverse();
            yAreaPositions.reverse();
            drawArea({context:state.context.data, dataHandler, dataState, xAreaPositions, xPositions, xScale, yAreaPositions, yPositions, yScale, graphHandler});
        }
        if(dataState.line.enable)
            drawLines({context:state.context.data, dataState, xPositions, yPositions, dataHandler, xScale, yScale, graphHandler});
        if(dataState.marker.enable)
            drawMarkers({context:state.context.data, dataState, xPositions, yPositions, dataHandler, xScale, yScale, graphHandler});
        if(dataState.errorBar.x.enable || dataState.errorBar.y.enable)
            drawErrorBars({context:state.context.data, dataState, xPositions, yPositions, dataHandler, xScale, yScale, graphHandler});


        state.context.data.restore();

    }

//---------------------------------------------

    return {
        drawData
    }

}

export default DrawLine;





//--------------- Draw Lines ------------------

function drawLines({xPositions, yPositions, context, dataState, xScale, yScale, dataHandler, graphHandler} : Draw_Line_Helper_Props){    
    
    //The simple and more efficient way
    if(typeof dataState.line.color === "string" &&
        typeof dataState.line.opacity === "number" &&
        typeof dataState.line.width === "number"  &&
        typeof dataState.line.style === "string"){

            let xStart = xPositions[0];
            let yStart = yPositions[0];
            if(dataState.polar){
                xStart = xPositions[0] * Math.cos(yPositions[0]);
                yStart = xPositions[0] * Math.sin(yPositions[0]);
            }
            context.strokeStyle = dataState.line.color;
            context.globalAlpha = dataState.line.opacity;
            context.lineWidth = dataState.line.width;
            context.setLineDash(getLineDash(dataState.line.style));
            context.beginPath();
            context.moveTo(xScale.map(xStart), yScale.map(yStart));
            xPositions.forEach((positionX,i)=>{
                if(i === 0) return;
                let x = xScale.map(positionX);
                let y = yScale.map(yPositions[i]);
                
                if(dataState.polar){
                    x = xScale.map(positionX*Math.cos(yPositions[i]));
                    y = yScale.map(positionX*Math.sin(yPositions[i]));
                }
                
                context.lineTo(x ,y);
            });
            context.stroke();
    } else{ //A little more complex but necessary if some of the properties are dynamic
        xPositions.forEach((positionX, i)=>{
            if(i === 0) return;
            context.strokeStyle = extractProperty({xPositions, yPositions, graphHandler, property:dataState.line.color, x:positionX, y:yPositions[i], index:i, handler:dataHandler});
            context.globalAlpha = extractProperty({xPositions, yPositions, graphHandler, property:dataState.line.opacity, x:positionX, y:yPositions[i], index:i, handler:dataHandler});
            context.lineWidth = extractProperty({xPositions, yPositions, graphHandler, property:dataState.line.width, x:positionX, y:yPositions[i], index:i, handler:dataHandler});
            context.setLineDash(getLineDash(extractProperty({xPositions, yPositions, graphHandler, property:dataState.line.style, x:positionX, y:yPositions[i], index:i, handler:dataHandler})));
            
            let xCoord0 = xPositions[i-1];
            let yCoord0 = yPositions[i-1];
            let xCoord1 = positionX;
            let yCoord1 = yPositions[i];

            if(dataState.polar){
                xCoord0 = xPositions[i-1] * Math.cos(yPositions[i-1]);
                yCoord0 = xPositions[i-1] * Math.sin(yPositions[i-1]);
                xCoord1 = positionX * Math.cos(yPositions[i]);
                yCoord1 = xPositions[i] * Math.sin(yPositions[i]);
            }


            const x0 = xScale.map(xCoord0);
            const y0 = yScale.map(yCoord0);
            const x1 = xScale.map(xCoord1);
            const y1 = yScale.map(yCoord1);

            context.beginPath();
            context.moveTo(x0, y0);
            context.lineTo(x1, y1);
            context.stroke();
        })
    }
    
}

//---------------------------------------------
//------------- Draw Markers ------------------

function drawMarkers({xPositions, yPositions, context, dataState, dataHandler, xScale, yScale, graphHandler} : Draw_Line_Helper_Props){

    if(typeof dataState.marker.color === "string" &&
       typeof dataState.marker.opacity === "number" &&
       typeof dataState.marker.style === "string" &&
       typeof dataState.marker.width === "number" &&
       typeof dataState.marker.size === "number" &&
       typeof dataState.marker.type === "string" &&
       typeof dataState.marker.filled === "boolean"){
           
        const marker = createMarker({size:dataState.marker.size, type:dataState.marker.type});
        const offset = dataState.marker.width%2*0.5;
        const filled = dataState.marker.filled;
           
        context.strokeStyle = dataState.marker.color;
        context.fillStyle = dataState.marker.color;
        context.globalAlpha = dataState.marker.opacity;
        context.lineWidth  = dataState.marker.width;
        context.setLineDash(getLineDash(dataState.marker.style));
        xPositions.forEach((positionX,i)=>{
            const positionY = yPositions[i];
            
            let x = Math.round(xScale.map(positionX)) + offset;
            let y = Math.round(yScale.map(positionY)) + offset;

            if(dataState.polar){
                x = Math.round(xScale.map(positionX * Math.cos(positionY))) + offset;
                y = Math.round(yScale.map(positionX * Math.sin(positionY))) + offset;
            }
            
            context.save();
            context.translate(x,y);
            filled ? context.fill(marker) : context.stroke(marker);
            context.restore();
        });
    } else{
        xPositions.forEach((positionX, i)=>{
            const positionY = yPositions[i];
            const size = extractProperty({xPositions, yPositions, graphHandler, property:dataState.marker.size, x:positionX, y:positionY, index:i, handler:dataHandler});
            const color = extractProperty({xPositions, yPositions, graphHandler, property:dataState.marker.color, x:positionX, y:positionY, index:i, handler:dataHandler});
            const type = extractProperty({xPositions, yPositions, graphHandler, property:dataState.marker.type, x:positionX, y:positionY, index:i, handler:dataHandler});
            const width = extractProperty({xPositions, yPositions, graphHandler, property:dataState.marker.width, x:positionX, y:positionY, index:i, handler:dataHandler});
            const filled = extractProperty({xPositions, yPositions, graphHandler, property:dataState.marker.filled, x:positionX, y:positionY, index:i, handler:dataHandler});
            const marker = createMarker({type, size});
            
            let x = Math.round(xScale.map(positionX)) + width%2 * 0.5;
            let y = Math.round(yScale.map(positionY)) + width%2 * 0.5;

            if(dataState.polar){
                x = Math.round(xScale.map(positionX * Math.cos(positionY))) + width%2 * 0.5;
                y = Math.round(yScale.map(positionX * Math.sin(positionY))) + width%2 * 0.5;
            }

            context.strokeStyle = color;
            context.fillStyle = color;
            context.globalAlpha = extractProperty({xPositions, yPositions, graphHandler, property:dataState.marker.opacity, x:positionX, y:positionY, index:i, handler:dataHandler});
            context.lineWidth = width;
            context.setLineDash(getLineDash(extractProperty({xPositions, yPositions, graphHandler, property:dataState.marker.style, x:positionX, y:positionY, index:i, handler:dataHandler})));

            context.save();
            context.translate(x,y);
            filled ? context.fill(marker) : context.stroke(marker);
            context.restore();
        });
    }
    
}

//---------------------------------------------
//---------------------------------------------

    function drawErrorBars({context, graphHandler, dataHandler, dataState, xPositions, xScale, yPositions, yScale} : Draw_Line_Helper_Props){
        xPositions.forEach((positionX , i)=>{
            const positionY = yPositions[i];
            let xError = 0;
            let yError = 0;

            let x = positionX;
            let y = positionY;

            if(dataState.polar){
                x = positionX * Math.cos(positionY);
                y = positionX * Math.sin(positionY);
            }
            
            //Check for error bar enable
            if(dataState.errorBar.x.enable)
                xError = typeof dataState.errorBar.x.data === "number"? dataState.errorBar.x.data : (isCallable(dataState.errorBar.x.data)? dataState.errorBar.x.data(positionX, positionY, i,xPositions, yPositions, dataHandler, graphHandler) : dataState.errorBar.x.data[i]);
            if(dataState.errorBar.y.enable)
                yError = typeof dataState.errorBar.y.data === "number"? dataState.errorBar.y.data : (isCallable(dataState.errorBar.y.data)? dataState.errorBar.y.data(positionX, positionY, i, xPositions, yPositions, dataHandler, graphHandler) : dataState.errorBar.y.data[i]);
            

            //Draw part x of error bar
            if(dataState.errorBar.x.enable){
                //Most common configuration, more efficient daw
                if(typeof dataState.errorBar.type === "string" &&
                    typeof dataState.errorBar.x.color === "string" &&
                    typeof dataState.errorBar.x.opacity === "number" &&
                    typeof dataState.errorBar.x.style === "string" &&
                    typeof dataState.errorBar.x.width === "number" && 
                    typeof dataState.errorBar.y.width === "number"){

                        const xPath = createErrorBar({position:{x, y}, error:{x:xError, y:yError}, scale:{x:xScale, y:yScale}, width:{x:dataState.errorBar.x.width, y :dataState.errorBar.y.width}, type:dataState.errorBar.type, axis:"x"});
         
                         context.save();
                         context.strokeStyle = dataState.errorBar.x.color;
                         context.globalAlpha = dataState.errorBar.x.opacity;
                         context.lineWidth = dataState.errorBar.x.width;
                         context.setLineDash(getLineDash(dataState.errorBar.x.style));
                         context.stroke(xPath);
                         context.restore();
                
                //For dynamic properties, little less efficient draw mechanism
                }else{
                    const xWidth = extractProperty({xPositions, yPositions, graphHandler, property:dataState.errorBar.x.width, x:positionX, y:positionY, index:i, handler:dataHandler});
                    const yWidth = extractProperty({xPositions, yPositions, graphHandler, property:dataState.errorBar.y.width, x:positionX, y:positionY, index:i, handler:dataHandler});
                    const type = extractProperty({xPositions, yPositions, graphHandler, property:dataState.errorBar.type, x:positionX, y:positionY, index:i, handler:dataHandler});
                    const xPath = createErrorBar({position:{x, y}, error:{x:xError, y:yError}, scale:{x:xScale, y:yScale}, width:{x:xWidth, y :yWidth}, type, axis:"x"});

                    context.save();
                    context.strokeStyle = extractProperty({xPositions, yPositions, graphHandler, property:dataState.errorBar.x.color, x:positionX, y:positionY, index:i, handler:dataHandler});
                    context.globalAlpha = extractProperty({xPositions, yPositions, graphHandler, property:dataState.errorBar.x.opacity, x:positionX, y:positionY, index:i, handler:dataHandler});
                    context.lineWidth = xWidth;
                    context.setLineDash(getLineDash(extractProperty({xPositions, yPositions, graphHandler, property:dataState.errorBar.x.style, x:positionX, y:positionY, index:i, handler:dataHandler})));
                    context.stroke(xPath);
                    context.restore();
                }
            }
            
            
            //Draw part y of error bar
            if(dataState.errorBar.y.enable){
                //Most common configuration, more efficient daw
                if(typeof dataState.errorBar.type === "string" &&
                    typeof dataState.errorBar.y.color === "string" &&
                    typeof dataState.errorBar.y.opacity === "number" &&
                    typeof dataState.errorBar.y.style === "string" &&
                    typeof dataState.errorBar.y.width === "number" && 
                    typeof dataState.errorBar.x.width === "number"){

                        const yPath = createErrorBar({position:{x, y}, error:{x:xError, y:yError}, scale:{x:xScale, y:yScale}, width:{x:dataState.errorBar.x.width, y :dataState.errorBar.y.width}, type:dataState.errorBar.type, axis:"y"});
         
                         context.save();
                         context.strokeStyle = dataState.errorBar.y.color;
                         context.globalAlpha = dataState.errorBar.y.opacity;
                         context.lineWidth = dataState.errorBar.y.width;
                         context.setLineDash(getLineDash(dataState.errorBar.y.style));
                         context.stroke(yPath);
                         context.restore();
                
                //For dynamic properties, little less efficient draw mechanism
                }else{
                    const xWidth = extractProperty({xPositions, yPositions, graphHandler, property:dataState.errorBar.x.width, x:positionX, y:positionY, index:i, handler:dataHandler});
                    const yWidth = extractProperty({xPositions, yPositions, graphHandler, property:dataState.errorBar.y.width, x:positionX, y:positionY, index:i, handler:dataHandler});
                    const type = extractProperty({xPositions, yPositions, graphHandler, property:dataState.errorBar.type, x:positionX, y:positionY, index:i, handler:dataHandler});
                    const yPath = createErrorBar({position:{x, y}, error:{x:xError, y:yError}, scale:{x:xScale, y:yScale}, width:{x:xWidth, y :yWidth}, type, axis:"y"});

                    context.save();
                    context.strokeStyle = extractProperty({xPositions, yPositions, graphHandler, property:dataState.errorBar.y.color, x:positionX, y:positionY, index:i, handler:dataHandler});
                    context.globalAlpha = extractProperty({xPositions, yPositions, graphHandler, property:dataState.errorBar.y.opacity, x:positionX, y:positionY, index:i, handler:dataHandler});
                    context.lineWidth = yWidth;
                    context.setLineDash(getLineDash(extractProperty({xPositions, yPositions, graphHandler, property:dataState.errorBar.y.style, x:positionX, y:positionY, index:i, handler:dataHandler})));
                    context.stroke(yPath);
                    context.restore();
                }
            }
        });
    }

//---------------------------------------------
//--------------- Draw Area -------------------

    function drawArea({context, dataState, xAreaPositions, xPositions, xScale, yAreaPositions, yPositions, yScale} : Draw_Area_Props){
        context.fillStyle = dataState.area.color;
        context.globalAlpha = dataState.area.opacity;
        context.beginPath();
        context.moveTo(Math.round(xScale.map(xPositions[0])), Math.round(yScale.map(yPositions[0])));
        xPositions.forEach((positionX, i) =>{
            if(i === 0) return;
            let x = Math.round(xScale.map(positionX));
            let y = Math.round(yScale.map(yPositions[i]));

            if(dataState.polar){
                x = Math.round(xScale.map(positionX * Math.cos(yPositions[i])));
                y = Math.round(yScale.map(positionX * Math.sin(yPositions[i])));
            }
            
            context.lineTo(x ,y);
        });
        xAreaPositions.forEach((positionX, i)=>{
            let x = Math.round(xScale.map(positionX));
            let y = Math.round(yScale.map(yAreaPositions[i]));

            if(dataState.polar){
                x = Math.round(xScale.map(positionX * Math.cos(yAreaPositions[i])));
                y = Math.round(yScale.map(positionX * Math.sin(yAreaPositions[i])));
            }


            context.lineTo(x, y);
        })
        context.closePath();
        context.fill();
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
//------------- Extract Property --------------

function extractProperty<T>({ x, y, index, handler, property, graphHandler, xPositions, yPositions} : Extract_Property_Props<T>) : T {
    let value : T;
    
    if(isCallable(property)){
        value = property(x, y, index,xPositions, yPositions, handler, graphHandler);
    } else if(typeof property !== "object"){
        value  = property
    } else{
        value = (property as Array<T>)[index];
    }

    return value;
}

//---------------------------------------------