import { getTextSize } from "../../../tools/Helplers/Helplers.js";
import { Colorbar_Method_Generator } from "../../Colorbar_Types";
import { Compute_Colorbar } from "./Compute_Colorbar_Types";

function ComputeColorbar({barState, state} : Colorbar_Method_Generator) : Compute_Colorbar{
    
//---------------------------------------------
    
    function compute(){
        if(!barState.enable) return;

        const gradientSteps : Array<[number, string]> = [];
        

        //Compute the gradient components
        if(typeof barState.data === "string"){

        }
        if(typeof barState.data === "object"){
            barState.data.sort((a,b) => a.position - b.position);
            const maxPosition = barState.data[barState.data.length-1].position;
            barState.gradient.entries = barState.data.map(item=>{
                gradientSteps.push([item.position/maxPosition, item.color]);
                return {
                    color:item.color, 
                    label:`${item.label}${barState.unit}`, 
                    position:item.position/maxPosition}
            });
        }

        //Compute the absolute sizes and change the margin if needed
        const graphRect = state.context.graphRect();
        const titleSize = getTextSize(barState.title.text, barState.title.size, barState.title.font, state.context.data);
        let labelWidth = 0;
        let labelHeight = 0;

        barState.gradient.entries.forEach(item=>{
            const size = getTextSize(item.label, barState.label.size, barState.label.font, state.context.data);
            
            if(size.width > labelWidth)
                labelWidth = size.width;
            if(size.height > labelHeight)
                labelHeight = size.height;
        });

        
        
        switch(barState.position){
            case "x-start":{
                //Size
                barState.metrics.width = barState.width + barState.textOffset + labelWidth;
                barState.metrics.height = (graphRect.height - 2*state.marginUsed.defaultMargin) * barState.size;
                barState.gradient.gradientObject = state.context.data.createLinearGradient(0, barState.metrics.height, 0, 0);

                if(barState.title.text !== "") barState.metrics.width += barState.textOffset + titleSize.height; 
                
                //Margin
                const minMargin = barState.metrics.width + 6*state.marginUsed.defaultMargin;
                if(state.marginUsed.x.start < minMargin) 
                    state.marginUsed.x.start = minMargin;
                    
                //Coordinates
                let startPosition = 0;
                if(barState.title.text !== ""){
                    if(barState.title.position === "start"){
                        barState.metrics.titleCoord = 0;
                        startPosition = titleSize.height + barState.textOffset;
                    }
                    else
                        barState.metrics.titleCoord = barState.metrics.width - titleSize.height;
                }
                if(barState.label.position === "start"){
                    barState.metrics.labelCoord = startPosition + labelWidth;
                    barState.metrics.barCoord = barState.metrics.labelCoord + barState.textOffset;
                }
                if(barState.label.position === "end"){
                    barState.metrics.barCoord = startPosition;
                    barState.metrics.labelCoord = barState.metrics.barCoord + barState.width + barState.textOffset;
                }
            }
            break;

            case "x-end":{
                //Size
                barState.metrics.width = barState.width + barState.textOffset + labelWidth;
                barState.metrics.height = (graphRect.height - 2*state.marginUsed.defaultMargin) * barState.size;
                barState.gradient.gradientObject = state.context.data.createLinearGradient(0, barState.metrics.height, 0, 0);

                if(barState.title.text !== "") barState.metrics.width += barState.textOffset + titleSize.height;

                //Margin
                const minMargin = barState.metrics.width + 6*state.marginUsed.defaultMargin;
                if(state.marginUsed.x.end < minMargin) 
                    state.marginUsed.x.end = minMargin;

                //Coordinates
                let startPosition = 0;
                if(barState.title.text !== ""){
                    if(barState.title.position === "start"){
                        barState.metrics.titleCoord = 0;
                        startPosition = titleSize.height + barState.textOffset;
                    }
                    else
                        barState.metrics.titleCoord = barState.metrics.width - titleSize.height;
                }
                if(barState.label.position === "start"){
                    barState.metrics.labelCoord = startPosition + labelWidth;
                    barState.metrics.barCoord = barState.metrics.labelCoord + barState.textOffset;
                }
                if(barState.label.position === "end"){
                    barState.metrics.barCoord = startPosition;
                    barState.metrics.labelCoord = barState.metrics.barCoord + barState.width + barState.textOffset;
                }
            }
           break;

            case "y-start":{
                //Size
                barState.metrics.width = (graphRect.width - 2*state.marginUsed.defaultMargin) * barState.size;
                barState.metrics.height = barState.width + barState.textOffset + labelHeight;
                barState.gradient.gradientObject = state.context.data.createLinearGradient(0, 0, barState.metrics.width, 0);

                if(barState.title.text !== "") barState.metrics.height += barState.textOffset + titleSize.height;

                //Margin
                const minMargin = barState.metrics.height + 6*state.marginUsed.defaultMargin;
                if(state.marginUsed.y.start < minMargin) 
                    state.marginUsed.y.start = minMargin;

                //Coordinates
                let startPosition = 0;
                if(barState.title.text !== ""){
                    if(barState.title.position === "start")
                        barState.metrics.titleCoord = barState.metrics.height - titleSize.height;
                    else{
                        barState.metrics.titleCoord = 0;
                        startPosition = titleSize.height + barState.textOffset
                    }
                }
                if(barState.label.position === "start"){
                    barState.metrics.barCoord = startPosition;
                    barState.metrics.labelCoord = barState.metrics.barCoord + barState.width + barState.textOffset;
                }
                if(barState.label.position === "end"){
                    barState.metrics.labelCoord = startPosition;
                    barState.metrics.barCoord = startPosition + labelHeight + barState.textOffset;
                }
            }
            break;

            case "y-end":{
                //Size
                barState.metrics.width = (graphRect.width - 2*state.marginUsed.defaultMargin) * barState.size;
                barState.metrics.height = barState.width + barState.textOffset + labelHeight;
                barState.gradient.gradientObject = state.context.data.createLinearGradient(0, 0, barState.metrics.width, 0);

                if(barState.title.text !== "") barState.metrics.height += barState.textOffset + titleSize.height;
            
                //Margin
                const minMargin = barState.metrics.height + 6*state.marginUsed.defaultMargin;
                if(state.marginUsed.y.end < minMargin) 
                    state.marginUsed.y.end = minMargin;

                //Coordinates
                let startPosition = 0;
                if(barState.title.text !== ""){
                    if(barState.title.position === "start")
                        barState.metrics.titleCoord = barState.metrics.height - titleSize.height;
                    else{
                        barState.metrics.titleCoord = 0;
                        startPosition = titleSize.height + barState.textOffset
                    }
                }
                if(barState.label.position === "start"){
                    barState.metrics.barCoord = startPosition;
                    barState.metrics.labelCoord = barState.metrics.barCoord + barState.width + barState.textOffset;
                }
                if(barState.label.position === "end"){
                    barState.metrics.labelCoord = startPosition;
                    barState.metrics.barCoord = startPosition + labelHeight + barState.textOffset;
                }
            }
            break;

            case "floating":
                if(barState.floating.orientation==="vertical"){
                    //Size
                    barState.metrics.width = barState.width + barState.textOffset + labelWidth;
                    barState.metrics.height = graphRect.height * barState.size;
                    barState.gradient.gradientObject = state.context.data.createLinearGradient(0, barState.metrics.height, 0, 0);

                    if(barState.title.text !== "") barState.metrics.width += barState.textOffset + titleSize.height;

                    //Coordinates
                    let startPosition = 0;
                    if(barState.title.text !== ""){
                        if(barState.title.position === "start"){
                            barState.metrics.titleCoord = 0;
                            startPosition = titleSize.height + barState.textOffset;
                        }
                        else
                            barState.metrics.titleCoord = barState.metrics.width - titleSize.height;
                    }
                    if(barState.label.position === "start"){
                        barState.metrics.labelCoord = startPosition + labelWidth;
                        barState.metrics.barCoord = barState.metrics.labelCoord + barState.textOffset;
                    }
                    if(barState.label.position === "end"){
                        barState.metrics.barCoord = startPosition;
                        barState.metrics.labelCoord = barState.metrics.barCoord + barState.width + barState.textOffset;
                    }

                }
                if(barState.floating.orientation==="horizontal"){
                    //Size
                    barState.metrics.width = graphRect.width * barState.size;
                    barState.metrics.height = barState.width + barState.textOffset + labelHeight;
                    barState.gradient.gradientObject = state.context.data.createLinearGradient(0, 0, barState.metrics.width, 0);

                    if(barState.title.text !== "") barState.metrics.height += barState.textOffset + titleSize.height;

                    //Coordinates
                    let startPosition = 0;
                    if(barState.title.text !== ""){
                        if(barState.title.position === "start")
                            barState.metrics.titleCoord = barState.metrics.height - titleSize.height;
                        else{
                            barState.metrics.titleCoord = 0;
                            startPosition = titleSize.height + barState.textOffset
                        }
                    }
                    if(barState.label.position === "start"){
                        barState.metrics.barCoord = startPosition;
                        barState.metrics.labelCoord = barState.metrics.barCoord + barState.width + barState.textOffset;
                    }
                    if(barState.label.position === "end"){
                        barState.metrics.labelCoord = startPosition;
                        barState.metrics.barCoord = startPosition + labelHeight + barState.textOffset;
                    }
                }
                break;
        }

        if(barState.reverse)
            gradientSteps.forEach(item=>{
                barState.gradient.gradientObject.addColorStop(1-item[0], item[1])
            });
        else
            gradientSteps.forEach(item=>{
                barState.gradient.gradientObject.addColorStop(item[0], item[1])
            });
            
        
    }

//---------------------------------------------

    return {
        compute
    }
}

export default ComputeColorbar;