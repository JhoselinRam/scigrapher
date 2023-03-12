import { computePositions, createLabels } from "../../../tools/Axis_Obj/Axis_Obj.js";
import mapping from "../../../tools/Mapping/Mapping.js";
import { Graph2D, graphCallback, Method_Generator, RecursivePartial } from "../../Graph2D_Types";
import { Margin, Margin_Props } from "./Margin_Types";

function Margin({state, graphHandler}:Method_Generator) : Margin {
 
//----------------- Compute -------------------

    function compute(){
        
        //First Computes the axis size

        let secondaryAxisHeight = 0;
        let secondaryAxisWidth = 0;
        
        
        const auxScaleX = mapping({
            from:[state.axis.x.start, state.axis.x.end], 
            to:[0, state.context.clientRect.width],
            type : state.axis.type==="x-log"||state.axis.type==="log-log"?"log":"linear"
        });
        const auxPositionsX = computePositions(auxScaleX, state.axis.x.ticks, state.axis.x.minSpacing);
        const labelsX = createLabels(auxPositionsX, "x", state, "primary");
        const axisHeight = labelsX.maxHeight + state.labelOffset + state.axis.x.tickSize;
        
        
        
        const auxScaleY = mapping({
            from:[state.axis.y.start, state.axis.y.end], 
            to:[state.context.clientRect.height, 0],
            type : state.axis.type==="y-log"||state.axis.type==="log-log"?"log":"linear"
        });
        const auxPositionsY = computePositions(auxScaleY, state.axis.y.ticks, state.axis.y.minSpacing);
        const labelsY = createLabels(auxPositionsY, "y", state, "primary");
        const axisWidth = labelsY.maxWidth + state.labelOffset + state.axis.y.tickSize;

        
        if(state.secondary.x != null && state.secondary.x.enable){
            const secondaryScaleX = mapping({
                from:[state.secondary.x.start, state.secondary.x.end], 
                to:[0, state.context.clientRect.width]
            });
            const secondaryPositionsX = computePositions(secondaryScaleX, state.secondary.x.ticks, state.secondary.x.minSpacing);
            const secondaryLabelsX = createLabels(secondaryPositionsX, "x", state, "secondary");

            secondaryAxisHeight = secondaryLabelsX.maxHeight + state.labelOffset + state.secondary.x.tickSize;
        }
        
        if(state.secondary.y != null && state.secondary.y.enable){
            const secondaryScaleY = mapping({
                from:[state.secondary.y.start, state.secondary.y.end], 
                to:[state.context.clientRect.height, 0]
            });
            const secondaryPositionsY = computePositions(secondaryScaleY, state.secondary.y.ticks, state.secondary.y.minSpacing);
            const secondaryLabelsY = createLabels(secondaryPositionsY, "y", state, "secondary");

            secondaryAxisWidth = secondaryLabelsY.maxWidth + state.labelOffset + state.secondary.y.tickSize;
        }
        

        //Axis size
        state.axisObj.primary = {
            width : axisWidth,
            height : axisHeight
        }
        
        state.axisObj.secondary = {
            width : secondaryAxisWidth,
            height : secondaryAxisHeight
        }


        //Compute the margins
        switch(state.axis.position){
            case "center":
                state.marginUsed.x.start = state.margin.x.start === "auto"? 0 : state.margin.x.start;
                state.marginUsed.x.end = state.margin.x.end === "auto"? 0 : state.margin.x.end;
                state.marginUsed.y.start = state.margin.y.start === "auto"? 0 : state.margin.y.start;
                state.marginUsed.y.end = state.margin.y.end === "auto"? 0 : state.margin.y.end;
                break;
                
            case "bottom-left":
                state.marginUsed.x.start = state.margin.x.start === "auto"? state.marginUsed.defaultMargin : state.margin.x.start;
                state.marginUsed.x.end = getOpositeMargin(state.margin.x.end, axisWidth, secondaryAxisWidth, state.marginUsed.defaultMargin);
                state.marginUsed.y.start = state.margin.y.start === "auto"? state.marginUsed.defaultMargin : state.margin.y.start;
                state.marginUsed.y.end = state.margin.y.end==="auto" && (state.labels.title?.enable || state.labels.subtitle?.enable)? state.marginUsed.defaultMargin : getOpositeMargin(state.margin.y.end, axisHeight, secondaryAxisHeight, state.marginUsed.defaultMargin);
                break;
                
            case "bottom-right":
                state.marginUsed.x.start = getOpositeMargin(state.margin.x.start, axisWidth, secondaryAxisWidth, state.marginUsed.defaultMargin);
                state.marginUsed.x.end = state.margin.x.end === "auto"? state.marginUsed.defaultMargin : state.margin.x.end;
                state.marginUsed.y.start = state.margin.y.start === "auto"? state.marginUsed.defaultMargin : state.margin.y.start;
                state.marginUsed.y.end = state.margin.y.end==="auto" && (state.labels.title?.enable || state.labels.subtitle?.enable)? state.marginUsed.defaultMargin : getOpositeMargin(state.margin.y.end, axisHeight, secondaryAxisHeight, state.marginUsed.defaultMargin);
                break;

            case "top-left":
                state.marginUsed.x.start = state.margin.x.start === "auto"? state.marginUsed.defaultMargin : state.margin.x.start;
                state.marginUsed.x.end = getOpositeMargin(state.margin.x.end, axisWidth, secondaryAxisWidth, state.marginUsed.defaultMargin);
                state.marginUsed.y.start = getOpositeMargin(state.margin.y.start, axisHeight, secondaryAxisHeight, state.marginUsed.defaultMargin);
                state.marginUsed.y.end = state.margin.y.end === "auto"? state.marginUsed.defaultMargin : state.margin.y.end;
                break;

            case "top-right":
                state.marginUsed.x.start = getOpositeMargin(state.margin.x.start, axisWidth, secondaryAxisWidth, state.marginUsed.defaultMargin);
                state.marginUsed.x.end = state.margin.x.end === "auto"? state.marginUsed.defaultMargin : state.margin.x.end;
                state.marginUsed.y.start = getOpositeMargin(state.margin.y.start, axisHeight, secondaryAxisHeight, state.marginUsed.defaultMargin);
                state.marginUsed.y.end = state.margin.y.end === "auto"? state.marginUsed.defaultMargin : state.margin.y.end;
                break;

        }
    }

//---------------------------------------------




//----------------- Margin --------------------

    function margin(margins:RecursivePartial<Margin_Props>, callback?:graphCallback):Graph2D;
    function margin(arg:void):Margin_Props;
    function margin(margins:RecursivePartial<Margin_Props> | void, callback?:graphCallback) : Graph2D | Margin_Props | undefined{
        if(typeof margins === "undefined" && callback == null)
            return {
                    x : {...state.marginUsed.x}, 
                    y :{...state.marginUsed.y}
                };

        if(typeof margins === "object"){
            if(margins.x == null && margins.y == null) return graphHandler;
            if(margins.x?.start === state.margin.x.start && margins.x?.end === state.margin.x.end &&
            margins.y?.start === state.margin.y.start && margins.y?.end === state.margin.y.end) 
                return graphHandler;

            if(margins.x?.start != null) state.margin.x.start = margins.x.start; 
            if(margins.x?.end != null) state.margin.x.end = margins.x.end; 
            if(margins.y?.start != null) state.margin.y.start = margins.y.start; 
            if(margins.y?.end != null) state.margin.y.end = margins.y.end; 
            
            state.compute.client();
            if(callback != null) callback(graphHandler, state.data.map(set=>set.dataset));
            state.dirty.client = true;

            return graphHandler;
        }
    }

//---------------------------------------------

    return {
        margin,
        compute
    };

}

export default Margin;






//----------- Get Oposite Margin --------------

function getOpositeMargin(margin:"auto"|number, size:number, secondary:number, defaultSize:number){
    return (margin==="auto" && secondary===0) ? size + defaultSize : margin==="auto"? defaultSize : margin;
}

//---------------------------------------------