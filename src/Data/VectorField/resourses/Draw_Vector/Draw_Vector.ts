import { Graph2D_State } from "../../../../Graph2D/Graph2D_Types";
import { getLineDash, isCallable } from "../../../../tools/Helplers/Helplers.js";
import { Mapping } from "../../../../tools/Mapping/Mapping_Types";
import { Field_Property } from "../../../Data_Types";
import { Vector_Field_Method_Generator } from "../../Vector_Field_Types";
import { Draw_Vector, Get_Scale, Vector_Draw_Dynamic, Vector_Draw_Static, Vector_Extract_Property } from "./Draw_Vector_Types";


const arrowSize = {x:4, y:2.5}

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
        
        let dataX : Field_Property<number> = [];
        let dataY : Field_Property<number> = [];
        
        if(isCallable(dataState.data.x) || isCallable(dataState.data.y)){
            for(let i=0; i<meshX.length; i++){
                dataX.push([]);
                dataY.push([]);
                for(let j=0; j<meshX[i].length; j++){
                    if(isCallable(dataState.data.x)) dataX[i].push(dataState.data.x(meshX[i][j], meshY[i][j], i, j, meshX, meshY, dataHandler, graphHandler));
                    if(isCallable(dataState.data.y)) dataY[i].push(dataState.data.y(meshX[i][j], meshY[i][j], i, j, meshX, meshY, dataHandler, graphHandler));
                }
            }
        }

        if(!isCallable(dataState.data.x)) dataX = dataState.data.x;
        if(!isCallable(dataState.data.y)) dataY = dataState.data.y;
        
        
        const scale = dataState.normalize? getScale({xScale, yScale, meshX, meshY, dataX, dataY, maxLength:dataState.maxLength}) : 1;
        const graphRect = graphHandler.graphRect();

        state.context.data.save();
        state.context.data.translate(graphRect.x, graphRect.y);
        state.context.data.beginPath();
        state.context.data.rect(0, 0, graphRect.width, graphRect.height);
        state.context.data.clip();

        if(typeof dataState.color === "string" &&
        typeof dataState.opacity === "number" &&
        typeof dataState.style === "string" &&
        typeof dataState.width === "number"){
            drawStatic({context:state.context.data, dataX, dataY, meshX, meshY, xScale, yScale, scale, color:dataState.color, opacity:dataState.opacity, style:dataState.style, width:dataState.width, normalize:dataState.normalize, maxLength:dataState.maxLength});
        }else{
            drawDynamic({context:state.context.data, dataHandler, dataState, dataX, dataY, graphHandler, meshX, meshY, xScale, yScale, scale, normalize:dataState.normalize, maxLength:dataState.maxLength});
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

function drawStatic({context, dataX, dataY, meshX, meshY, scale, xScale, yScale, color, opacity, style, width, normalize, maxLength}:Vector_Draw_Static){
    
    context.strokeStyle = color;
    context.globalAlpha = opacity;
    context.lineWidth = width;
    context.setLineDash(getLineDash(style));

    context.beginPath();
    for(let i=0; i<meshX.length; i++){
        for(let j=0; j<meshX[i].length; j++){
            const xStart = Math.round(xScale.map(meshX[i][j])) + width%2 * 0.5;
            const yStart = Math.round(yScale.map(meshY[i][j])) + width%2 * 0.5;
            const xEnd = Math.round(xScale.map(meshX[i][j] + dataX[i][j]*scale)) + width%2 * 0.5;
            const yEnd = Math.round(yScale.map(meshY[i][j] + dataY[i][j]*scale)) + width%2 * 0.5;
            const length = Math.hypot(xEnd-xStart, yEnd-yStart);
            const theta = Math.atan2(yEnd-yStart, xEnd-xStart);
            const arrowScale = normalize? length/maxLength : 1;


            context.save();
            context.translate(xStart, yStart);
            context.rotate(theta);
            context.moveTo(0, 0);
            context.lineTo(length, 0);
            context.lineTo(length-arrowSize.x*arrowScale, arrowSize.y*arrowScale);
            context.moveTo(length, 0);
            context.lineTo(length-arrowSize.x*arrowScale, -arrowSize.y*arrowScale);
            context.restore();
        }
    }
    context.stroke();

}

//---------------------------------------------
//------------- Draw Dynamic ------------------

function drawDynamic({context, dataHandler, dataState, dataX, dataY, graphHandler, meshX, meshY, scale, xScale, yScale, maxLength, normalize}:Vector_Draw_Dynamic){
    for(let i=0; i<meshX.length; i++){
        for(let j=0; j<meshX[i].length; j++){
            const extractionProps = {dataHandler, graphHandler, i, j, meshX, meshY, positionX:meshX[i][j], positionY:meshY[i][j], valuesX:dataX, valuesY:dataY, vectorX:dataX[i][j], vectorY:dataY[i][j]};
            
            const width = extractProperty({container:dataState.width, ...extractionProps});

            const xStart = Math.round(xScale.map(meshX[i][j])) + width%2 * 0.5;
            const yStart = Math.round(yScale.map(meshY[i][j])) + width%2 * 0.5;
            const xEnd = Math.round(xScale.map(meshX[i][j] + dataX[i][j]*scale)) + width%2 * 0.5;
            const yEnd = Math.round(yScale.map(meshY[i][j] + dataY[i][j]*scale)) + width%2 * 0.5;
            const length = Math.hypot(xEnd-xStart, yEnd-yStart);
            const theta = Math.atan2(yEnd-yStart, xEnd-xStart);
            const arrowScale = normalize? length/maxLength : 1;

            context.strokeStyle = extractProperty({container:dataState.color, ...extractionProps});
            context.globalAlpha = extractProperty({container:dataState.opacity, ...extractionProps});
            context.lineWidth = width;
            context.setLineDash(getLineDash(extractProperty({container:dataState.style, ...extractionProps})));
            
            context.save();
            context.translate(xStart, yStart);
            context.rotate(theta);
            context.beginPath();
            context.moveTo(0, 0);
            context.lineTo(length, 0);
            context.lineTo(length-arrowSize.x*arrowScale, arrowSize.y*arrowScale);
            context.moveTo(length, 0);
            context.lineTo(length-arrowSize.x*arrowScale, -arrowSize.y*arrowScale);
            context.stroke();
            context.restore();
        }
    }
}

//---------------------------------------------
//--------------- Get Scale -------------------

function getScale({dataX, dataY, maxLength, meshX, meshY, xScale, yScale} : Get_Scale) : number{
    let maxSize = 0;
    let iMax = 0;
    let jMax = 0;

    //Finds the longest vector
    for(let i=0; i<meshX.length; i++){
        for(let j=0; j<meshX[i].length; j++){
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
//------------ Extract Property ---------------

function extractProperty<T>({dataHandler, graphHandler, i, j, meshX, meshY, positionX, positionY, container, valuesX, valuesY, vectorX, vectorY} : Vector_Extract_Property<T>) : T{
    let property : T;
    
    if(isCallable(container)){
        property = container(vectorX, vectorY, positionX, positionY, i, j, valuesX, valuesY, meshX, meshY, dataHandler, graphHandler);
    } else if(typeof container !== "object"){
        property = container;
    } else{
        property = (container as Field_Property<T>)[i][j];
    }

    return property;
}

//---------------------------------------------