import ColorBar from "../../../Colorbar/Colorbar.js";
import { Colorbar, Colorbar_Options } from "../../../Colorbar/Colorbar_Types";
import { graphCallback, Method_Generator, RecursivePartial } from "../../Graph2D_Types";
import { Colorbars } from "./Colorbars_Types";

function Colorbars({graphHandler, state} : Method_Generator) : Colorbars{

//--------------- Add Colorbar ----------------

    function addColorbar(options : RecursivePartial<Colorbar_Options> = {}, callback?:graphCallback) : Colorbar{
        const [newBar, draw, compute] = ColorBar(options, state, graphHandler);

        state.colorbars.push({bar:newBar, compute, draw});
        state.compute.client();
        state.dirty.client = true;
        if(callback != null) callback(graphHandler, state.data.map(set=>set.dataset));

        return newBar;
    }

//---------------------------------------------

    return {
        addColorbar
    }
}

export default Colorbars;