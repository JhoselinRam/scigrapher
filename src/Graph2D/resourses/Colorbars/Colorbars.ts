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
        if(callback != null) callback(graphHandler);
        state.dirty.client = true;

        return newBar;
    }

//---------------------------------------------
//------------- Remove Colorbar ---------------

    function removeColorbar(id:string, callback?:graphCallback) : Graph2D{
        const index = state.colorbars.findIndex(item=>item.bar.id() === id);

        if(index === -1)
            return graphHandler;

        state.colorbars.splice(index, 1);
        state.compute.client();
        if(callback != null) callback(graphHandler);
        state.dirty.client = true;

        return graphHandler;
    }

//---------------------------------------------
//------------- Get Colorbars -----------------

    function getColorbars() : Array<Colorbar>{
        return state.colorbars.map(item=>item.bar);
    }

//---------------------------------------------

    return {
        addColorbar,
        removeColorbar,
        getColorbars
    }
}

export default Colorbars;