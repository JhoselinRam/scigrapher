import newLegend from "../../../Legend/Legend.js";
import { Legend, Legend_Options } from "../../../Legend/Legend_Types";
import { Graph2D, graphCallback, Method_Generator } from "../../Graph2D_Types";
import { Legends } from "./Legends_Types";

function Legends({graphHandler, state} : Method_Generator) : Legends {

//--------------- Add Legend ------------------

    function addLegend(options : Partial<Legend_Options> = {}, callback?:graphCallback) : Legend{
        const [legend, draw] = newLegend(options, state, graphHandler);

        state.legends.push({ legend, draw });
        
        if(callback != null) callback(graphHandler, state.data.map(item=>item.dataset));
        state.dirty.data = true;

        return legend;
    }

//---------------------------------------------
//-------------- Remove Legend ----------------

    function removeLegend(id : string, callback?:graphCallback) : Graph2D{
        state.legends = state.legends.filter(item=>item.legend.id() !== id);

        if(callback != null) callback(graphHandler, state.data.map(item=>item.dataset));
        state.dirty.data = true;

        return graphHandler;
    }

//---------------------------------------------

    return {
        addLegend, 
        removeLegend
    }
}

export default Legends