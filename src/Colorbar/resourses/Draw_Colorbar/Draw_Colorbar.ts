import { getLineDash, getTextSize } from "../../../tools/Helplers/Helplers.js";
import { Colorbar_Method_Generator } from "../../Colorbar_Types";
import { Draw_Colorbar } from "./Draw_Colorbar_Types";

function DrawColorbar({barState, state} : Colorbar_Method_Generator) : Draw_Colorbar{
    
    //---------------------------------------------
        
        function draw(){
            if(!barState.enable) return;

            const graphRect = state.context.graphRect();

            state.context.data.save();
            state.context.data.translate(state.context.clientRect.x, graphRect.y);

            switch(barState.position){
                case "x-end":{
                    const yCoord = Math.round(graphRect.height/2 - barState.absoluteSize.height/2) + barState.border.width%2 * 0.5;
                    if(barState.label.position === "end"){
                        const xCoord = Math.round(state.context.clientRect.width - barState.textOffset - barState.absoluteSize.width) + barState.border.width%2 * 0.5;
                        const gradient = state.context.data.createLinearGradient(xCoord+barState.absoluteSize.width, yCoord+barState.absoluteSize.height, xCoord, yCoord,);
                        
                        //Labels and ticks
                        state.context.data.fillStyle = barState.label.color;
                        state.context.data.strokeStyle = barState.label.color;
                        state.context.data.globalAlpha = barState.label.opacity;
                        state.context.data.lineWidth = barState.label.width;
                        state.context.data.font = `${barState.label.size} ${barState.label.font}`;
                        state.context.data.textBaseline = "middle";

                        const xText = xCoord + barState.width + barState.textOffset;
                        barState.gradient.forEach(item=>{
                            const yText = yCoord+barState.absoluteSize.height-barState.textOffset + (2*barState.textOffset-barState.absoluteSize.height)*item.position;
                            
                            barState.label.filled? state.context.data.fillText(item.label, xText, yText):
                                                   state.context.data.strokeText(item.label, xText, yText);
                            
                            gradient.addColorStop(item.position, item.color);                     
                        });

                        //Title
                        if(barState.title.text !== ""){
                            const titleSize = getTextSize(barState.title.text, barState.title.size, barState.title.font, state.context.data);
                            const xTitle = xCoord + barState.absoluteSize.width - barState.textOffset - titleSize.height;
                            const yTitle = yCoord + barState.absoluteSize.height/2;
                            state.context.data.save();
                            state.context.data.translate(xTitle, yTitle);
                            state.context.data.rotate(-Math.PI/2);
                            state.context.data.fillStyle = barState.title.color;
                            state.context.data.strokeStyle = barState.title.color;
                            state.context.data.globalAlpha = barState.title.opacity;
                            state.context.data.lineWidth = barState.title.width;
                            state.context.data.font = `${barState.title.size} ${barState.title.font}`;
                            state.context.data.textAlign = "center";
                            state.context.data.textBaseline = "top";
                            state.context.data.fillText(barState.title.text, 0, 0);
                            state.context.data.restore();
                        }


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
                            const yText = Math.round(yCoord+barState.absoluteSize.height-barState.textOffset + (2*barState.textOffset-barState.absoluteSize.height)*item.position) + barState.border.width%2 * 0.5;
                            
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