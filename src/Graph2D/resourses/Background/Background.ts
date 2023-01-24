import { Graph2D, Method_Generator } from "../../Graph2D_Types";
import { Background } from "./Background_Types";

function Background({state, graphHandler} : Method_Generator) : Background{
    
    //----------------- Draw ---------------------

    function draw(){
        const width = state.container.clientWidth;
        const height = state.container.clientHeight;
  
        state.context.canvas.save();
        state.context.canvas.clearRect(0, 0, width, height);
        state.context.canvas.fillStyle = state.background.color;
        state.context.canvas.globalAlpha = state.background.opacity;
        state.context.canvas.fillRect(0, 0, width, height);
        state.context.canvas.restore();
    }

    //---------------------------------------------
    //------------ Draw Client Rect ---------------
    
    function drawClientRect(){
        const x = state.context.clientRect.x;
        const y = state.context.clientRect.y;
        const width = state.context.clientRect.width;
        const height = state.context.clientRect.height;
        
        state.context.canvas.save();
        state.context.canvas.clearRect(x, y, width, height);
        state.context.canvas.fillStyle = state.background.color;
        state.context.canvas.globalAlpha = state.background.opacity;
        state.context.canvas.fillRect(x, y, width, height);
        state.context.canvas.restore();
    }
    
    //------------------- Color -------------------
    //---------------------------------------------
    
    function backgroundColor(color:string):Graph2D;
    function backgroundColor(arg:void):string;
    function backgroundColor(color : string | void): Graph2D | string | undefined{
        if(typeof color === "undefined")
            return state.background.color;
        
        if(typeof color === "string"){
            if(color === state.background.color) return graphHandler;

            state.background.color = color;
            state.draw.full();

            return graphHandler;    
        }
    }
    //---------------------------------------------
    //------------------ Opacity ------------------

    function backgroundOpacity(opacity:number):Graph2D;
    function backgroundOpacity(arg:void):number;
    function backgroundOpacity(opacity : number | void): Graph2D | number | undefined{
        if(typeof opacity === "undefined")
            return state.background.opacity;
        
        if(typeof opacity === "number"){
            if(opacity === state.background.opacity) return graphHandler;

            state.background.opacity = opacity<0?0:(opacity>1?1:opacity);   //Opacity must be a number between 0 and 1
            state.draw.full();

            return graphHandler;    
        }
    }


    //---------------------------------------------

    return {
        draw,
        drawClientRect,
        backgroundColor,
        backgroundOpacity
    }

}

export default Background;