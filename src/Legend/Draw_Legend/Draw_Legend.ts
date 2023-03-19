import { Legend_Method_Generator } from "../Legend_Types";
import { Legend_Draw } from "./Draw_Legend_Types";

function LegendDraw({graphHandler, legendState, legendHandler, state} : Legend_Method_Generator) : Legend_Draw {

//------------------ Draw ---------------------

    function draw(){
        if(!legendState.enable) return;

        legendState.compute();
    }

//---------------------------------------------

    return {
        draw
    }

}

export default LegendDraw;