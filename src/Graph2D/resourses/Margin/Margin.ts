import { Graph2D, Method_Generator, RecursivePartial } from "../../Graph2D_Types";
import { Margin, Margin_Props } from "./Margin_Types";

function Margin({state, graphHandler}:Method_Generator) : Margin {
 
//----------------- Margin --------------------

    function margin(margins:RecursivePartial<Margin_Props>, callback?:(handler:Graph2D)=>void):Graph2D;
    function margin(arg:void):Margin_Props;
    function margin(margins:RecursivePartial<Margin_Props> | void, callback?:(handler:Graph2D)=>void) : Graph2D | Margin_Props | undefined{
        if(typeof margins === "undefined" && callback == null)
            return {...state.margin};

        if(typeof margins === "object"){
            if(margins.x == null && margins.y == null) return graphHandler;
            if(margins.x?.start === state.margin.x.start && margins.x?.end === state.margin.x.end &&
            margins.y?.start === state.margin.y.start && margins.y?.end === state.margin.y.end) 
                return graphHandler;

            if(margins.x?.start != null) state.margin.x.start = margins.x.start; 
            if(margins.x?.end != null) state.margin.x.end = margins.x.end; 
            if(margins.y?.start != null) state.margin.y.start = margins.y.start; 
            if(margins.y?.end != null) state.margin.y.end = margins.y.end; 
            
            state.compute.client();
            if(callback != null) callback(graphHandler);

            return graphHandler;
        }
    }

//---------------------------------------------

    return {
        margin
    };

}

export default Margin;