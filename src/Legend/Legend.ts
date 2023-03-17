import { Graph2D, Graph2D_State, RecursivePartial } from "../Graph2D/Graph2D_Types";
import ComputeLegend from "./Compute_Legend/Compute_Legend.js";
import LegendDraw from "./Draw_Legend/Draw_Legend.js";
import { Legend, Legend_Options, Legend_State } from "./Legend_Types";

function legend(options : RecursivePartial<Legend_Options>, state : Graph2D_State, graphHandler : Graph2D ) : [Legend, ()=>void/*draw*/ , ()=>void/*compute*/]{
//---------------------------------------------
    //State of the legend
    const legendState : Legend_State = {
        id : crypto.randomUUID()
    }


    //Main handler object
    const legendHandler : Partial<Legend> = {};

    //Method generators
    const draw = LegendDraw({legendHandler:legendHandler as Legend, legendState, state, graphHandler});
    const compute = ComputeLegend({legendHandler:legendHandler as Legend, legendState, state, graphHandler});


    //Main object population
    legendHandler.id = ()=>legendState.id;


//---------------------------------------------

    return [legendHandler as Legend, draw.draw, compute.compute];
}

export default legend;