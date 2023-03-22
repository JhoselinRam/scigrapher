import ColorBar from "../../../Colorbar/Colorbar.js";
import { Colorbar, Colorbar_Options } from "../../../Colorbar/Colorbar_Types";
import { Graph2D, graphCallback, Method_Generator, RecursivePartial } from "../../Graph2D_Types";
import { Colorbars } from "./Colorbars_Types";

function Colorbars({graphHandler, state} : Method_Generator) : Colorbars{

//--------------- Add Colorbar ----------------

    function addColorbar(options : RecursivePartial<Colorbar_Options> = {}, callback?:graphCallback) : Colorbar{
        const [newBar, draw, compute, save] = ColorBar(options, state, graphHandler);

        state.colorbars.push({bar:newBar, compute, draw, save});
        state.compute.client();
        if(callback != null) callback(graphHandler, state.data.map(set=>set.dataset));
        state.dirty.client = true;

        return newBar;
    }

//---------------------------------------------
//------------- Remove Colorbar ---------------

    function removeColorbar(id:string, callback?:graphCallback) : Graph2D{
        
        state.colorbars = state.colorbars.filter(item=>item.bar.id()!==id);

        state.compute.client();
        if(callback != null) callback(graphHandler, state.data.map(set=>set.dataset));
        state.dirty.client = true;

        return graphHandler;
    }

//---------------------------------------------

    return {
        addColorbar,
        removeColorbar
    }
}

export default Colorbars;