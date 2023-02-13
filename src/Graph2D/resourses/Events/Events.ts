import { Axis_Obj } from "../../../tools/Axis_Obj/Axis_Obj_Types";
import { Axis_Property, Graph2D, Method_Generator } from "../../Graph2D_Types";
import { Aspect_Ratio, Events, Pointer_Move, Pointer_Zoom } from "./Events_Types";

function Events({state, graphHandler} : Method_Generator) : Events {

//----------- Pointer Move Down ---------------

    function pointerDown(e : PointerEvent){     
        if(inClientRect(e.clientX, e.clientY)){
            if(pointerMoveOptions.pointerCapture)
                state.canvasElement.setPointerCapture(e.pointerId);
            lastCoordinates.x = e.clientX;
            lastCoordinates.y = e.clientY;
            state.canvasElement.removeEventListener("pointermove", pointerMoveOnStyle);
            state.canvasElement.addEventListener("pointermove", pointerMoveOnMove);
            state.canvasElement.style.cursor = pointerMoveOptions.moveCursor;
        }
    }

//---------------------------------------------
//------------ Pointer Move Move --------------
    
function pointerMoveOnMove(e:PointerEvent){
    moveOnPointer({x:e.clientX, y:e.clientY});
}

//---------------------------------------------
//------------- Pointer Move Up ---------------

function pointerMoveOnUp(){
    state.canvasElement.style.cursor = pointerMoveOptions.hoverCursor;
    state.canvasElement.removeEventListener("pointermove", pointerMoveOnMove);
    state.canvasElement.addEventListener("pointermove", pointerMoveOnStyle);
}

//---------------------------------------------
//------------- Pointer Move Style ------------

function pointerMoveOnStyle(e : PointerEvent){
    if(inClientRect(e.clientX, e.clientY)){
        state.canvasElement.style.cursor = pointerMoveOptions.hoverCursor;
        return;
    }
    state.canvasElement.style.cursor = pointerMoveOptions.defaultCursor;
}

//---------------------------------------------
//------------- In Client Rect ----------------

function inClientRect(x:number, y:number) : boolean{
    const canvasRect = state.canvasElement.getBoundingClientRect();
    const pointerX = Math.round(x - canvasRect.x);
    const pointerY = Math.round(y - canvasRect.y);
    const minX = state.context.clientRect.x;
    const maxX = minX + state.context.clientRect.width;
    const minY = state.context.clientRect.y;
    const maxY = minY + state.context.clientRect.height;

    return pointerX>=minX && pointerX<=maxX && pointerY>=minY && pointerY<=maxY
}

//---------------------------------------------
//--------------- Throttle --------------------

function throttle<T>(func : (args:T)=>void, delay:number) : (args:T)=>void{
    let shouldWait = false;
    let lastArgs : T | null;
    const timeoutFunction = ()=>{
        if(lastArgs == null)
            shouldWait = false;
        else{
            func(lastArgs);
            lastArgs = null;
            setTimeout(timeoutFunction, delay);
        }
    }

    return (args:T)=>{
        if(shouldWait){
            lastArgs = args;
            return;
        }

        func(args);
        shouldWait = true;
        setTimeout(timeoutFunction, delay);
    }
}

//---------------------------------------------
























//-------------- Aspect Ratio -----------------

    function aspectRatio({ratio, axis="y", anchor="start"} : Aspect_Ratio) : Graph2D{
        const fixpoint = typeof anchor === "number"? anchor : state.axis[axis][anchor];
        
        if(state.axis.type === "log-log"){
            const xPositions = (state.axisObj.primary.obj as Axis_Property<Axis_Obj>).x.positions;
            const xMagnitudeLeap = Math.abs(Math.floor(Math.log10(Math.abs(xPositions[1]))) - Math.floor(Math.log10(Math.abs(xPositions[0]))));
            const rangeWidth = Math.abs(state.scale.primary.x.map(xPositions[1]) - state.scale.primary.x.map(xPositions[0]));
            const yPositions = (state.axisObj.primary.obj as Axis_Property<Axis_Obj>).y.positions;
            const yMagnitudeLeap = Math.abs(Math.floor(Math.log10(Math.abs(yPositions[1]))) - Math.floor(Math.log10(Math.abs(yPositions[0]))));
            const rangeHeight = Math.abs(state.scale.primary.y.map(yPositions[1]) - state.scale.primary.y.map(yPositions[0]));
            
            if(axis==="x"){
                const newMagnitedeLeap = rangeWidth/rangeHeight * yMagnitudeLeap*ratio;
                const m = newMagnitedeLeap/xMagnitudeLeap;
                if(state.axis.x.start > 0 && state.axis.x.start > 0){
                    state.axis.x.start = Math.pow(10, m*(Math.log10(Math.abs(state.axis.x.start)) - Math.log10(Math.abs(fixpoint))) + Math.log10(Math.abs(fixpoint)));
                    state.axis.x.end = Math.pow(10, m*(Math.log10(Math.abs(state.axis.x.end)) - Math.log10(Math.abs(fixpoint))) + Math.log10(Math.abs(fixpoint)));
                }
                if(state.axis.x.start < 0 && state.axis.x.start < 0){
                    state.axis.x.start = -Math.pow(10, m*(Math.log10(Math.abs(state.axis.x.start)) - Math.log10(Math.abs(fixpoint))) + Math.log10(Math.abs(fixpoint)));
                    state.axis.x.end = -Math.pow(10, m*(Math.log10(Math.abs(state.axis.x.end)) - Math.log10(Math.abs(fixpoint))) + Math.log10(Math.abs(fixpoint)));
                }
            }
            if(axis==="y"){
                const newMagnitedeLeap = rangeHeight/rangeWidth * xMagnitudeLeap/ratio;
                const m = newMagnitedeLeap/yMagnitudeLeap;
                if(state.axis.y.start>0 && state.axis.y.end >0){
                    state.axis.y.start = Math.pow(10, m*(Math.log10(Math.abs(state.axis.y.start)) - Math.log10(Math.abs(fixpoint))) + Math.log10(Math.abs(fixpoint)));
                    state.axis.y.end = Math.pow(10, m*(Math.log10(Math.abs(state.axis.y.end)) - Math.log10(Math.abs(fixpoint))) + Math.log10(Math.abs(fixpoint)));
                }
                if(state.axis.y.start<0 && state.axis.y.end <0){
                    state.axis.y.start = -Math.pow(10, m*(Math.log10(Math.abs(state.axis.y.start)) - Math.log10(Math.abs(fixpoint))) + Math.log10(Math.abs(fixpoint)));
                    state.axis.y.end = -Math.pow(10, m*(Math.log10(Math.abs(state.axis.y.end)) - Math.log10(Math.abs(fixpoint))) + Math.log10(Math.abs(fixpoint)));    
                }
            }
        }
        else{
            const domainWidth = Math.abs(state.axis.x.end - state.axis.x.start);
            const domainHeight = Math.abs(state.axis.y.end - state.axis.y.start);
            
            if(axis === "x"){
                const newWidth = state.context.clientRect.width/state.context.clientRect.height * domainHeight*ratio;  
                const m = newWidth/domainWidth;
                state.axis.x.start = m*(state.axis.x.start - fixpoint) + fixpoint;
                state.axis.x.end = m*(state.axis.x.end - fixpoint) + fixpoint;      
            }
    
            if(axis === "y"){
                const newHeight = state.context.clientRect.height/state.context.clientRect.width * domainWidth/ratio;
                const m = newHeight/domainHeight;
                state.axis.y.start = m*(state.axis.y.start - fixpoint) + fixpoint;
                state.axis.y.end = m*(state.axis.y.end - fixpoint) + fixpoint;
            }
        }
        
        state.compute.client();
        state.draw.client();

        return graphHandler;
    }

//---------------------------------------------
//------------- Pointer Move ------------------

    function pointerMove(props : Partial<Pointer_Move_Props>) : Graph2D{
        pointerMoveOptions = {...defaultPointerMove, ...props};

        state.canvasElement.removeEventListener("pointerdown", pointerMoveOnDown);
        state.canvasElement.removeEventListener("pointerup", pointerMoveOnUp);
        state.canvasElement.removeEventListener("pointermove", pointerMoveOnStyle);
        state.canvasElement.style.cursor = pointerMoveOptions.defaultCursor;

        if(pointerMoveOptions.enable){
            state.canvasElement.style.touchAction = "none"
            state.canvasElement.addEventListener("pointerdown", pointerMoveOnDown);
            state.canvasElement.addEventListener("pointerup", pointerMoveOnUp);
            state.canvasElement.addEventListener("pointermove", pointerMoveOnStyle);
            
            moveOnPointer = throttle<Move_Graph>(({x,y})=>{

                if(state.scale.primary.x.type === "linear"){
                    const xDisplacement = state.scale.primary.x.invert(lastCoordinates.x) - state.scale.primary.x.invert(x);
                    state.axis.x.start += xDisplacement;
                    state.axis.x.end += xDisplacement;
                }
                if(state.scale.primary.x.type === "log"){
                    const xDisplacement = Math.log10(Math.abs(state.scale.primary.x.invert(lastCoordinates.x))) - Math.log10(Math.abs(state.scale.primary.x.invert(x)));
                    state.axis.x.start *= Math.pow(10 , xDisplacement);
                    state.axis.x.end *= Math.pow(10 , xDisplacement);
                }
                
                if(state.scale.primary.y.type === "linear"){
                    const yDisplacement = state.scale.primary.y.invert(lastCoordinates.y) - state.scale.primary.y.invert(y);
                    state.axis.y.start += yDisplacement;
                    state.axis.y.end += yDisplacement;
                }
                if(state.scale.primary.y.type === "log"){
                    const yDisplacement = Math.log10(Math.abs(state.scale.primary.y.invert(lastCoordinates.y))) - Math.log10(Math.abs(state.scale.primary.y.invert(y)));
                    state.axis.y.start *= Math.pow(10 , yDisplacement);
                    state.axis.y.end *= Math.pow(10 , yDisplacement);
                }
        
                lastCoordinates.x = x;
                lastCoordinates.y = y;
        
        
                state.compute.client();
                if(pointerMoveOptions.callback != null) pointerMoveOptions.callback(graphHandler);
                state.draw.client();
        
            }, pointerMoveOptions.delay);
        }
        

        return graphHandler;
    }

//--------------------------------------------
//--------------- Pointer Zoom ----------------

    function pointerZoom({} : Pointer_Move_Props){

    }

//---------------------------------------------


    return {
        aspectRatio,
        pointerMove
    };
}

export default Events;