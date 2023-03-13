import { Graph2D_State } from "../../../Graph2D/Graph2D_Types";
import { Colorbar_Method_Generator, Colorbar_State } from "../../Colorbar_Types";
import { Compute_Colorbar } from "./Compute_Colorbar_Types";

function ComputeColorbar({barState, state} : Colorbar_Method_Generator) : Compute_Colorbar{
    
//---------------------------------------------
    
    function compute(){
        if(!barState.enable) return;

        //Compute the gradient components
        if(typeof barState.data === "string"){

        }
        if(typeof barState.data === "object"){
            console.dir(barState.data)
            barState.data.sort((a,b) => barState.reverse ? b.position - a.position : a.position - b.position);
            console.dir(barState.data)
            const maxPosition = barState.reverse? barState.data[0].position : barState.data[barState.data.length-1].position;
            barState.gradient = barState.data.map(item=>{return {...item, position:item.position/maxPosition}});
        }

        //Compute the absolute sizes and change the margin if needed
        const [textWidth, textHeight] = getTextSizes(barState, state);
        const graphRect = state.context.graphRect();
        const textOffset = 4;

        switch(barState.position){
            case "x-start":{
                barState.absoluteSize.width = barState.width + textOffset + textWidth;
                barState.absoluteSize.height = (graphRect.height - 2*state.marginUsed.defaultMargin) * barState.size;

                if(barState.label.title !== "") barState.absoluteSize.width += textOffset + textHeight; 
                
                const minMargin = barState.absoluteSize.width + 2*state.marginUsed.defaultMargin;
                if(state.marginUsed.x.start < minMargin) 
                    state.marginUsed.x.start = minMargin; 
            }
            break;

            case "x-end":{
                barState.absoluteSize.width = barState.width + textOffset + textWidth;
                barState.absoluteSize.height = (graphRect.height - 2*state.marginUsed.defaultMargin) * barState.size;

                if(barState.label.title !== "") barState.absoluteSize.width += textOffset + textHeight;

                const minMargin = barState.absoluteSize.width + 2*state.marginUsed.defaultMargin;
                if(state.marginUsed.x.end < minMargin) 
                    state.marginUsed.x.end = minMargin;
            }
           break;

            case "y-start":{
                barState.absoluteSize.width = (graphRect.height - 2*state.marginUsed.defaultMargin) * barState.size;
                barState.absoluteSize.height = barState.width + textOffset + textHeight;

                if(barState.label.title !== "") barState.absoluteSize.height += textOffset + textHeight;

                const minMargin = barState.absoluteSize.height + 2*state.marginUsed.defaultMargin;
                if(state.marginUsed.y.start < minMargin) 
                    state.marginUsed.y.start = minMargin;
            }
            break;

            case "y-end":{
                barState.absoluteSize.width = (graphRect.height - 2*state.marginUsed.defaultMargin) * barState.size;
                barState.absoluteSize.height = barState.width + textOffset + textHeight;

                if(barState.label.title !== "") barState.absoluteSize.height += textOffset + textHeight;
            
                const minMargin = barState.absoluteSize.height + 2*state.marginUsed.defaultMargin;
                if(state.marginUsed.y.end < minMargin) 
                    state.marginUsed.y.end = minMargin;
            }
            break;

            case "floating":
                if(barState.floating.orientation==="vertical"){
                    barState.absoluteSize.width = barState.width + textOffset + textWidth;
                    barState.absoluteSize.height = graphRect.height * barState.size;

                    if(barState.label.title !== "") barState.absoluteSize.width += textOffset + textHeight;
                }
                if(barState.floating.orientation==="horizontal"){
                    barState.absoluteSize.width = graphRect.width * barState.size;
                    barState.absoluteSize.height = barState.width + textOffset + textHeight;

                    if(barState.label.title !== "") barState.absoluteSize.height += textOffset + textHeight;
                }
                break;
        }
    }

//---------------------------------------------

    return {
        compute
    }
}

export default ComputeColorbar;









//---------------------------------------------

function getTextSizes(barState:Colorbar_State, state:Graph2D_State) : [number, number]{
    let maxWidth = 0;
    let maxHeight = 0;

    state.context.data.save();
    state.context.data.font = `${barState.label.size} ${barState.label.font}`;
    barState.gradient.forEach(item=>{
        const metric = state.context.data.measureText(item.label);
        const width = metric.width;
        const height = metric.actualBoundingBoxLeft + metric.actualBoundingBoxRight;
        
        if(width > maxWidth) maxWidth = width;
        if(height > maxHeight) maxHeight = height;
    });

    return [maxWidth, maxHeight];
}

//---------------------------------------------


