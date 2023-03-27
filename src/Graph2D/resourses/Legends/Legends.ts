import newLegend from "../../../Legend/Legend.js";
import { Legend, Legend_Options } from "../../../Legend/Legend_Types";
import { Graph2D, graphCallback, Method_Generator } from "../../Graph2D_Types";
import { Legends } from "./Legends_Types";

function Legends({graphHandler, state} : Method_Generator) : Legends {

//--------------- Add Legend ------------------

    function addLegend(options : Partial<Legend_Options> = {}, callback?:graphCallback) : Legend{
        const [legend, draw, save] = newLegend(options, state, graphHandler);

        state.legends.push({ legend, draw, save });
        
        if(callback != null) callback(graphHandler);
        state.dirty.data = true;

        return legend;
    }

//---------------------------------------------
//-------------- Remove Legend ----------------

    function removeLegend(id : string, callback?:graphCallback) : Graph2D{
        state.legends = state.legends.filter(item=>item.legend.id() !== id);

        if(callback != null) callback(graphHandler);
        state.dirty.data = true;

        return graphHandler;
    }

//---------------------------------------------
//-------------- Get Legends ------------------

    function getLegends() : Array<Legend>{
        return state.legends.map(item=>item.legend);
    }

//---------------------------------------------

    return {
        addLegend, 
        removeLegend,
        getLegends
    }
}

export default Legends