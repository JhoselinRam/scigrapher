import { Graph2D, graphCallback, LabelProperties, Method_Generator } from "../../Graph2D_Types";
import { Draw_Text_Props, Get_Coords_Props, Labels, Text_Height_Props } from "./Labels_Types";

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
        
        //Calculate the label height if necessary
        if(state.labels.title != null && state.labels.title.enable) 
            titleHeight = getTextHeight({
                text : state.labels.title.text,
                size : state.labels.title.size, 
                font : state.labels.title.font,
                specifier : state.labels.title.specifier
            });
        if(state.labels.subtitle != null && state.labels.subtitle.enable) 
            subtitleHeight = getTextHeight({
                text : state.labels.subtitle.text,
                size : state.labels.subtitle.size, 
                font : state.labels.subtitle.font,
                specifier : state.labels.subtitle.specifier
            });
        if(state.axis.position !== "center"){
            if(state.labels.xPrimary != null && state.labels.xPrimary.enable) 
                xPrimaryHeight = getTextHeight({
                    text : state.labels.xPrimary.text,
                    size : state.labels.xPrimary.size,
                    font : state.labels.xPrimary.font,
                    specifier : state.labels.xPrimary.specifier
                });
            if(state.labels.yPrimary != null && state.labels.yPrimary.enable) 
                yPrimaryHeight = getTextHeight({
                    text : state.labels.yPrimary.text,
                    size : state.labels.yPrimary.size,
                    font : state.labels.yPrimary.font,
                    specifier : state.labels.yPrimary.specifier
                });
            if(state.labels.xSecondary != null && state.labels.xSecondary.enable) 
                xSecondaryHeight = getTextHeight({
                    text : state.labels.xSecondary.text,
                    size : state.labels.xSecondary.size,
                    font : state.labels.xSecondary.font,
                    specifier : state.labels.xSecondary.specifier
                });
            if(state.labels.ySecondary != null && state.labels.ySecondary.enable)
                ySecondaryHeight = getTextHeight({
                    text : state.labels.ySecondary.text,
                    size : state.labels.ySecondary.size,
                    font : state.labels.ySecondary.font,
                    specifier : state.labels.ySecondary.specifier
                });
        }
        
        //Compute the graph area
        state.context.clientRect.width = state.container.clientWidth - yPrimaryHeight - ySecondaryHeight;
        state.context.clientRect.height = state.container.clientHeight - titleHeight - subtitleHeight - xPrimaryHeight - xSecondaryHeight;
        state.context.clientRect.y = titleHeight + subtitleHeight;
        state.context.clientRect.x = 0;
        switch (state.axis.position) {
            case "bottom-left":
                state.context.clientRect.x = yPrimaryHeight;
                state.context.clientRect.y += xSecondaryHeight;
                break;
                
            case "bottom-right":
                state.context.clientRect.x = ySecondaryHeight;
                state.context.clientRect.y += xSecondaryHeight;
                break;
                
            case "top-left": 
                state.context.clientRect.x = yPrimaryHeight;
                state.context.clientRect.y += xPrimaryHeight;
                break;
                
            case "top-right":
                state.context.clientRect.x = ySecondaryHeight;
                state.context.clientRect.y += xPrimaryHeight;
                break;
        }

        //Adjust to work with integer values
        state.context.clientRect.x = Math.ceil(state.context.clientRect.x);
        state.context.clientRect.y = Math.ceil(state.context.clientRect.y);
        state.context.clientRect.width = Math.floor(state.context.clientRect.width);
        state.context.clientRect.height = Math.floor(state.context.clientRect.height);
        
    }

    function getTextHeight({text, size, font, specifier} : Text_Height_Props) : number {
        state.context.canvas.font = `${specifier} ${size} ${font}`;
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

        if(state.labels.title != null && state.labels.title.enable){
            heights.title = getTextHeight({
                text : state.labels.title.text,
                size : state.labels.title.size, 
                font : state.labels.title.font,
                specifier : state.labels.title.specifier
            });
            const position = state.labels.title.position;
            const [x, y, angle] = getCoords({heights, position, label:"title"});
   
            drawText({params:state.labels.title, x, y, angle});
        }
        if(state.labels.subtitle != null && state.labels.subtitle.enable){
            heights.subtitle = getTextHeight({
                text : state.labels.subtitle.text,
                size : state.labels.subtitle.size, 
                font : state.labels.subtitle.font,
                specifier : state.labels.subtitle.specifier
            });
            const position = state.labels.subtitle.position;
            const [x, y, angle] = getCoords({heights, position, label:"subtitle"});

            drawText({params:state.labels.subtitle, x, y, angle});
        }
        if(state.labels.xPrimary != null && state.labels.xPrimary.enable){
            heights.xPrimary = getTextHeight({
                text : state.labels.xPrimary.text,
                size : state.labels.xPrimary.size,
                font : state.labels.xPrimary.font,
                specifier : state.labels.xPrimary.specifier
            });
            const position = state.labels.xPrimary.position;
            const [x, y, angle] = getCoords({heights, position, label:"xPrimary"});
            
            drawText({params:state.labels.xPrimary, x, y, angle});
        }
        if(state.labels.yPrimary != null && state.labels.yPrimary.enable){
            heights.yPrimary = getTextHeight({
                text : state.labels.yPrimary.text,
                size : state.labels.yPrimary.size,
                font : state.labels.yPrimary.font,
                specifier : state.labels.yPrimary.specifier
            });
            const position = state.labels.yPrimary.position;
            const [x, y, angle] = getCoords({heights, position, label:"yPrimary"});
            
            drawText({params:state.labels.yPrimary, x, y, angle});
        }
        if(state.labels.xSecondary != null && state.labels.xSecondary.enable){
            heights.xSecondary = getTextHeight({
                text : state.labels.xSecondary.text,
                size : state.labels.xSecondary.size,
                font : state.labels.xSecondary.font,
                specifier : state.labels.xSecondary.specifier
            });
            const position = state.labels.xSecondary.position;
            const [x, y, angle] = getCoords({heights, position, label:"xSecondary"});
            
            drawText({params:state.labels.xSecondary, x, y, angle});
        }
        if(state.labels.ySecondary != null && state.labels.ySecondary.enable){
            heights.ySecondary = getTextHeight({
                text : state.labels.ySecondary.text,
                size : state.labels.ySecondary.size,
                font : state.labels.ySecondary.font,
                specifier : state.labels.ySecondary.specifier
            });
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
        state.context.canvas.font = `${params.specifier} ${params.size} ${params.font}`;
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
                    x = position === "start" ? state.context.clientRect.x + offset :
                        (position === "center" ? state.context.clientRect.x + state.context.clientRect.width/2 : 
                        state.context.clientRect.x + state.context.clientRect.width - offset);
                    y = state.container.clientHeight - offset;
                }
                if(state.axis.position === "top-left" || state.axis.position === "top-right"){
                    x = position === "start" ? state.context.clientRect.x + offset :
                        (position === "center" ? state.context.clientRect.x + state.context.clientRect.width/2 : 
                        state.context.clientRect.x + state.context.clientRect.width - offset);
                    y = state.context.clientRect.y - offset;
                }
                break;

            case "yPrimary":
                if(state.axis.position === "bottom-left" || state.axis.position === "top-left"){
                    x = state.context.clientRect.x - offset;
                    y = position === "start" ? state.context.clientRect.y + state.context.clientRect.height - offset : 
                        (position === "center" ? state.context.clientRect.y + state.context.clientRect.height/2 :
                        state.context.clientRect.y + offset);
                    angle = -Math.PI/2;
                }
                if(state.axis.position === "bottom-right" || state.axis.position === "top-right"){
                    x = state.context.clientRect.x + state.context.clientRect.width + offset;
                    y = position === "start" ? state.context.clientRect.y + offset : 
                        (position === "center" ? state.context.clientRect.y + state.context.clientRect.height/2 : 
                        state.context.clientRect.y + state.context.clientRect.height - offset);
                    angle = Math.PI/2;
                }
                break;

            case "xSecondary":
                if(state.axis.position === "bottom-left" || state.axis.position === "bottom-right"){
                    x = position === "start" ? state.context.clientRect.x + offset :
                        (position === "center" ? state.context.clientRect.x + state.context.clientRect.width/2 : 
                        state.context.clientRect.x + state.context.clientRect.width - offset);
                    y = state.context.clientRect.y - offset;
                }
                if(state.axis.position === "top-left" || state.axis.position === "top-right"){
                    x = position === "start" ? state.context.clientRect.x + offset :
                        (position === "center" ? state.context.clientRect.x + state.context.clientRect.width/2 : 
                        state.context.clientRect.x + state.context.clientRect.width - offset);
                    y = state.container.clientHeight - offset;
                }
                break;

            case "ySecondary":
                if(state.axis.position === "bottom-left" || state.axis.position === "top-left"){
                    x = state.context.clientRect.x + state.context.clientRect.width + offset;
                    y = position === "start" ? state.context.clientRect.y + offset : 
                        (position === "center" ? state.context.clientRect.y + state.context.clientRect.height/2 : 
                        state.context.clientRect.y + state.context.clientRect.height - offset);
                    angle = Math.PI/2;
                }
                if(state.axis.position === "bottom-right" || state.axis.position === "top-right"){
                    x = state.context.clientRect.x - offset;
                    y = position === "start" ? state.context.clientRect.y + state.context.clientRect.height - offset : 
                        (position === "center" ? state.context.clientRect.y + state.context.clientRect.height/2 :
                        state.context.clientRect.y + offset);
                    angle = -Math.PI/2;
                }
                break;
        }
    
        return [x, y, angle];
    }

