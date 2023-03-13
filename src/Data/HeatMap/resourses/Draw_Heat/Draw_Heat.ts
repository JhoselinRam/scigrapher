import { Graph2D_State } from "../../../../Graph2D/Graph2D_Types";
import { string2rgb } from "../../../../tools/Color_Map/Color_Interpolator.js";
import { getColorFunction, isCallable } from "../../../../tools/Helplers/Helplers.js";
import { Mapping } from "../../../../tools/Mapping/Mapping_Types";
import { Field_Property } from "../../../Data_Types";
import { Heat_Map_Method_Generator } from "../../Heat_Map_Types";
import { Draw_Heat, Draw_Heat_Helper } from "./Draw_Heat_Types";

function DrawHeat({dataHandler, dataState, graphHandler} : Heat_Map_Method_Generator) : Draw_Heat {

//------------------ Draw ---------------------

    function drawData(state : Graph2D_State) {
        if(!dataState.enable) return;
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
        const meshX = isCallable(dataState.mesh.x)? dataState.mesh.x(dataHandler, graphHandler) : dataState.mesh.x;
        const meshY = isCallable(dataState.mesh.y)? dataState.mesh.y(dataHandler, graphHandler) : dataState.mesh.y;



        let data : Field_Property<number> = [];
        if(isCallable(dataState.data)){
            for(let i=0; i<meshX.length; i++){
                data.push([]);
                for(let j=0; j<meshX[i].length; j++){
                    if(isCallable(dataState.data)) data[i].push(dataState.data(meshX[i][j], meshY[i][j], i, j, meshX, meshY, dataHandler, graphHandler));
                }
            }
        }else data = dataState.data; 



        const graphRect = graphHandler.graphRect(); 

        state.context.data.save();
        state.context.data.translate(graphRect.x, graphRect.y);
        state.context.data.beginPath();
        state.context.data.rect(0, 0, graphRect.width, graphRect.height);
        state.context.data.clip();

        if(dataState.smooth)
            drawSmooth({state, data, meshX, meshY, xScale, yScale, dataState, dataset:dataHandler, graph:graphHandler, clip:graphRect});
        else
            drawDefault({state, data, meshX, meshY, xScale, yScale, dataState, dataset:dataHandler, graph:graphHandler, clip:graphRect});

        state.context.data.restore();

    }

//---------------------------------------------

    return {
        drawData
    }
}

export default DrawHeat;










//-------------- Default Draw -----------------

