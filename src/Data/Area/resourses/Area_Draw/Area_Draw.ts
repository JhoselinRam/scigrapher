import { Graph2D_State } from "../../../../Graph2D/Graph2D_Types";
import { isCallable } from "../../../../tools/Helplers/Helplers.js";
import { Mapping } from "../../../../tools/Mapping/Mapping_Types";
import { Area_Method_Generator } from "../../Area_Types";
import { Area_Draw } from "./Area_Draw_Types";

function DrawArea({dataHandler, dataState, graphHandler} : Area_Method_Generator) : Area_Draw{

//----------------- Draw ----------------------

    function draw(state:Graph2D_State){
        if(!dataState.enable) return;
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
        const xData = isCallable(dataState.data.x)? dataState.data.x(dataHandler, graphHandler) : dataState.data.x.slice();
        const yData = isCallable(dataState.data.y)? dataState.data.y(dataHandler, graphHandler) : dataState.data.y.slice();
        const xBase = isCallable(dataState.base.x)? dataState.base.x(dataHandler, graphHandler) : dataState.base.x.slice();
        const yBase = isCallable(dataState.base.y)? dataState.base.y(dataHandler, graphHandler) : dataState.base.y.slice();
        xBase.reverse();
        yBase.reverse();
        const graphRect = graphHandler.graphRect();

        state.context.data.save();
        state.context.data.translate(graphRect.x, graphRect.y);
        state.context.data.beginPath();
        state.context.data.rect(0, 0, graphRect.width, graphRect.height);
        state.context.data.clip();

        state.context.data.fillStyle = dataState.color;
        state.context.data.globalAlpha = dataState.opacity;
        state.context.data.beginPath();
        state.context.data.moveTo(Math.round(xScale.map(xData[0])), Math.round(yScale.map(yData[0])));
        xData.forEach((positionX, i) =>{
            if(i === 0) return;
            let x = Math.round(xScale.map(positionX));
            let y = Math.round(yScale.map(yData[i]));

            if(dataState.polar){
                x = Math.round(xScale.map(positionX * Math.cos(yData[i])));
                y = Math.round(yScale.map(positionX * Math.sin(yData[i])));
            }
            
            state.context.data.lineTo(x ,y);
        });
        xBase.forEach((positionX, i)=>{
            let x = Math.round(xScale.map(positionX));
            let y = Math.round(yScale.map(yBase[i]));

            if(dataState.polar){
                x = Math.round(xScale.map(positionX * Math.cos(yBase[i])));
                y = Math.round(yScale.map(positionX * Math.sin(yBase[i])));
            }


            state.context.data.lineTo(x, y);
        })
        state.context.data.closePath();
        state.context.data.fill();


        state.context.data.restore();
    }

//---------------------------------------------


    return {
        draw
    }

}

export default DrawArea;