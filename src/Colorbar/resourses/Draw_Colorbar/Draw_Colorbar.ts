import { getLineDash } from "../../../tools/Helplers/Helplers.js";
import { Colorbar_Method_Generator } from "../../Colorbar_Types";
import { Draw_Colorbar } from "./Draw_Colorbar_Types";

function DrawColorbar({barHandler, barState, graphHandler, state} : Colorbar_Method_Generator) : Draw_Colorbar{
    
    //---------------------------------------------
        
        function draw(){
            const graphRect = state.context.graphRect();

            state.context.data.save();
            state.context.data.translate(state.context.clientRect.x, graphRect.y);

            switch(barState.position){
                case "x-end":{
                    const yCoord = state.marginUsed.defaultMargin + barState.border.width%2 * 0.5;
                    if(barState.label.position === "out"){
                        const xCoord = state.context.clientRect.width - barState.textOffset - barState.absoluteSize.width + barState.border.width%2 * 0.5;
                        const gradient = state.context.data.createLinearGradient(xCoord+barState.absoluteSize.width, yCoord+barState.absoluteSize.height, xCoord, yCoord,);
                        
                        //Labels and ticks
                        state.context.data.fillStyle = barState.label.color;
                        state.context.data.globalAlpha = barState.label.opacity;
                        state.context.data.lineWidth = barState.label.width;
                        state.context.data.font = `${barState.label.size} ${barState.label.font}`;
                        state.context.data.textBaseline = "middle";

                        const xText = xCoord + barState.width + barState.textOffset;
                        barState.gradient.forEach(item=>{
                            const yText = (yCoord + barState.absoluteSize.height) * (1 - item.position);
                            
                            state.context.data.fillText(item.label, xText, yText);
                            
                            gradient.addColorStop(item.position, item.color);                     
                        });

                        //Bar
                        state.context.data.fillStyle = gradient;
                        state.context.data.globalAlpha = barState.opacity;
                        state.context.data.fillRect(xCoord, yCoord, barState.width, barState.absoluteSize.height);

                        //Border
                        state.context.data.strokeStyle = barState.border.color;
                        state.context.data.globalAlpha = barState.border.opacity;
                        state.context.data.lineWidth = barState.border.width;
                        state.context.data.setLineDash(getLineDash(barState.border.style));
                        state.context.data.strokeRect(xCoord, yCoord, barState.width, barState.absoluteSize.height);
                        state.context.data.beginPath();
                        barState.gradient.forEach(item=>{
                            const yText = Math.round((yCoord + barState.absoluteSize.height) * (1 - item.position)) + barState.border.width%2 * 0.5;
                            
                            state.context.data.moveTo(xText-2*barState.textOffset, yText);            
                            state.context.data.lineTo(xText-barState.textOffset, yText);            
                        });
                        state.context.data.stroke();
                    }
                }
                break;
            }

            state.context.data.restore();
        }
    
    //---------------------------------------------
    
        return {
            draw
        }
    }
    
    export default DrawColorbar;