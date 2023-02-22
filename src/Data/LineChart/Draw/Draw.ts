import { Graph2D_State, Rect } from "../../../Graph2D/Graph2D_Types";
import { getLineDash } from "../../../tools/Helplers/Helplers.js";
import { Mapping } from "../../../tools/Mapping/Mapping_Types";
import { Line_Chart_Method_Generator } from "../LineChart_Types";
import { Draw, Draw_Helper_Props, Interpret_Coords_Props } from "./Draw_Types";

function Draw({dataHandler, dataState} : Line_Chart_Method_Generator) : Draw{

//--------------- Draw Data -------------------

    function _drawData(state : Graph2D_State){
        //Guard conditions
        if(dataState.useAxis.x === "secondary" && state.scale.secondary.x == null){
            console.error("Dataset uses secondary x axis, but it's not defined yet");
            return;
        }
        if(dataState.useAxis.y === "secondary" && state.scale.secondary.y == null){
            console.error("Dataset uses secondary y axis, but it's not defined yet");
            return;
        }

        const xScale = dataState.useAxis.x === "primary"? state.scale.primary.x : state.scale.secondary.x as Mapping;
        const yScale = dataState.useAxis.y === "primary"? state.scale.primary.y : state.scale.secondary.y as Mapping;
        const [xPositions, yPositions] = interpretCoordinates({xScale, yScale, dataState});

        if(dataState.line.enable)
            drawLines({state, dataState, xPositions, yPositions});
        if(dataState.marker.enable)
            drawMarkers({state, dataState, xPositions, yPositions});

    }

//---------------------------------------------

    return {
        _drawData
    }

}

export default Draw;





//--------------- Draw Lines ------------------

function drawLines({xPositions, yPositions, state, dataState} : Draw_Helper_Props){
    const clipRect = getClipRect(state);
    
    state.context.data.save();
    state.context.data.beginPath();
    state.context.data.rect(clipRect.x, clipRect.y, clipRect.width, clipRect.height);
    state.context.data.clip();
    state.context.data.translate(state.context.clientRect.x, state.context.clientRect.y);

    state.context.data.strokeStyle = dataState.line.color;
    state.context.data.globalAlpha = dataState.line.opacity;
    state.context.data.lineWidth = dataState.line.width;
    state.context.data.setLineDash(getLineDash(dataState.line.style));
    state.context.data.beginPath();
    state.context.data.moveTo(xPositions[0], yPositions[0]);
    xPositions.forEach((x,i)=>{
        if(i === 0) return;
        const y = yPositions[i];
        state.context.data.lineTo(x ,y);
    });
    state.context.data.stroke();
    
    


    state.context.data.restore();
}

//---------------------------------------------
//------------- Draw Markers ------------------

function drawMarkers({xPositions, yPositions, state, dataState} : Draw_Helper_Props){

}

//---------------------------------------------
//--------- Interpret Coordinates -------------

function interpretCoordinates({xScale, yScale, dataState} : Interpret_Coords_Props) : [Array<number>, Array<number>]{
    let xPositions : Array<number> = [];
    let yPositions : Array<number> = [];
    const xData = isCallable(dataState.x)? dataState.x() : dataState.x;
    const yData = isCallable(dataState.y)? dataState.y() : dataState.y;

    //Some warning
    if(xData.length !== yData.length) console.error("Length of x and y data arrays are different, this may led to undefined behavior")

    if(dataState.polar){
        xData.forEach((x, i)=>{
            const y = yData[i];

            xPositions.push(xScale.map(x*Math.cos(y)));
            yPositions.push(yScale.map(x*Math.sin(y)));
        });
    }else{
        xPositions = xData.map(point => xScale.map(point));
        yPositions = yData.map(point => yScale.map(point));
    }

    return [xPositions, yPositions];
}

//---------------------------------------------
//-------------- Is Callable ------------------

function isCallable(candidate : unknown) :  candidate is Function{
    return typeof candidate === "function";
}

//---------------------------------------------
//------------- Get Clip Rect------------------

function getClipRect(state : Graph2D_State):Rect{
    const initialRect = {...state.context.graphRect()};
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