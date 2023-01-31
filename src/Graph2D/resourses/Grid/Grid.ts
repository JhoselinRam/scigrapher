import { Method_Generator } from "../../Graph2D_Types";
import { Grid } from "./Grid_Types";
import PrimaryGrid from "./Primary/Grid_Primary.js";

function Grid(props : Method_Generator) : Grid {
    const primaryGrid = PrimaryGrid(props, getLineDash);

//----------------- Draw ----------------------

    function draw(){
        primaryGrid.draw();
    }

//---------------------------------------------
//------------- Get Line Dash -----------------

    function getLineDash(style : string) : Array<number> {
        let lineDash : Array<number> = [];

        switch(style){
            case "dot":
                lineDash = [2, 3];
                break;
            
            case "dash":
                lineDash = [5, 3];
                break;
            
            case "long-dash":
                lineDash = [8, 3];
                break;

            case "dash-dot":
                lineDash = [5, 3, 2, 3];
                break;

            case "dash-2dot":
                lineDash = [6, 3, 2, 3, 2, 3];
                break;
            
            default:
                lineDash = style.split(" ").map(item=>parseInt(item));
                break;
        }



        return lineDash;
    }

//---------------------------------------------

    return {
        draw
    }

}

export default Grid;