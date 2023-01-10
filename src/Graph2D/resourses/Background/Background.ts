import { Graph2D, Method_Generator } from "../../Graph2D_Types";
import { Background } from "./Background_Types";

function Background({state, graphHandler} : Method_Generator) : Background{
    //------------------- Color -------------------
    function backgroundColor(color:string) : Graph2D{
        if(color === state.background.color) return graphHandler;

        state.background.color = color;
        state.container.style.backgroundColor = color;

        return graphHandler;
    }

    function getBackgroundColor() : string{
        return state.background.color;
    }

    //---------------------------------------------
    //------------------ Opacity ------------------

    function opacity(opacity:number) : Graph2D{
        if(opacity === state.background.opacity) return graphHandler;

        state.background.opacity = opacity<0?0:(opacity>1?1:opacity);   //Opacity must be a number between 0 and 1
        state.container.style.opacity = `${state.background.opacity}`;

        return graphHandler;
    }

    function getOpacity() : number{
        return state.background.opacity
    }

    //---------------------------------------------
    


    return {
        backgroundColor,
        getBackgroundColor,
        opacity,
        getOpacity
    }

}

export default Background;