import { Graph2D_State, Rect } from "../../Graph2D/Graph2D_Types";

//------------- Get Line Dash -----------------
export function getLineDash(style : string) : Array<number> {
    let lineDash : Array<number> //style = "solid";

    switch(style){
        case "solid":
            lineDash = [];
            break;

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
//-------------- Is Callable ------------------

export function isCallable(candidate : unknown) :  candidate is Function{
    return typeof candidate === "function";
}

//---------------------------------------------
//--------------- Linspace --------------------

export function linspace(start:number, end:number, n:number) : Array<number> {
    const ans : Array<number> = [];
    const delta = (end - start)/(n-1);
    
    for(let i=0; i<n; i++)
        ans.push(start+i*delta);

    return ans;
}

//---------------------------------------------
//--------------- Meshgrid --------------------
export interface Mesh_Axis_Generator {start:number, end:number, n:number};
export type Mesgrid = [Array<Array<number>>, Array<Array<number>>];

export function meshgrid(x:Array<number>, y:Array<number>) : Mesgrid;
export function meshgrid(x:Mesh_Axis_Generator, y:Mesh_Axis_Generator) : Mesgrid;
export function meshgrid(x:Array<number> | Mesh_Axis_Generator, y:Array<number> | Mesh_Axis_Generator) : Mesgrid{
    const xMesh : Array<Array<number>> = [];
    const yMesh : Array<Array<number>> = [];
    const xCoords = Array.isArray(x)? x : linspace(x.start, x.end, x.n);
    const yCoords = Array.isArray(y)? y : linspace(y.start, y.end, y.n);
    yCoords.reverse();

    for(let j=0; j<yCoords.length; j++){
        xMesh.push(xCoords.slice());
        yMesh.push([]);
        for(let i=0; i<xCoords.length; i++)
            yMesh[j].push(yCoords[j]);
    }


    return [xMesh, yMesh];
}

//---------------------------------------------