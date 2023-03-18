import {  Graph2D_State } from "../../../Graph2D/Graph2D_Types.js";
import { drawLabel, getLineDash } from "../../../tools/Helplers/Helplers.js";
import mapping from "../../../tools/Mapping/Mapping.js";
import { Colorbar_Method_Generator, Colorbar_State } from "../../Colorbar_Types";
import { Draw_Colorbar } from "./Draw_Colorbar_Types";

function DrawColorbar({barState, state} : Colorbar_Method_Generator) : Draw_Colorbar{
    
    //---------------------------------------------
        
    function draw(){
        if(!barState.enable) return;

        state.context.data.save();
        state.context.data.translate(barState.metrics.position.x, barState.metrics.position.y);

        if((typeof barState.position === "string" && (barState.position==="x-start" || barState.position==="x-end")) || 
        (typeof barState.position === "object" && barState.position.orientation === "vertical")){
            drawVertical(state, barState);
        }
        
        if((typeof barState.position === "string" && (barState.position==="y-start" || barState.position==="y-end")) || 
        (typeof barState.position === "object" && barState.position.orientation === "horizontal")){
            drawHorizontal(state, barState);
        }

        state.context.data.restore();
    }
    
//---------------------------------------------
    
        return {
            draw
        }
    }
    
    export default DrawColorbar;
















//---------------------------------------------

function drawVertical(state:Graph2D_State, barState:Colorbar_State){
    //Bar
    state.context.data.fillStyle = barState.gradient.gradientObject;
    state.context.data.globalAlpha = barState.opacity;
    state.context.data.fillRect(barState.metrics.barCoord, 0, barState.width, barState.metrics.height);

    //Border
    state.context.data.strokeStyle = barState.border.color;
    state.context.data.globalAlpha = barState.border.opacity;
    state.context.data.lineWidth = barState.border.width;
    state.context.data.setLineDash(getLineDash(barState.border.style));
    state.context.data.strokeRect(Math.round(barState.metrics.barCoord)+barState.border.width%2*0.5, barState.border.width%2*0.5, barState.width, barState.metrics.height);

    //Ticks
    const yScale = mapping({from:[0,1], to:[barState.metrics.height-barState.textOffset, barState.textOffset]});
    const xTick = barState.label.position==="start"? barState.metrics.barCoord : barState.metrics.barCoord + barState.width - barState.textOffset;
    state.context.data.strokeStyle = barState.ticks.color;
    state.context.data.globalAlpha = barState.ticks.opacity;
    state.context.data.lineWidth = barState.ticks.width;
    state.context.data.setLineDash(getLineDash(barState.ticks.style));
    state.context.data.beginPath();
    barState.gradient.entries.forEach(item=>{
        const y = Math.round(yScale.map(item.position)) + barState.border.width%2*0.5;

        state.context.data.moveTo(xTick, y);
        state.context.data.lineTo(xTick + barState.textOffset, y);
    });
    state.context.data.stroke();

    //Labels
    state.context.data.strokeStyle = barState.label.color;
    state.context.data.fillStyle = barState.label.color;
    state.context.data.globalAlpha = barState.label.opacity;
    state.context.data.font = `${barState.label.size} ${barState.label.font}`;
    state.context.data.textBaseline = "middle";
    state.context.data.textAlign = barState.label.position==="start"? "right" : "left";
   
    barState.gradient.entries.forEach(item =>{
        const y = Math.round(yScale.map(item.position))

        drawLabel(state.context.data, item.label, barState.metrics.labelCoord, y, "");
    });

    //Title
    const [angle, baseline] = barState.title.reverse? [Math.PI/2, "bottom"] : [-Math.PI/2, "top"];
    state.context.data.strokeStyle = barState.title.color;
    state.context.data.fillStyle = barState.title.color;
    state.context.data.globalAlpha = barState.title.opacity;
    state.context.data.font = `${barState.title.size} ${barState.title.font}`;
    state.context.data.textBaseline = baseline as "top"|"bottom";
    state.context.data.textAlign = "center";
    state.context.data.translate(barState.metrics.titleCoord, barState.metrics.height/2);
    state.context.data.rotate(angle);
    state.context.data.fillText(barState.title.text, 0, 0);
}

//---------------------------------------------
//---------------------------------------------

function drawHorizontal(state:Graph2D_State, barState:Colorbar_State){
    //Bar
    state.context.data.fillStyle = barState.gradient.gradientObject;
    state.context.data.globalAlpha = barState.opacity;
    state.context.data.fillRect(0, barState.metrics.barCoord, barState.metrics.width, barState.width);

    //Border
    state.context.data.strokeStyle = barState.border.color;
    state.context.data.globalAlpha = barState.border.opacity;
    state.context.data.lineWidth = barState.border.width;
    state.context.data.setLineDash(getLineDash(barState.border.style));
    state.context.data.strokeRect(barState.border.width%2*0.5, Math.round( barState.metrics.barCoord) + barState.border.width%2*0.5, barState.metrics.width, barState.width);

    //Ticks
    const yTick = barState.label.position==="start"? barState.metrics.barCoord + barState.width - barState.textOffset : barState.metrics.barCoord;
    state.context.data.strokeStyle = barState.ticks.color;
    state.context.data.globalAlpha = barState.ticks.opacity;
    state.context.data.lineWidth = barState.ticks.width;
    state.context.data.setLineDash(getLineDash(barState.ticks.style));
    state.context.data.beginPath();
    barState.gradient.entries.forEach(item=>{
        const x = Math.round(barState.textOffset + (barState.metrics.width - 2*barState.textOffset)*item.position) + barState.border.width%2*0.5;

        state.context.data.moveTo(x, yTick);
        state.context.data.lineTo(x, yTick+barState.textOffset);
    });
    state.context.data.stroke();

    //Labels
    const xScale = mapping({from:[0,1], to:[barState.textOffset, barState.metrics.width-barState.textOffset]});
    state.context.data.strokeStyle = barState.label.color;
    state.context.data.fillStyle = barState.label.color;
    state.context.data.globalAlpha = barState.label.opacity;
    state.context.data.font = `${barState.label.size} ${barState.label.font}`;
    state.context.data.textBaseline = "top";
    state.context.data.textAlign = "center";
   
    barState.gradient.entries.forEach(item =>{
        const x = Math.round(xScale.map(item.position))

        drawLabel(state.context.data, item.label, x, barState.metrics.labelCoord, "");
    });

    //Title
    state.context.data.strokeStyle = barState.title.color;
    state.context.data.fillStyle = barState.title.color;
    state.context.data.globalAlpha = barState.title.opacity;
    state.context.data.font = `${barState.title.size} ${barState.title.font}`;
    state.context.data.textBaseline = "top";
    state.context.data.textAlign = "center";
    state.context.data.translate(barState.metrics.width/2, barState.metrics.titleCoord);
    state.context.data.fillText(barState.title.text, 0, 0);
}

//---------------------------------------------