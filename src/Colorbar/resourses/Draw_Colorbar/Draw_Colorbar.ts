import { Colorbar_Method_Generator } from "../../Colorbar_Types";
import { Draw_Colorbar } from "./Draw_Colorbar_Types";

function DrawColorbar({barHandler, barState, graphHandler, state} : Colorbar_Method_Generator) : Draw_Colorbar{
    
    //---------------------------------------------
        
        function draw(){
            state.context.data.save();
            state.context.data.translate(state.context.clientRect.x, state.context.clientRect.y);


            switch(barState.position){
                case "x-end":{
                    const yCoord = state.marginUsed.defaultMargin;
                    if(barState.label.position === "out"){
                        const xCoord = state.context.clientRect.width - barState.textOffset - barState.absoluteSize.width;
                        const gradient = state.context.data.createLinearGradient(xCoord+barState.absoluteSize.width, yCoord+barState.absoluteSize.height, xCoord, yCoord,);
                        
                        //Labels
                        state.context.data.fillStyle = barState.label.color;
                        state.context.data.globalAlpha = barState.label.opacity;
                        state.context.data.lineWidth = barState.label.width;
                        state.context.data.font = `${barState.label.size} ${barState.label.font}`;
                        
                        const xText = xCoord + barState.width + barState.textOffset;
                        barState.gradient.forEach(item=>{
                            gradient.addColorStop(item.position, item.color);
                            const yText = (yCoord + barState.absoluteSize.height) * (1 - item.position);
                            state.context.data.strokeText(item.label, xText, yText);
                        });

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