function drawDefault({state, data, dataState, meshX, meshY, xScale, yScale, dataset, graph} : Draw_Heat_Helper){
    const context = state.context.data;
    const getColor = getColorFunction({data, dataState});

    if(typeof dataState.opacity === "number"){
        context.globalAlpha = dataState.opacity;    // <-- Difference

        //Center positions
        for(let i=1; i<meshX.length-1; i++){
            for(let j=1; j<meshX[i].length-1; j++){
                const x = Math.round(xScale.map(meshX[i][j] - (meshX[i][j] - meshX[i][j-1])/2))-1;
                const width = Math.round(Math.abs(x - xScale.map(meshX[i][j] + (meshX[i][j+1] - meshX[i][j])/2)))+1;
                const y = Math.round(yScale.map(meshY[i][j] - (meshY[i][j] - meshY[i-1][j])/2))-1;
                const height = Math.round(Math.abs(y - yScale.map(meshY[i][j] + (meshY[i+1][j] - meshY[i][j])/2)))+1;

                context.fillStyle = getColor(data[i][j], meshX[i][j], meshY[i][j], i, j, data, meshX, meshY, dataset, graph);
                context.beginPath();
                context.fillRect(x, y, width, height);
                context.fill();
                
            }
        }

        //Left and right strips 
        for(let i=0; i<meshX.length; i++){
            const final = meshX[i].length-1;
            let xLeft = Math.round(xScale.map(meshX[i][0]))-1;
            let xRight = Math.round(xScale.map(meshX[i][final-1] + (meshX[i][final] - meshX[i][final-1])/2))-1;
            let yLeft = 0;
            let yRight = 0;
            let widthLeft = Math.round(Math.abs(xLeft - xScale.map(meshX[i][0] + (meshX[i][1] - meshX[i][0])/2)))+1;
            let widthRight = Math.round(Math.abs(xRight - xScale.map(meshX[i][final])))+1;
            let heightLeft = 0;
            let heightRight = 0;

            if(i === 0){
                yLeft = Math.round(yScale.map(meshY[0][0]))-1;
                yRight = Math.round(yScale.map(meshY[0][final]))-1;
                heightLeft = Math.round(Math.abs(yLeft - yScale.map(meshY[1][0] - (meshY[1][0] - meshY[0][0])/2)))+1;
                heightRight = Math.round(Math.abs(yRight - yScale.map(meshY[1][final] - (meshY[1][final] - meshY[0][final])/2)))+1;
            }else if(i === meshX.length -1){
                yLeft = Math.round(yScale.map(meshY[i][0] - (meshY[i][0] - meshY[i-1][0])/2))-1;
                yRight = Math.round(yScale.map(meshY[i][final] - (meshY[i][final] - meshY[i-1][final])/2))-1;
                heightLeft = Math.round(Math.abs(yLeft - yScale.map(meshY[i][0])))+1;
                heightRight = Math.round(Math.abs(yRight - yScale.map(meshY[i][final])))+1;
            }else{
                yLeft = Math.round(yScale.map(meshY[i][0] - (meshY[i][0] - meshY[i-1][0])/2))-1;
                yRight = Math.round(yScale.map(meshY[i][final] - (meshY[i][final] - meshY[i-1][final])/2))-1;
                heightLeft = Math.round(Math.abs(yLeft - yScale.map(meshY[i][0] + (meshY[i+1][0] - meshY[i][0])/2)))+1;
                heightRight = Math.round(Math.abs(yLeft - yScale.map(meshY[i][final] + (meshY[i+1][final] - meshY[i][final])/2)))+1;
            }

            context.fillStyle = getColor(data[i][0], meshX[i][0], meshY[i][0], i, 0, data, meshX, meshY, dataset, graph);
            context.beginPath();
            context.fillRect(xLeft, yLeft, widthLeft, heightLeft);
            context.fill();
            
            context.fillStyle = getColor(data[i][final], meshX[i][final], meshY[i][final], i, final, data, meshX, meshY, dataset, graph);
            context.beginPath();
            context.fillRect(xRight, yRight, widthRight, heightRight);
            context.fill();
        }

        //Top and bottom strips
        for(let j=1; j<meshX[0].length-1; j++){
            const final = meshX.length-1;
            let xTop = Math.round(xScale.map(meshX[0][j] - (meshX[0][j] - meshX[0][j-1])/2))-1;
            let xBottom = Math.round(xScale.map(meshX[final][j] - (meshX[final][j] - meshX[final][j-1])/2))-1;
            let yTop = Math.round(yScale.map(meshY[0][j]))-1;
            let yBottom = Math.round(yScale.map(meshY[final][j] - (meshY[final][j] - meshY[final-1][j])/2))-1;
            let widthTop = Math.round(Math.abs(xTop - xScale.map(meshX[0][j+1] - (meshX[0][j+1] - meshX[0][j])/2)))+1;
            let widthBottom = Math.round(Math.abs(xBottom - xScale.map(meshX[final][j+1] - (meshX[final][j+1] - meshX[final][j])/2)))+1;
            let heightTop = Math.round(Math.abs(yTop - yScale.map(meshY[1][j] - (meshY[1][j] - meshY[0][j])/2)))+1;
            let heightBottom = Math.round(Math.abs(yBottom - yScale.map(meshY[final][j])))+1;

            context.fillStyle = getColor(data[0][j], meshX[0][j], meshY[0][j], 0, j, data, meshX, meshY, dataset, graph);
            context.beginPath();
            context.fillRect(xTop, yTop, widthTop, heightTop);
            context.fill();
            
            context.fillStyle = getColor(data[final][j], meshX[final][j], meshY[final][j], final, j, data, meshX, meshY, dataset, graph);
            context.beginPath();
            context.fillRect(xBottom, yBottom, widthBottom, heightBottom);
            context.fill();
        }

    }else{
        const opacity = dataState.opacity;

        //Center positions
        for(let i=1; i<meshX.length-1; i++){
            for(let j=1; j<meshX[i].length-1; j++){
                const x = Math.round(xScale.map(meshX[i][j] - (meshX[i][j] - meshX[i][j-1])/2))-1;
                const width = Math.round(Math.abs(x - xScale.map(meshX[i][j] + (meshX[i][j+1] - meshX[i][j])/2)))+1;
                const y = Math.round(yScale.map(meshY[i][j] - (meshY[i][j] - meshY[i-1][j])/2))-1;
                const height = Math.round(Math.abs(y - yScale.map(meshY[i][j] + (meshY[i+1][j] - meshY[i][j])/2)))+1;
                
                context.globalAlpha = isCallable(opacity) ? opacity(data[i][j], meshX[i][j], meshY[i][j], i, j, data, meshX, meshY, dataset, graph) : opacity[i][j]; //<-- Here
                context.fillStyle = getColor(data[i][j], meshX[i][j], meshY[i][j], i, j, data, meshX, meshY, dataset, graph);
                context.beginPath();
                context.fillRect(x, y, width, height);
                context.fill(); 
            }
        }

        //Left and right strips 
        for(let i=0; i<meshX.length; i++){
            const final = meshX[i].length-1;
            let xLeft = Math.round(xScale.map(meshX[i][0]))-1;
            let xRight = Math.round(xScale.map(meshX[i][final-1] + (meshX[i][final] - meshX[i][final-1])/2))-1;
            let yLeft = 0;
            let yRight = 0;
            let widthLeft = Math.round(Math.abs(xLeft - xScale.map(meshX[i][0] + (meshX[i][1] - meshX[i][0])/2)))+1;
            let widthRight = Math.round(Math.abs(xRight - xScale.map(meshX[i][final])))+1;
            let heightLeft = 0;
            let heightRight = 0;

            if(i === 0){
                yLeft = Math.round(yScale.map(meshY[0][0]))-1;
                yRight = Math.round(yScale.map(meshY[0][final]))-1;
                heightLeft = Math.round(Math.abs(yLeft - yScale.map(meshY[1][0] - (meshY[1][0] - meshY[0][0])/2)))+1;
                heightRight = Math.round(Math.abs(yRight - yScale.map(meshY[1][final] - (meshY[1][final] - meshY[0][final])/2)))+1;
            }else if(i === meshX.length -1){
                yLeft = Math.round(yScale.map(meshY[i][0] - (meshY[i][0] - meshY[i-1][0])/2))-1;
                yRight = Math.round(yScale.map(meshY[i][final] - (meshY[i][final] - meshY[i-1][final])/2))-1;
                heightLeft = Math.round(Math.abs(yLeft - yScale.map(meshY[i][0])))+1;
                heightRight = Math.round(Math.abs(yRight - yScale.map(meshY[i][final])))+1;
            }else{
                yLeft = Math.round(yScale.map(meshY[i][0] - (meshY[i][0] - meshY[i-1][0])/2))-1;
                yRight = Math.round(yScale.map(meshY[i][final] - (meshY[i][final] - meshY[i-1][final])/2))-1;
                heightLeft = Math.round(Math.abs(yLeft - yScale.map(meshY[i][0] + (meshY[i+1][0] - meshY[i][0])/2)))+1;
                heightRight = Math.round(Math.abs(yLeft - yScale.map(meshY[i][final] + (meshY[i+1][final] - meshY[i][final])/2)))+1;
            }

            context.globalAlpha = isCallable(opacity) ? opacity(data[i][0], meshX[i][0], meshY[i][0], i, 0, data, meshX, meshY, dataset, graph) : opacity[i][0];
            context.fillStyle = getColor(data[i][0], meshX[i][0], meshY[i][0], i, 0, data, meshX, meshY, dataset, graph);
            context.beginPath();
            context.fillRect(xLeft, yLeft, widthLeft, heightLeft);
            context.fill();
            
            context.globalAlpha = isCallable(opacity) ? opacity(data[i][final], meshX[i][final], meshY[i][final], i, final, data, meshX, meshY, dataset, graph) : opacity[i][final];
            context.fillStyle = getColor(data[i][final], meshX[i][final], meshY[i][final], i, final, data, meshX, meshY, dataset, graph);
            context.beginPath();
            context.fillRect(xRight, yRight, widthRight, heightRight);
            context.fill();
        }

        //Top and bottom strips
        for(let j=1; j<meshX[0].length-1; j++){
            const final = meshX.length-1;
            let xTop = Math.round(xScale.map(meshX[0][j] - (meshX[0][j] - meshX[0][j-1])/2))-1;
            let xBottom = Math.round(xScale.map(meshX[final][j] - (meshX[final][j] - meshX[final][j-1])/2))-1;
            let yTop = Math.round(yScale.map(meshY[0][j]))-1;
            let yBottom = Math.round(yScale.map(meshY[final][j] - (meshY[final][j] - meshY[final-1][j])/2))-1;
            let widthTop = Math.round(Math.abs(xTop - xScale.map(meshX[0][j+1] - (meshX[0][j+1] - meshX[0][j])/2)))+1;
            let widthBottom = Math.round(Math.abs(xBottom - xScale.map(meshX[final][j+1] - (meshX[final][j+1] - meshX[final][j])/2)))+1;
            let heightTop = Math.round(Math.abs(yTop - yScale.map(meshY[1][j] - (meshY[1][j] - meshY[0][j])/2)))+1;
            let heightBottom = Math.round(Math.abs(yBottom - yScale.map(meshY[final][j])))+1;

            context.globalAlpha = isCallable(opacity) ? opacity(data[0][j], meshX[0][j], meshY[0][j], 0, j, data, meshX, meshY, dataset, graph) : opacity[0][j];
            context.fillStyle = getColor(data[0][j], meshX[0][j], meshY[0][j], 0, j, data, meshX, meshY, dataset, graph);
            context.beginPath();
            context.fillRect(xTop, yTop, widthTop, heightTop);
            context.fill();
            
            context.globalAlpha = isCallable(opacity) ? opacity(data[final][j], meshX[final][j], meshY[final][j], final, j, data, meshX, meshY, dataset, graph) : opacity[final][j];
            context.fillStyle = getColor(data[final][j], meshX[final][j], meshY[final][j], final, j, data, meshX, meshY, dataset, graph);
            context.beginPath();
            context.fillRect(xBottom, yBottom, widthBottom, heightBottom);
            context.fill();
        }
    }
}

