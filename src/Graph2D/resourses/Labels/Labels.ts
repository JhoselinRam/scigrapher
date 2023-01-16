import { Method_Generator } from "../../Graph2D_Types";
import { Draw_Text_Props, Get_Coords_Props, Labels } from "./Labels_Types";

function Labels({state, graphHandler}:Method_Generator) : Labels{
    const offset = 5;
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
        const height = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
        
        return height;
    }

//---------------------------------------------
//---------------------------------------------

    function draw(){
        const heights = {
            title : 0,
            subtitle : 0,
            xPrimary : 0,
            yPrimary : 0,
            xSecondary : 0,
            ySecondary : 0,

        };

        if(state.labels.title != null){
            heights.title = getTextHeight(state.labels.title.text, state.labels.title.font);
            const position = state.labels.title.position;
            const [x, y, angle] = getCoords({heights, position, label:"title"});
            
            drawText({params:state.labels.title, x, y, angle});
        }
        if(state.labels.subtitle != null){
            heights.subtitle = getTextHeight(state.labels.subtitle.text, state.labels.subtitle.font);
            const position = state.labels.subtitle.position;
            const [x, y, angle] = getCoords({heights, position, label:"subtitle"});

            drawText({params:state.labels.subtitle, x, y, angle});
        }
        if(state.labels.xPrimary != null){
            heights.xPrimary = getTextHeight(state.labels.xPrimary.text, state.labels.xPrimary.font);
            const position = state.labels.xPrimary.position;
            const [x, y, angle] = getCoords({heights, position, label:"xPrimary"});
            
            drawText({params:state.labels.xPrimary, x, y, angle});
        }
        if(state.labels.yPrimary != null){
            heights.yPrimary = getTextHeight(state.labels.yPrimary.text, state.labels.yPrimary.font);
            const position = state.labels.yPrimary.position;
            const [x, y, angle] = getCoords({heights, position, label:"yPrimary"});
            
            drawText({params:state.labels.yPrimary, x, y, angle});
        }
        if(state.labels.xSecondary != null){
            heights.xSecondary = getTextHeight(state.labels.xSecondary.text, state.labels.xSecondary.font);
            const position = state.labels.xSecondary.position;
            const [x, y, angle] = getCoords({heights, position, label:"xSecondary"});
            
            drawText({params:state.labels.xSecondary, x, y, angle});
        }
        if(state.labels.ySecondary != null){
            heights.ySecondary = getTextHeight(state.labels.ySecondary.text, state.labels.ySecondary.font);
            const position = state.labels.ySecondary.position;
            const [x, y, angle] = getCoords({heights, position, label:"ySecondary"});
            
            drawText({params:state.labels.ySecondary, x, y, angle});
        }
    }

//---------------------------------------------

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

//---------------------------------------------

    function getCoords({heights, label, position}:Get_Coords_Props) : [number, number, number]{
        let x : number = 0;
        let y : number = 0;
        let angle : number = 0;

        switch(label){
            case "title":
                x = position === "start" ? offset : 
                    (position === "center" ? state.container.clientWidth / 2 :
                    state.container.clientWidth - offset);
                y = heights.title + offset;
                
                break;

            case "subtitle":
                x = position === "start" ? offset : 
                    (position === "center" ? state.container.clientWidth / 2 :
                    state.container.clientWidth - offset);
                y = heights.title + heights.subtitle + 2*offset;
                break;

            case "xPrimary":
                if(state.axis.position === "bottomLeft" || state.axis.position === "topLeft"){
                    x = heights.xPrimary + offset;
                    y = position === "start" ? state.container.clientHeight - offset : 
                        (position === "center" ? state.container.clientHeight - (state.container.clientHeight - heights.title - heights.subtitle) / 2 :
                        heights.title + heights.subtitle + 2*offset);
                    angle = -Math.PI/2;
                }
                if(state.axis.position === "bottomRight" || state.axis.position === "topRight"){
                    x = state.container.clientWidth - heights.xPrimary - offset;
                    y = position === "start" ? heights.title + heights.subtitle + 2*offset : 
                        (position === "center" ? state.container.clientHeight - (state.container.clientHeight - heights.title - heights.subtitle) / 2 : 
                        state.container.clientHeight - offset);
                    angle = Math.PI/2;
                }
                break;

            case "yPrimary":
                if(state.axis.position === "bottomLeft" || state.axis.position === "bottomRight"){
                    
                }
                break;

            case "xSecondary":
                break;

            case "ySecondary":
                break;
        }
        

        
        return [x, y, angle];
    }

//---------------------------------------------

    return {
        compute,
        draw
    }
}

export default Labels;