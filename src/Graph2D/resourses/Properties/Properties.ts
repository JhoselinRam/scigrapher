import { Graph2D, Method_Generator, Rect } from "../../Graph2D_Types";
import { Graph2D_Mappings, Properties } from "./Properties_Types";

function Properties({graphHandler, state} : Method_Generator) : Properties {

//------------- Canvas Elements --------------- 

    function canvasElements() : Array<HTMLCanvasElement>{
        return [state.canvasElement, state.canvasDataElement];
    }

//--------------------------------------------- 
//-------------- Client Rect ------------------ 

    function clientRect() : Rect{
        return {...state.context.clientRect};
    }

//--------------------------------------------- 
//----------------- Draw ---------------------- 

    function draw() : Graph2D {
        state.draw.full();
        return graphHandler;
    }

//--------------------------------------------- 
//-------------- Graph Rect ------------------- 

    function graphRect() : Rect{
        const rect = {...state.context.clientRect};

        switch(state.axis.position){
            case "center":
                rect.x += state.marginUsed.x.start;
                rect.y += state.marginUsed.y.end;
                rect.width -= state.marginUsed.x.start + state.marginUsed.x.end;
                rect.height -= state.marginUsed.y.start + state.marginUsed.y.end;
                break;
                
            case "bottom-left":
                rect.x += state.marginUsed.x.start + state.axisObj.primary.width;
                rect.y += state.marginUsed.y.end + state.axisObj.secondary.height;
                rect.width -= state.marginUsed.x.start + state.axisObj.primary.width + state.marginUsed.x.end + state.axisObj.secondary.width;
                rect.height -= state.marginUsed.y.start + state.axisObj.primary.height + state.marginUsed.y.end + state.axisObj.secondary.height;
                break;

            case "bottom-right":
                rect.x += state.marginUsed.x.start + state.axisObj.secondary.width;
                rect.y += state.marginUsed.y.end + state.axisObj.secondary.height;
                rect.width -= state.marginUsed.x.start + state.axisObj.primary.width + state.marginUsed.x.end + state.axisObj.secondary.width;
                rect.height -= state.marginUsed.y.start + state.axisObj.primary.height + state.marginUsed.y.end + state.axisObj.secondary.height;
                break;
            
            case "top-left":
                rect.x += state.marginUsed.x.start + state.axisObj.primary.width;
                rect.y += state.marginUsed.y.end + state.axisObj.primary.height;
                rect.width -= state.marginUsed.x.start + state.axisObj.primary.width + state.marginUsed.x.end + state.axisObj.secondary.width;
                rect.height -= state.marginUsed.y.start + state.axisObj.primary.height + state.marginUsed.y.end + state.axisObj.secondary.height;
                break;

            case "top-right":
                rect.x += state.marginUsed.x.start + state.axisObj.secondary.width;
                rect.y += state.marginUsed.y.end + state.axisObj.primary.height;
                rect.width -= state.marginUsed.x.start + state.axisObj.primary.width + state.marginUsed.x.end + state.axisObj.secondary.width;
                rect.height -= state.marginUsed.y.start + state.axisObj.primary.height + state.marginUsed.y.end + state.axisObj.secondary.height;
                break;
            
        }

        return rect;
    }

//--------------------------------------------- 
//------------ Mapping ------------------------ 

    function mapping() : Graph2D_Mappings{
        return {
            primary : {...state.scale.primary},
            secondary : {...state.scale.secondary}
        }
    }

//--------------------------------------------- 


    return {
        canvasElements,
        clientRect,
        draw,
        graphRect,
        mapping
    }
}

export default Properties;