//---------------------------------------------
//---------------------------------------------










    const defaultLabel : LabelProperties = {
        font : "Perpetua, Baskerville, Big Caslon, Palatino Linotype, Palatino, serif",
        size : "15px",
        specifier  : "",
        color : "#000000",
        filled : true,
        opacity : 1,
        position : "center",
        text : "",
        enable : true
    }

//---------- Customization Methods ------------

//----------------- Title ---------------------

    function title(label : Partial<LabelProperties>, callback?:graphCallback) : Graph2D;
    function title(arg : void) : LabelProperties | undefined;
    function title(label : Partial<LabelProperties> | void, callback?:graphCallback) : Graph2D | LabelProperties | undefined{
        if(typeof label === "undefined" && callback == null)
            return state.labels.title == null? undefined : {...state.labels.title};
            
        if(typeof label === "object"){
            const baseLabel : LabelProperties = state.labels.title != null? state.labels.title : {...defaultLabel, size:"25px", position:"start"}; 
            
            const labelArg : LabelProperties = {
                ...baseLabel,
                ...label
            };

            state.labels.title = labelArg;
            state.compute.full();
            if(callback != null) callback(graphHandler);
            state.dirty.full = true;

            return graphHandler;

        }
    }

//---------------------------------------------
//--------------- Subtitle --------------------

    function subtitle(label : Partial<LabelProperties>, callback?:graphCallback) : Graph2D;
    function subtitle(arg : void) : LabelProperties | undefined;
    function subtitle(label : Partial<LabelProperties> | void, callback?:graphCallback) : Graph2D | LabelProperties | undefined{
        if(typeof label === "undefined" && callback == null)
            return state.labels.subtitle == null? undefined : {...state.labels.subtitle};
            
        if(typeof label === "object"){
            const baseLabel : LabelProperties = state.labels.subtitle != null? state.labels.subtitle : {...defaultLabel, position:"start"}; 
            
            const labelArg : LabelProperties = {
                ...baseLabel,
                ...label
            };
            
            state.labels.subtitle = labelArg;
            state.compute.full();
            if(callback != null) callback(graphHandler);
            state.dirty.full = true;

            return graphHandler;

        }
    }

