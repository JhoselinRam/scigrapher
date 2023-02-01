import { Method_Generator } from "../../Graph2D_Types";
import { Grid } from "./Grid_Types";
import PrimaryGrid from "./Primary/Grid_Primary.js";
import SecondaryGrid from "./Secondary/Grid_Secondary.js";

function Grid(props : Method_Generator) : Grid {
    const primaryGrid = PrimaryGrid({...props, getLineDash, getMinMaxCoords});
    const secondaryGrid = SecondaryGrid({...props, getLineDash, getMinMaxCoords});

//----------------- Draw ----------------------

    function draw(){
        primaryGrid.draw();
        secondaryGrid.draw();
        
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
//----------- Get Min Max Coords --------------

function getMinMaxCoords(axis : "x" | "y") : [number, number]{
    const clientSize = axis==="x"? props.state.context.clientRect.height : props.state.context.clientRect.width;
    const axisSize = axis==="x"? props.state.axisObj.primary.height : props.state.axisObj.primary.width;
    const marginStart = axis==="x"? props.state.margin.y.end : props.state.margin.x.start;
    const marginEnd = axis==="x"? props.state.margin.y.start : props.state.margin.x.end;
    let start = 0;
    let end = clientSize;

    switch(props.state.axis.position){
        case "bottom-left":
            start = axis==="x"? start : marginStart + axisSize;
            end = axis==="x"? clientSize - marginEnd - axisSize : end;
            break;

        case "bottom-right":
            end = clientSize - marginStart - axisSize;
            break;
        
        case "top-left":
            start = marginStart + axisSize;
            break;

        case "top-right":
            start = axis==="x"? marginStart + axisSize : start;
            end = axis==="x"? end : clientSize - marginEnd - axisSize;
            break;
    }

    return [start, end];
}

//---------------------------------------------

    return {
        draw
    }

}

export default Grid;