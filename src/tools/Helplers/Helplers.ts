import { Graph2D_State, Rect } from "../../Graph2D/Graph2D_Types";

//------------- Get Line Dash -----------------
export function getLineDash(style : string) : Array<number> {
    let lineDash : Array<number> = [] //style = "solid";

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
//------------- Get Graph Rect------------------

export function getGraphRect(state : Graph2D_State):Rect{
    const initialRect = {...state.context.axisRect()};
    const xSecondaryActive = state.secondary.x != null && state.secondary.x.enable ? 0 : 1;
    const ySecondaryActive = state.secondary.y != null && state.secondary.y.enable ? 0 : 1;

    switch(state.axis.position){
        case "center":
            initialRect.x = 0;
            initialRect.y -= state.margin.y.end;
            initialRect.width += state.margin.x.start + state.margin.x.end;
            initialRect.height += state.margin.y.start + state.margin.y.end;
            break;
            
        case "bottom-left":
            initialRect.y -= xSecondaryActive * state.margin.y.end;
            initialRect.width += ySecondaryActive * state.margin.x.end;
            initialRect.height += xSecondaryActive * state.margin.y.end;
            break;

        case "bottom-right":
            initialRect.x -= ySecondaryActive * state.margin.x.start;
            initialRect.y -= xSecondaryActive * state.margin.y.end;
            initialRect.width += ySecondaryActive * state.margin.x.start;
            initialRect.height += xSecondaryActive * state.margin.y.end;
            break;
        
        case "top-left":
            initialRect.width += ySecondaryActive * state.margin.x.end;
            initialRect.height += xSecondaryActive * state.margin.y.start;
            break;

        case "top-right":
            initialRect.x -= ySecondaryActive * state.margin.x.start;
            initialRect.width += ySecondaryActive * state.margin.x.start;
            initialRect.height += xSecondaryActive * state.margin.y.start;
            break;
        
    }

    return initialRect;
}

//---------------------------------------------