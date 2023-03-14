import { getLineDash } from "../../../tools/Helplers/Helplers.js";
import mapping from "../../../tools/Mapping/Mapping.js";
import { Colorbar_Method_Generator } from "../../Colorbar_Types";
import { Draw_Colorbar } from "./Draw_Colorbar_Types";

function DrawColorbar({barState, state} : Colorbar_Method_Generator) : Draw_Colorbar{
    
    //---------------------------------------------
        
        function draw(){
            if(!barState.enable) return;

            const graphRect = state.context.graphRect();
            let xPosition;
            let yPosition;

            switch(barState.position){
                case "x-start":
                    xPosition = Math.round(state.context.clientRect.x + state.marginUsed.defaultMargin);
                    yPosition = Math.round(graphRect.y + graphRect.height/2 - barState.metrics.height/2);
                    break;

                case "x-end":
                    xPosition = Math.round(state.context.clientRect.x + state.context.clientRect.width - state.marginUsed.defaultMargin - barState.metrics.width);
                    yPosition = Math.round(graphRect.y + graphRect.height/2 - barState.metrics.height/2);
                    break;

                case "y-start":
                    xPosition = Math.round(graphRect.x + graphRect.width/2 - barState.metrics.width/2);
                    yPosition = Math.round(state.context.clientRect.y + state.context.clientRect.height - state.marginUsed.defaultMargin - barState.metrics.height);
                    break;

                case "y-end":
                    xPosition = Math.round(graphRect.x + graphRect.width/2 - barState.metrics.width/2);
                    yPosition = Math.round(state.context.clientRect.y + state.marginUsed.defaultMargin);
                    break;

                case "floating":
                    xPosition = barState.floating.x;
                    yPosition = barState.floating.y;
                    break;
            }

            state.context.data.save();
            state.context.data.translate(xPosition, yPosition);

            if(barState.position==="x-start" || barState.position==="x-end" || (barState.position==="floating" && barState.floating.orientation==="vertical")){
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
                const xTick = barState.label.position==="start"? barState.metrics.barCoord : barState.metrics.barCoord + barState.width - barState.textOffset;
                state.context.data.strokeStyle = barState.ticks.color;
                state.context.data.globalAlpha = barState.ticks.opacity;
                state.context.data.lineWidth = barState.ticks.width;
                state.context.data.setLineDash(getLineDash(barState.ticks.style));
                state.context.data.beginPath();
                barState.gradient.entries.forEach(item=>{
                    const y = Math.round(barState.textOffset + (barState.metrics.height - 2*barState.textOffset)*item.position) + barState.border.width%2*0.5;

                    state.context.data.moveTo(xTick, y);
                    state.context.data.lineTo(xTick + barState.textOffset, y);
                });
                state.context.data.stroke();

                //Labels
                const yScale = barState.reverse?  mapping({from:[0,1], to:[barState.textOffset, barState.metrics.height-barState.textOffset]}) :
                                                  mapping({from:[0,1], to:[barState.metrics.height-barState.textOffset, barState.textOffset]});
                state.context.data.strokeStyle = barState.label.color;
                state.context.data.fillStyle = barState.label.color;
                state.context.data.globalAlpha = barState.label.opacity;
                state.context.data.font = `${barState.label.size} ${barState.label.font}`;
                state.context.data.textBaseline = "middle";
                state.context.data.textAlign = barState.label.position==="start"? "right" : "left";
               
                barState.gradient.entries.forEach(item =>{
                    const y = Math.round(yScale.map(item.position))

                    barState.label.filled ? state.context.data.fillText(item.label, barState.metrics.labelCoord, y) : state.context.data.strokeText(item.label, barState.metrics.labelCoord, y)
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
                barState.title.filled? state.context.data.fillText(barState.title.text, 0, 0) : state.context.data.strokeText(barState.title.text, 0, 0);


            }
            if(barState.position==="y-start" || barState.position==="y-end" || (barState.position==="floating" && barState.floating.orientation==="horizontal")){

            }

            state.context.data.restore();
        }
    
    //---------------------------------------------
    
        return {
            draw
        }
    }
    
    export default DrawColorbar;