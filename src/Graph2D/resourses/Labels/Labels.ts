import { Graph2D, LabelProperties, Method_Generator } from "../../Graph2D_Types";
import { Draw_Text_Props, Get_Coords_Props, Labels, Label_Props } from "./Labels_Types";

function Labels({state, graphHandler}:Method_Generator) : Labels{
    const offset = 4;
//------------- Compute Labels ----------------

    function compute(){
        let titleHeight = 0;
        let subtitleHeight = 0;
        let xPrimaryHeight = 0;
        let yPrimaryHeight = 0;
        let xSecondaryHeight = 0;
        let ySecondaryHeight = 0;
        
        if(state.labels.title != null) titleHeight = getTextHeight(state.labels.title.text, state.labels.title.font);
        if(state.labels.subtitle != null) subtitleHeight = getTextHeight(state.labels.subtitle.text, state.labels.subtitle.font);
        if(state.labels.xPrimary != null) xPrimaryHeight = getTextHeight(state.labels.xPrimary.text, state.labels.xPrimary.font);
        if(state.labels.yPrimary != null) yPrimaryHeight = getTextHeight(state.labels.yPrimary.text, state.labels.yPrimary.font);
        if(state.labels.xSecondary != null) xSecondaryHeight = getTextHeight(state.labels.xSecondary.text, state.labels.xSecondary.font);
        if(state.labels.ySecondary != null) ySecondaryHeight = getTextHeight(state.labels.ySecondary.text, state.labels.ySecondary.font);
        
        state.context.drawRect.width = state.container.clientWidth - yPrimaryHeight - ySecondaryHeight;
        state.context.drawRect.height = state.container.clientHeight - titleHeight - subtitleHeight - xPrimaryHeight - xSecondaryHeight;
        switch (state.axis.position) {
            case "bottom-left":
                state.context.drawRect.x = yPrimaryHeight;
                state.context.drawRect.y = titleHeight + subtitleHeight + xSecondaryHeight;
                break;
                
            case "bottom-right":
                state.context.drawRect.x = ySecondaryHeight;
                state.context.drawRect.y = titleHeight + subtitleHeight + xSecondaryHeight;
                break;
                
            case "top-left": 
                state.context.drawRect.x = yPrimaryHeight;
                state.context.drawRect.y = titleHeight + subtitleHeight + xPrimaryHeight;
                break;
                
            case "top-right":
                state.context.drawRect.x = ySecondaryHeight;
                state.context.drawRect.y = titleHeight + subtitleHeight + xPrimaryHeight;
                break;
        }
        

    }

    function getTextHeight(text:string, font:string) : number {
        state.context.canvas.font = font;
        const metrics = state.context.canvas.measureText(text);
        const height = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
        

        return height>0?height+2*offset:0;
    }

//---------------------------------------------
//-------------- Draw Labels ------------------

    function draw(){
        const heights = {
            title : 0,
            subtitle : 0,
            xPrimary : 0,
            yPrimary : 0,
            xSecondary : 0,
            ySecondary : 0,

        };

        state.context.canvas.strokeStyle = "#ff0000";
        state.context.canvas.strokeRect(state.context.drawRect.x, state.context.drawRect.y, state.context.drawRect.width, state.context.drawRect.height);

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
        state.context.canvas.globalAlpha = params.opacity;
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
                y = heights.title - offset;
                
                break;

            case "subtitle":
                x = position === "start" ? offset : 
                    (position === "center" ? state.container.clientWidth / 2 :
                    state.container.clientWidth - offset);
                y = heights.title + heights.subtitle -2*offset;
                break;

            case "xPrimary":
                if(state.axis.position === "bottom-left" || state.axis.position === "bottom-right"){
                    x = position === "start" ? state.context.drawRect.x + offset :
                        (position === "center" ? state.context.drawRect.x + state.context.drawRect.width/2 : 
                        state.context.drawRect.x + state.context.drawRect.width - offset);
                    y = state.container.clientHeight - offset;
                }
                if(state.axis.position === "top-left" || state.axis.position === "top-right"){
                    x = position === "start" ? state.context.drawRect.x + offset :
                        (position === "center" ? state.context.drawRect.x + state.context.drawRect.width/2 : 
                        state.context.drawRect.x + state.context.drawRect.width - offset);
                    y = state.context.drawRect.y - offset;
                }
                break;

            case "yPrimary":
                if(state.axis.position === "bottom-left" || state.axis.position === "top-left"){
                    x = state.context.drawRect.x - offset;
                    y = position === "start" ? state.context.drawRect.y + state.context.drawRect.height - offset : 
                        (position === "center" ? state.context.drawRect.y + state.context.drawRect.height/2 :
                        state.context.drawRect.y + offset);
                    angle = -Math.PI/2;
                }
                if(state.axis.position === "bottom-right" || state.axis.position === "top-right"){
                    x = state.context.drawRect.x + state.context.drawRect.width + offset;
                    y = position === "start" ? state.context.drawRect.y + offset : 
                        (position === "center" ? state.context.drawRect.y + state.context.drawRect.height/2 : 
                        state.context.drawRect.y + state.context.drawRect.height - offset);
                    angle = Math.PI/2;
                }
                break;

            case "xSecondary":
                if(state.axis.position === "bottom-left" || state.axis.position === "bottom-right"){
                    x = position === "start" ? state.context.drawRect.x + offset :
                        (position === "center" ? state.context.drawRect.x + state.context.drawRect.width/2 : 
                        state.context.drawRect.x + state.context.drawRect.width - offset);
                    y = state.context.drawRect.y - offset;
                }
                if(state.axis.position === "top-left" || state.axis.position === "top-right"){
                    x = position === "start" ? state.context.drawRect.x + offset :
                        (position === "center" ? state.context.drawRect.x + state.context.drawRect.width/2 : 
                        state.context.drawRect.x + state.context.drawRect.width - offset);
                    y = state.container.clientHeight - offset;
                }
                break;

            case "ySecondary":
                if(state.axis.position === "bottom-left" || state.axis.position === "top-left"){
                    x = state.context.drawRect.x + state.context.drawRect.width + offset;
                    y = position === "start" ? state.context.drawRect.y + offset : 
                        (position === "center" ? state.context.drawRect.y + state.context.drawRect.height/2 : 
                        state.context.drawRect.y + state.context.drawRect.height - offset);
                    angle = Math.PI/2;
                }
                if(state.axis.position === "bottom-right" || state.axis.position === "top-right"){
                    x = state.context.drawRect.x - offset;
                    y = position === "start" ? state.context.drawRect.y + state.context.drawRect.height - offset : 
                        (position === "center" ? state.context.drawRect.y + state.context.drawRect.height/2 :
                        state.context.drawRect.y + offset);
                    angle = -Math.PI/2;
                }
                break;
        }
    
        return [x, y, angle];
    }