//---------------------------------------------
//--------------- Label x --------------------

    function xLabel(label : Partial<LabelProperties>, callback?:graphCallback) : Graph2D;
    function xLabel(arg : void) : LabelProperties | undefined;
    function xLabel(label : Partial<LabelProperties> | void, callback?:graphCallback) : Graph2D | LabelProperties | undefined{
        if(typeof label === "undefined" && callback == null)
            return state.labels.xPrimary == null? undefined : {...state.labels.xPrimary};
            
        if(typeof label === "object"){
            if(state.axis.position === "center") return graphHandler; //Center positioned axis can´t have labels
            
            const baseLabel : LabelProperties = state.labels.xPrimary != null? state.labels.xPrimary : defaultLabel; 
            
            const labelArg : LabelProperties = {
                ...baseLabel,
                ...label
            };
        
            state.labels.xPrimary = labelArg;
            state.compute.full();
            if(callback != null) callback(graphHandler);
            state.dirty.full = true;

            return graphHandler;

        }
    }

//---------------------------------------------
//--------------- Label y --------------------

    function yLabel(label : Partial<LabelProperties>, callback?:graphCallback) : Graph2D;
    function yLabel(arg : void) : LabelProperties | undefined;
    function yLabel(label : Partial<LabelProperties> | void, callback?:graphCallback) : Graph2D | LabelProperties | undefined{
        if(typeof label === "undefined" && callback == null)
            return state.labels.yPrimary == null? undefined : {...state.labels.yPrimary};
            
        if(typeof label === "object"){
            if(state.axis.position === "center") return graphHandler; //Center positioned axis can´t have labels
            
            const baseLabel : LabelProperties = state.labels.yPrimary != null? state.labels.yPrimary : defaultLabel; 
            
            const labelArg : LabelProperties = {
                ...baseLabel,
                ...label
            };

            state.labels.yPrimary = labelArg;
            state.compute.full();
            if(callback != null) callback(graphHandler);
            state.dirty.full = true;

            return graphHandler;

        }
    }

