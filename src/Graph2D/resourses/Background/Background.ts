import { Graph2D, Method_Generator } from "../../Graph2D_Types";
import { Background } from "./Background_Types";

function Background({state, graphHandler} : Method_Generator) : Background{
    //------------------- Color -------------------
    
    function backgroundColor(color:string):Graph2D;
    function backgroundColor(arg:void):string;
    function backgroundColor(color : string | void): Graph2D | string | undefined{
        if(typeof color === null)
            return state.background.color;
        
        if(typeof color === "string"){
            if(color === state.background.color) return graphHandler;

            state.background.color = color;
            state.container.style.backgroundColor = color;

            return graphHandler;    
        }
    }
    //---------------------------------------------
    //------------------ Opacity ------------------

    function backgroundOpacity(opacity:number):Graph2D;
    function backgroundOpacity(arg:void):number;
    function backgroundOpacity(opacity : number | void): Graph2D | number | undefined{
        if(typeof opacity === null)
            return state.background.opacity;
        
        if(typeof opacity === "number"){
            if(opacity === state.background.opacity) return graphHandler;

            state.background.opacity = opacity<0?0:(opacity>1?1:opacity);   //Opacity must be a number between 0 and 1
            state.container.style.opacity = `${state.background.opacity}`;

            return graphHandler;    
        }
    }

    //---------------------------------------------
    


    return {
        backgroundColor,
        backgroundOpacity
    }

}

export default Background;