//---------------------------------------------
//---------------------------------------------










    const defaultLabel : LabelProperties = {
        font : "15px Perpetua, Baskerville, Big Caslon, Palatino Linotype, Palatino, serif",
        color : "#000000",
        filled : true,
        opacity : 1,
        position : "center",
        text : ""
    }

//---------- Customization Methods ------------

//----------------- Title ---------------------

    function title(label : Label_Props) : Graph2D;
    function title(arg : void) : LabelProperties;
    function title(label : Label_Props | void) : Graph2D | LabelProperties | undefined{
        if(typeof label === null)
            return state.labels.title;
            
        if(typeof label === "object"){
            if(label.enable!==null && !label.enable){
                delete state.labels.title;
                state.render();
                return graphHandler;
            }
            const labelArg = Object.assign({}, label);
            delete labelArg.enable;
            state.labels.title = Object.assign({}, defaultLabel, {font:"25px Perpetua, Baskerville, Big Caslon, Palatino Linotype, Palatino, serif", position:"start"}, labelArg);

            state.render();

            return graphHandler;

        }
    }

//---------------------------------------------
//--------------- Subtitle --------------------

    function subtitle(label : Label_Props) : Graph2D;
    function subtitle(arg : void) : LabelProperties;
    function subtitle(label : Label_Props | void) : Graph2D | LabelProperties | undefined{
        if(typeof label === null)
            return state.labels.subtitle;
            
        if(typeof label === "object"){
            if(label.enable!==null && !label.enable){
                delete state.labels.subtitle;
                state.render();
                return graphHandler;
            }
            const labelArg = Object.assign({}, label);
            delete labelArg.enable;
            state.labels.subtitle = Object.assign({}, defaultLabel, {position:"start"}, labelArg);

            state.render();

            return graphHandler;

        }
    }

