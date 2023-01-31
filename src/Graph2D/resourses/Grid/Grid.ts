import { Method_Generator } from "../../Graph2D_Types";
import { Grid } from "./Grid_Types";
import PrimaryGrid from "./Primary/Grid_Primary.js";

function Grid(props : Method_Generator) : Grid {
    const primaryGrid = PrimaryGrid(props);

//----------------- Draw ----------------------

    function draw(){
        primaryGrid.draw();
    }

//---------------------------------------------

    return {
        draw
    }

}

export default Grid;