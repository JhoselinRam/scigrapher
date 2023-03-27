import { getLineDash } from "../../../tools/Helplers/Helplers.js";
import { Axis_Property, BorderProperties, Graph2D, graphCallback, Method_Generator } from "../../Graph2D_Types";
import { Border, Border_Modifier, Draw_Border } from "./Border_Types";

function Border({graphHandler, state}:Method_Generator) : Border{

//----------------- Draw ----------------------

    function draw(){
        const graphRect = state.context.graphRect();
        
        state.context.canvas.save();
        state.context.canvas.translate(graphRect.x, graphRect.y);

        if(state.border.x.start.enable)
            drawBorder({context:state.context.canvas, border:state.border.x.start, from:[0,0], to:[0, graphRect.height]});
            
        if(state.border.x.end.enable)
            drawBorder({context:state.context.canvas, border:state.border.x.end, from:[graphRect.width,0], to:[graphRect.width, graphRect.height]});
            
        if(state.border.y.start.enable)
            drawBorder({context:state.context.canvas, border:state.border.y.start, from:[0,graphRect.height], to:[graphRect.width, graphRect.height]});
            
        if(state.border.y.end.enable)
            drawBorder({context:state.context.canvas, border:state.border.y.end, from:[0,0], to:[graphRect.width, 0]});

        state.context.canvas.restore();
    }

//---------------------------------------------
//-------------- Draw Border ------------------

    function drawBorder({border, context, from, to} : Draw_Border){
        const xStart = Math.round(from[0]) + border.width%2 * 0.5;
        const xEnd = Math.round(to[0]) + border.width%2 * 0.5;
        const yStart = Math.round(from[1]) + border.width%2 * 0.5;
        const yEnd = Math.round(to[1]) + border.width%2 * 0.5;

        context.strokeStyle = border.color;
        context.globalAlpha = border.opacity;
        context.lineWidth = border.width;
        context.setLineDash(getLineDash(border.style));
        context.beginPath();
        context.moveTo(xStart, yStart);
        context.lineTo(xEnd, yEnd);
        context.stroke();
    }

//---------------------------------------------












//---------- Customization Methods ------------
//---------------- Border ---------------------

    function border(border : Border_Modifier, callback?:graphCallback) : Graph2D;
    function border(arg : void) : Axis_Property<{start : BorderProperties, end : BorderProperties}>;
    function border(border : Border_Modifier | void, callback?:graphCallback) : Graph2D | Axis_Property<{start : BorderProperties, end : BorderProperties}> | undefined{
        if(typeof border === "undefined" && callback==null)
            return {...state.border}

        if(typeof border === "object"){
            
            if(border.border != null){
                state.border.x.start = {...state.border.x.start, ...border.border};
                state.border.x.end = {...state.border.x.end, ...border.border};
                state.border.y.start = {...state.border.y.start, ...border.border};
                state.border.y.end = {...state.border.y.end, ...border.border};
            }

            if(border.x?.start != null) state.border.x.start = {...state.border.x.start, ...border.x.start};
            if(border.x?.end != null) state.border.x.end = {...state.border.x.end, ...border.x.end};
            if(border.y?.start != null) state.border.y.start = {...state.border.y.start, ...border.y.start};
            if(border.y?.end != null) state.border.y.end = {...state.border.y.end, ...border.y.end};

            if(callback != null) callback(graphHandler);
            state.dirty.client = true;

            return graphHandler;
        }

    }

//---------------------------------------------

    return {
        draw,
        border
    }
}

export default Border;