//---------------------------------------------
//--------------- Label x --------------------

    function xLabel(label : Label_Props) : Graph2D;
    function xLabel(arg : void) : LabelProperties;
    function xLabel(label : Label_Props | void) : Graph2D | LabelProperties | undefined{
        if(typeof label === null)
            return state.labels.xPrimary;
            
        if(typeof label === "object"){
            if(state.axis.position === "center") return graphHandler; //Center positioned axis can´t have labels
            if(label.enable!==null && !label.enable){
                delete state.labels.xPrimary;
                state.render();
                return graphHandler;
            }
            const labelArg = Object.assign({}, label);
            delete labelArg.enable;
            state.labels.xPrimary = Object.assign({}, defaultLabel, labelArg);

            state.render();

            return graphHandler;

        }
    }

//---------------------------------------------
//--------------- Label y --------------------

    function yLabel(label : Label_Props) : Graph2D;
    function yLabel(arg : void) : LabelProperties;
    function yLabel(label : Label_Props | void) : Graph2D | LabelProperties | undefined{
        if(typeof label === null)
            return state.labels.yPrimary;
            
        if(typeof label === "object"){
            if(state.axis.position === "center") return graphHandler; //Center positioned axis can´t have labels
            if(label.enable!==null && !label.enable){
                delete state.labels.yPrimary;
                state.render();
                return graphHandler;
            }
            const labelArg = Object.assign({}, label);
            delete labelArg.enable;
            state.labels.yPrimary = Object.assign({}, defaultLabel, labelArg);

            state.render();

            return graphHandler;

        }
    }

//---------------------------------------------
//--------------- Label x secondary --------------------

    function xLabelSecondary(label : Label_Props) : Graph2D;
    function xLabelSecondary(arg : void) : LabelProperties;
    function xLabelSecondary(label : Label_Props | void) : Graph2D | LabelProperties | undefined{
        if(typeof label === null)
            return state.labels.xSecondary;
            
        if(typeof label === "object"){
            if(label.enable!==null && !label.enable){
                delete state.labels.xSecondary;
                state.render();
                return graphHandler;
            }
            const labelArg = Object.assign({}, label);
            delete labelArg.enable;
            state.labels.xSecondary = Object.assign({}, defaultLabel, labelArg);

            state.render();

            return graphHandler;

        }
    }

//---------------------------------------------
//--------------- Label y secondary --------------------

    function yLabelSecondary(label : Label_Props) : Graph2D;
    function yLabelSecondary(arg : void) : LabelProperties;
    function yLabelSecondary(label : Label_Props | void) : Graph2D | LabelProperties | undefined{
        if(typeof label === null)
            return state.labels.ySecondary;
            
        if(typeof label === "object"){
            if(label.enable!==null && !label.enable){
                delete state.labels.ySecondary;
                state.render();
                return graphHandler;
            }
            const labelArg = Object.assign({}, label);
            delete labelArg.enable;
            state.labels.ySecondary = Object.assign({}, defaultLabel, labelArg);

            state.render();

            return graphHandler;

        }
    }

//---------------------------------------------
//---------------------------------------------




    return {
        compute,
        draw,
        title,
        subtitle,
        xLabel,
        yLabel,
        xLabelSecondary,
        yLabelSecondary
    }
}

export default Labels;