//---------------------------------------------
//--------------- Label x secondary --------------------

    function xLabelSecondary(label : Partial<LabelProperties>, callback?:graphCallback) : Graph2D;
    function xLabelSecondary(arg : void) : LabelProperties | undefined;
    function xLabelSecondary(label : Partial<LabelProperties> | void, callback?:graphCallback) : Graph2D | LabelProperties | undefined{
        if(typeof label === "undefined" && callback == null)
            return state.labels.xSecondary == null? undefined : {...state.labels.xSecondary};
            
        if(typeof label === "object"){
            if(state.axis.position === "center") return graphHandler;   //Center positioned axis can´t have labels
            if(state.secondary.x == null || !state.secondary.x.enable) return graphHandler; //If secondary axis dont exist or is disabled

            const baseLabel : LabelProperties = state.labels.xSecondary != null? state.labels.xSecondary : defaultLabel; 
            
            const labelArg : LabelProperties = {
                ...baseLabel,
                ...label
            };

            state.labels.xSecondary = labelArg;
            state.compute.full();
            if(callback != null) callback(graphHandler);
            state.dirty.full = true;

            return graphHandler;

        }
    }

//---------------------------------------------
//--------------- Label y secondary --------------------

    function yLabelSecondary(label : Partial<LabelProperties>, callback?:graphCallback) : Graph2D;
    function yLabelSecondary(arg : void) : LabelProperties | undefined;
    function yLabelSecondary(label : Partial<LabelProperties> | void, callback?:graphCallback) : Graph2D | LabelProperties | undefined{
        if(typeof label === "undefined" && callback == null)
            return state.labels.ySecondary == null? undefined : {...state.labels.ySecondary};
            
        if(typeof label === "object"){
            if(state.axis.position === "center") return graphHandler;   //Center positioned axis can´t have labels
            if(state.secondary.y == null || !state.secondary.y.enable) return graphHandler; //If secondary axis dont exist or is disabled

            const baseLabel : LabelProperties = state.labels.ySecondary != null? state.labels.ySecondary : defaultLabel; 
            
            const labelArg : LabelProperties = {
                ...baseLabel,
                ...label
            };

            state.labels.ySecondary = labelArg;
            state.compute.full();
            if(callback != null) callback(graphHandler);
            state.dirty.full = true;

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