//-------------- Smooth Draw ------------------
//---------------------------------------------

function drawSmooth({state, data, dataState, meshX, meshY, xScale, yScale, dataset, graph, clip} : Draw_Heat_Helper){
    const context = state.context.data;
    const client = state.context.clientRect;
    const getColor = getColorFunction({data, dataState});
    const pixelData = context.getImageData(clip.x, clip.y, clip.width, clip.height);


    if(typeof dataState.opacity === "number"){
        context.globalAlpha = dataState.opacity;    // <-- Difference

        for(let i=0; i<meshX.length-1; i++){
            for(let j=0; j<meshX[i].length-1; j++){
                let xStart = Math.round(xScale.map(meshX[i][j])) 
                let xEnd = Math.round(xScale.map(meshX[i][j+1]))
                let yStart = Math.round(yScale.map(meshY[i][j]));
                let yEnd = Math.round(yScale.map(meshY[i+1][j]));
                [xStart, xEnd] = [Math.min(xStart, xEnd), Math.max(xStart, xEnd)];
                [yStart, yEnd] = [Math.min(yStart, yEnd), Math.max(yStart, yEnd)];

                const xDelta = xEnd - xStart;
                const yDelta = yEnd - yStart;
                const data00 = data[i][j];
                const data01 = data[i][j+1];
                const data10 = data[i+1][j];
                const data11 = data[i+1][j+1];
                const x0 = meshX[i][j];
                const x1 = meshX[i][j+1];
                const y0 = meshY[i][j];
                const y1 = meshY[i+1][j];


                
                for(let m=0; m<=xDelta; m++){
                    for(let n=0; n<=yDelta; n++){
                        const tx = 3*Math.pow(m/xDelta,2) - 2*Math.pow(m/xDelta,3) 
                        const ty = 3*Math.pow(n/yDelta,2) - 2*Math.pow(n/yDelta,3) 
                        //Bilinear interpolation
                        const dataStartX = data00 + (data01-data00)*tx;
                        const dataEndX = data10 + (data11-data10)*tx;
                        const dataInterpolated = dataStartX + (dataEndX - dataStartX)*ty;

                        const xInterpolated = x0 + (x1-x0)*tx; 
                        const yInterpolated = y0 + (y1-y0)*ty;

                        const color = getColor(dataInterpolated, xInterpolated, yInterpolated, i, j, data, meshX, meshY, dataset, graph);
                        drawPixel(pixelData, xStart+m, yStart+n, color, dataState.opacity);
                    }
                }
            }
        }
        context.putImageData(pixelData, clip.x, clip.y);
    }else{
        console.log("here")
        for(let i=0; i<meshX.length-1; i++){
            for(let j=0; j<meshX[i].length-1; j++){
                let xStart = Math.round(xScale.map(meshX[i][j])) 
                let xEnd = Math.round(xScale.map(meshX[i][j+1]))
                let yStart = Math.round(yScale.map(meshY[i][j]));
                let yEnd = Math.round(yScale.map(meshY[i+1][j]));
                [xStart, xEnd] = [Math.min(xStart, xEnd), Math.max(xStart, xEnd)];
                [yStart, yEnd] = [Math.min(yStart, yEnd), Math.max(yStart, yEnd)];

                const xDelta = xEnd - xStart;
                const yDelta = yEnd - yStart;
                const data00 = data[i][j];
                const data01 = data[i][j+1];
                const data10 = data[i+1][j];
                const data11 = data[i+1][j+1];
                const x0 = meshX[i][j];
                const x1 = meshX[i][j+1];
                const y0 = meshY[i][j];
                const y1 = meshY[i+1][j];


                
                for(let m=0; m<=xDelta; m++){
                    for(let n=0; n<=yDelta; n++){
                        const tx = 3*Math.pow(m/xDelta,2) - 2*Math.pow(m/xDelta,3) 
                        const ty = 3*Math.pow(n/yDelta,2) - 2*Math.pow(n/yDelta,3) 
                        //Bilinear interpolation
                        const dataStartX = data00 + (data01-data00)*tx;
                        const dataEndX = data10 + (data11-data10)*tx;
                        const dataInterpolated = dataStartX + (dataEndX - dataStartX)*ty;

                        const xInterpolated = x0 + (x1-x0)*tx; 
                        const yInterpolated = y0 + (y1-y0)*ty;

                        const color = getColor(dataInterpolated, xInterpolated, yInterpolated, i, j, data, meshX, meshY, dataset, graph);
                        
                        let opacity : number;
                        if(isCallable(dataState.opacity)){
                            opacity = dataState.opacity(dataInterpolated, xInterpolated, yInterpolated, i, j, data, meshX, meshY, dataset, graph);
                        }else{
                            const opacity00 = dataState.opacity[i][j];
                            const opacity01 = dataState.opacity[i][j+1];
                            const opacity10 = dataState.opacity[i+1][j];
                            const opacity11 = dataState.opacity[i+1][j+1];

                            const opacityStartX = opacity00  + (opacity01 - opacity00)*tx;
                            const opacityEndX = opacity10  + (opacity11 - opacity10)*tx;
                            
                            opacity = opacityStartX  + (opacityEndX - opacityStartX)*ty;
                        }

                        drawPixel(pixelData, xStart+m, yStart+n, color, opacity);
                    }
                }
            }
        }
        context.putImageData(pixelData, clip.x, clip.y);
    }
}

//---------------------------------------------
//------------- Draw Pixel --------------------

function drawPixel(image:ImageData, x:number, y:number, color:string, alpha:number){
    
    if(x<0 || x>image.width || y<0 || y>image.height)   return;
    
    const index = 4 * (image.width * y + x);
    const rgbData = string2rgb(color);

    image.data[index] = rgbData.r;
    image.data[index+1] = rgbData.g;
    image.data[index+2] = rgbData.b;
    image.data[index+3] = alpha*255;
}

//---------------------------------------------