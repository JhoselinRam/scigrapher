import { Graph2D_State } from "../../../../Graph2D/Graph2D_Types";
import { string2rgb } from "../../../../tools/Color_Map/Color_Interpolator.js";
import colorMap from "../../../../tools/Color_Map/Predefined/Color_Map.js";
import { getGraphRect, isCallable } from "../../../../tools/Helplers/Helplers.js";
import { Mapping } from "../../../../tools/Mapping/Mapping_Types";
import { Field_Property } from "../../../Data_Types";
import { Heat_Map_Method_Generator, Heat_Property_Generator } from "../../Heat_Map_Types";
import { Draw_Heat, Draw_Heat_Helper, Get_Color_Function } from "./Draw_Heat_Types";

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



        const clipRect = getGraphRect(state); 

        state.context.data.save();
        state.context.data.beginPath();
        state.context.data.rect(clipRect.x, clipRect.y, clipRect.width, clipRect.height);
        state.context.data.clip();
        state.context.data.translate(state.context.clientRect.x, state.context.clientRect.y);

        if(dataState.smooth)
            drawSmooth({state, data, meshX, meshY, xScale, yScale, dataState, dataset:dataHandler, graph:graphHandler, clip:clipRect});
        else
            drawDefault({state, data, meshX, meshY, xScale, yScale, dataState, dataset:dataHandler, graph:graphHandler, clip:clipRect});

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

        for(let i=1; i<meshX.length-1; i++){
            for(let j=1; j<meshX[i].length-1; j++){
                const x = Math.round(xScale.map(meshX[i][j] - (meshX[i][j] - meshX[i][j-1])/2));
                const width = Math.round(Math.abs(x - xScale.map(meshX[i][j] + (meshX[i][j+1] - meshX[i][j])/2)));
                const y = Math.round(yScale.map(meshY[i][j] - (meshY[i][j] - meshY[i-1][j])/2));
                const height = Math.round(Math.abs(y - yScale.map(meshY[i][j] + (meshY[i+1][j] - meshY[i][j])/2)));

                context.fillStyle = getColor(data[i][j], meshX[i][j], meshY[i][j], i, j, meshX, meshY, dataset, graph);
                context.beginPath();
                context.fillRect(x, y, width, height);
                context.fill();
                
            }
        }
    }else{
        const opacity = dataState.opacity;
        for(let i=1; i<meshX.length-1; i++){
            for(let j=1; j<meshX[i].length-1; j++){
                const x = Math.round(xScale.map(meshX[i][j] - (meshX[i][j] - meshX[i][j-1])/2));
                const width = Math.round(Math.abs(x - xScale.map(meshX[i][j] + (meshX[i][j+1] - meshX[i][j])/2)));
                const y = Math.round(yScale.map(meshY[i][j] - (meshY[i][j] - meshY[i-1][j])/2));
                const height = Math.round(Math.abs(y - yScale.map(meshY[i][j] + (meshY[i+1][j] - meshY[i][j])/2)));
                
                context.globalAlpha = isCallable(opacity) ? opacity(data[i][j], meshX[i][j], meshY[i][j], i, j, meshX, meshY, dataset, graph) : opacity[i][j]; //<-- Here
                context.fillStyle = getColor(data[i][j], meshX[i][j], meshY[i][j], i, j, meshX, meshY, dataset, graph);
                context.beginPath();
                context.fillRect(x, y, width, height);
                context.fill(); 
            }
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

    if(typeof Worker === "undefined"){
        if(typeof dataState.opacity === "number"){
            context.globalAlpha = dataState.opacity;    // <-- Difference
    
            for(let i=0; i<meshX.length-1; i++){
                for(let j=0; j<meshX[i].length-1; j++){
                    let xStart = Math.round(xScale.map(meshX[i][j]) - clip.x + client.x ) 
                    let xEnd = Math.round(xScale.map(meshX[i][j+1]) - clip.x + client.x )
                    let yStart = Math.round(yScale.map(meshY[i][j]) - clip.y + client.y);
                    let yEnd = Math.round(yScale.map(meshY[i+1][j]) - clip.y + client.y);
                    [xStart, xEnd] = [Math.min(xStart, xEnd), Math.max(xStart, xEnd)];
                    [yStart, yEnd] = [Math.min(yStart, yEnd), Math.max(yStart, yEnd)];
    
                    const xDelta = xEnd - xStart;
                    const yDelta = yEnd - yStart;
                    const data00 = data[i][j];
                    const data01 = data[i][j+1];
                    const data10 = data[i+1][j];
                    const data11 = data[i+1][j+1];
    
    
                    
                    for(let m=0; m<=xDelta; m++){
                        for(let n=0; n<=yDelta; n++){
                            const dataStartX = data00 + m*(data01-data00)/xDelta;
                            const dataEndX = data10 + m*(data11-data10)/xDelta;
                            const t = 3*Math.pow(n/yDelta,2) - 2*Math.pow(n/yDelta,3) 
                            const intData = dataStartX + (dataEndX - dataStartX)*t;
                            const color = getColor(intData, meshX[i][j], meshY[i][j], i, j, meshX, meshY, dataset, graph);
                            drawPixel(pixelData, xStart+m, yStart+n, color, dataState.opacity);
                        }
                    }
                }
            }
            context.putImageData(pixelData, clip.x, clip.y);
        }
    }else{
        const serialData : Array<number> = ([] as Array<number>).concat(...data);
        const serialMeshX : Array<number> = ([] as Array<number>).concat(...meshX);
        const serialMeshY : Array<number> = ([] as Array<number>).concat(...meshY);

        console.dir(serialData)
    }
}

//---------------------------------------------
//---------------------------------------------

function getColorFunction({data, dataState} : Get_Color_Function) : Heat_Property_Generator<string> {
    let colorFunction : Heat_Property_Generator<string> = ()=>"";

    if(typeof dataState.color === "string"){
        let min = data[0][0];
        let max = data[0][0];

        for(let i=0; i<data.length; i++){
            for(let j=0; j<data[i].length; j++){
                if(data[i][j] < min)
                    min = data[i][j];
                if(data[i][j] > max)
                    max = data[i][j];
            }
        }

        const cmap = colorMap({from:min, to:max, type:dataState.color});
        colorFunction = value=>cmap(value as number);
    }else if(isCallable(dataState.color)){
        colorFunction =  dataState.color;
    }else if(typeof dataState.color === "object"){
        colorFunction = (value, x, y, i, j)=>(dataState.color as Field_Property<string>)[i as number][j as number];
    }

    return colorFunction;
}

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
//---------------------------------------------