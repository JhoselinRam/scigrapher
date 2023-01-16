import { Method_Generator } from "../../Graph2D_Types";
import { Draw_Text_Props, Labels } from "./Labels_Types";

function Labels({state, graphHandler}:Method_Generator) : Labels{
    const heightOffset = 4;
//------------- Compute Labels ----------------

    function compute(){
        let titleHeight = 0;
        let subtitleHeight = 0;
        let xPrimaryHeight = 0;
        let yPrimaryHeight = 0;
        let xSecondaryHeight = 0;
        let ySecondaryHeight = 0;
        let x = 0;
        let y = 0;
        let width = state.container.clientWidth;
        let height = state.container.clientHeight;
        
        if(state.labels.title != null) titleHeight = getTextHeight(state.labels.title.text, state.labels.title.font);
        if(state.labels.subtitle != null) subtitleHeight = getTextHeight(state.labels.subtitle.text, state.labels.subtitle.font);
        if(state.labels.xPrimary != null) xPrimaryHeight = getTextHeight(state.labels.xPrimary.text, state.labels.xPrimary.font);
        if(state.labels.yPrimary != null) yPrimaryHeight = getTextHeight(state.labels.yPrimary.text, state.labels.yPrimary.font);
        if(state.labels.xSecondary != null) xSecondaryHeight = getTextHeight(state.labels.xSecondary.text, state.labels.xSecondary.font);
        if(state.labels.ySecondary != null) ySecondaryHeight = getTextHeight(state.labels.ySecondary.text, state.labels.ySecondary.font);

        

    }

    function getTextHeight(text:string, font:string) : number {
        state.context.canvas.font = font;
        const metrics = state.context.canvas.measureText(text);
        const height = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent+heightOffset;
        
        return height;
    }

//---------------------------------------------
//---------------------------------------------

    function draw(){
        let titleHeight = 0;
        let subtitleHeight = 0;
        let xPrimaryHeight = 0;
        let yPrimaryHeight = 0;
        let xSecondaryHeight = 0;
        let ySecondaryHeight = 0;
        let x = 0;
        let y = 0;
        let angle = 0;

        if(state.labels.title != null){
            titleHeight = getTextHeight(state.labels.title.text, state.labels.title.font);
            x = state.labels.title.position === "start" ? state.canvas.marginStart : 
               (state.labels.title.position === "center" ? state.canvas.marginStart+(state.container.clientWidth-state.canvas.marginStart-state.canvas.marginEnd)/2 :
               state.container.clientWidth-state.canvas.marginEnd);
            y = titleHeight+state.canvas.marginTop-heightOffset;
            drawText({params:state.labels.title, x, y, angle});
        }
        if(state.labels.subtitle != null){
            subtitleHeight = getTextHeight(state.labels.subtitle.text, state.labels.subtitle.font);
            x = state.labels.subtitle.position === "start" ? state.canvas.marginStart : 
               (state.labels.subtitle.position === "center" ? state.canvas.marginStart+(state.container.clientWidth-state.canvas.marginStart-state.canvas.marginEnd)/2 :
                state.container.clientWidth-state.canvas.marginEnd);
            y = titleHeight+subtitleHeight+state.canvas.marginTop-heightOffset;
            drawText({params:state.labels.subtitle, x, y, angle});
        }
        if(state.labels.xPrimary != null){
            xPrimaryHeight = getTextHeight(state.labels.xPrimary.text, state.labels.xPrimary.font);
            x = state.canvas.marginStart+xPrimaryHeight-heightOffset;
            y = state.labels.xPrimary.position === "start" ? state.container.clientHeight-state.canvas.marginBottom : 
               (state.labels.xPrimary.position === "center" ? state.container.clientHeight-state.canvas.marginBottom-(state.container.clientHeight-state.canvas.marginTop-state.canvas.marginBottom-titleHeight-subtitleHeight)/2 :
               titleHeight+subtitleHeight+state.canvas.marginTop+heightOffset);
            angle = -Math.PI/2;
            drawText({params:state.labels.xPrimary, x, y, angle});
        }
    }

    function drawText({params, x, y, angle} : Draw_Text_Props){
        state.context.canvas.save();
        state.context.canvas.translate(x, y);
        state.context.canvas.rotate(angle);
        state.context.canvas.font = params.font;
        state.context.canvas.textAlign = params.position;
        if(params.filled){
            state.context.canvas.fillStyle = params.color;
            state.context.canvas.fillText(params.text, 0, 0);
        }
        else{
            state.context.canvas.strokeStyle = params.color;
            state.context.canvas.strokeText(params.text, 0, 0);    
        }
        state.context.canvas.restore();
    }

    return {
        compute,
        draw
    }
}

export default Labels;