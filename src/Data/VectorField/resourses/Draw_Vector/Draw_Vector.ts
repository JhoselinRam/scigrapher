import {  Graph2D_State } from "../../../../Graph2D/Graph2D_Types";
import { getGraphRect, getLineDash, isCallable } from "../../../../tools/Helplers/Helplers.js";
import { Mapping } from "../../../../tools/Mapping/Mapping_Types";
import { Vector_Field_Method_Generator } from "../../Vector_Field_Types";
import { Draw_Vector, Get_Scale, Vector_Draw_Dynamic, Vector_Draw_Static } from "./Draw_Vector_Types";

function DrawVector({dataHandler, dataState, graphHandler}:Vector_Field_Method_Generator) : Draw_Vector {

//--------------- Draw Data -------------------

    function drawData(state : Graph2D_State){
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
        const meshX = isCallable(dataState.mesh.x)? dataState.mesh.x(dataHandler, graphHandler) : dataState.mesh.x.slice();
        const meshY = isCallable(dataState.mesh.y)? dataState.mesh.y(dataHandler, graphHandler) : dataState.mesh.y.slice();
        const dataX = isCallable(dataState.data.x)? dataState.data.x(dataHandler, graphHandler) : dataState.data.x.slice();
        const dataY = isCallable(dataState.data.y)? dataState.data.y(dataHandler, graphHandler) : dataState.data.y.slice();
        const scale = dataState.normalized? getScale({xScale, yScale, meshX, meshY, dataX, dataY, maxLength:dataState.maxLenght}) : 1;
        const clipRect = getGraphRect(state); 

        state.context.data.save();
        state.context.data.beginPath();
        state.context.data.rect(clipRect.x, clipRect.y, clipRect.width, clipRect.height);
        state.context.data.clip();
        state.context.data.translate(state.context.clientRect.x, state.context.clientRect.y);

        if(typeof dataState.color === "string" &&
        typeof dataState.opacity === "number" &&
        typeof dataState.style === "string" &&
        typeof dataState.width === "number"){
            drawStatic({context:state.context.data, dataX, dataY, meshX, meshY, xScale, yScale, scale, color:dataState.color, opacity:dataState.opacity, style:dataState.style, width:dataState.width});
        }else{
            drawDynamic({context:state.context.data, dataHandler, dataState, dataX, dataY, graphHandler, meshX, meshY, xScale, yScale, scale});
        }

        state.context.data.restore();

    }

//---------------------------------------------

    return {
        drawData
    }

}

export default DrawVector;






//-------------- Draw Static ------------------

function drawStatic({context, dataX, dataY, meshX, meshY, scale, xScale, yScale, color, opacity, style, width}:Vector_Draw_Static){
    context.strokeStyle = color;
    context.globalAlpha = opacity;
    context.lineWidth = width;
    context.setLineDash(getLineDash(style));

    context.beginPath();
    for(let i=0; i<meshX.length; i++){
        for(let j=0; j<meshX[0].length; j++){
            const xStart = Math.round(xScale.map(meshX[i][j])) + width%2 * 0.5;
            const yStart = Math.round(yScale.map(meshY[i][j])) + width%2 * 0.5;
            const xEnd = Math.round(xScale.map(meshX[i][j] + dataX[i][j])) + width%2 * 0.5;
            const yEnd = Math.round(yScale.map(meshY[i][j] + dataY[i][j])) + width%2 * 0.5;

            context.moveTo(xStart, yStart);
            context.lineTo(xEnd, yEnd);
        }
    }
    context.stroke();

}

//---------------------------------------------
//------------- Draw Dynamic ------------------

function drawDynamic({context, dataHandler, dataState, dataX, dataY, graphHandler, meshX, meshY, scale, xScale, yScale}:Vector_Draw_Dynamic){

}

//---------------------------------------------
//--------------- Get Scale -------------------

function getScale({dataX, dataY, maxLength, meshX, meshY, xScale, yScale} : Get_Scale) : number{
    let maxSize = 0;
    let iMax = 0;
    let jMax = 0;

    //Finds the longest vector
    for(let i=0; i<meshX.length; i++){
        for(let j=0; j<meshX[0].length; j++){
            const size = Math.hypot(dataX[i][j], dataY[i][j]);
            if(size > maxSize){
                maxSize = size;
                iMax = i;
                jMax = j;
            }
        }
    }

    const xStart = meshX[iMax][jMax];
    const xEnd = meshX[iMax][jMax] + dataX[iMax][jMax];
    const yStart = meshY[iMax][jMax];
    const yEnd = meshY[iMax][jMax] + dataY[iMax][jMax];

    const xRangeSize = Math.abs(xScale.map(xStart) - xScale.map(xEnd));
    const yRangeSize = Math.abs(yScale.map(yStart) - yScale.map(yEnd));

    return maxLength/Math.hypot(xRangeSize, yRangeSize);
}

//---------------------------------------------