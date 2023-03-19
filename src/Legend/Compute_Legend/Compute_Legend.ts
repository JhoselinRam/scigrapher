import { Legend_Method_Generator } from "../Legend_Types";
import { Compute_Legend } from "./Compute_Legend_Types";

function ComputeLegend({graphHandler, legendHandler, legendState, state} : Legend_Method_Generator) : Compute_Legend {

//---------------------------------------------

    function compute(){
        console.dir(legendState.data)
    }

//---------------------------------------------

    return {
        compute
    }

}

export default ComputeLegend;