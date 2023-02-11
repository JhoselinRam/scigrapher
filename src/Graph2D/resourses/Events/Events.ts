import { Graph2D, Method_Generator } from "../../Graph2D_Types";
import { Aspect_Ratio_Props, Events } from "./Events_Types";

function Events({state, graphHandler} : Method_Generator) : Events {

//-------------- Aspect Ratio -----------------

    function aspectRatio({ratio, axis="y", preserve="start"} : Aspect_Ratio_Props) : Graph2D{
        const domainWidth = Math.abs(state.axis.x.end - state.axis.x.start);
        const domainHeight = Math.abs(state.axis.y.end - state.axis.y.start);
        const anchor = typeof preserve === "number"? preserve : state.axis[axis][preserve];

        if(axis === "x"){
            const newWidth = state.context.clientRect.width/state.context.clientRect.height * domainHeight*ratio;            
        }

        return graphHandler;
    }

//---------------------------------------------


    return {

    };
}

export default Events;