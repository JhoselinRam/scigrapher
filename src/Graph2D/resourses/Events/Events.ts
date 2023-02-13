import { Axis_Obj } from "../../../tools/Axis_Obj/Axis_Obj_Types";
import { Axis_Property, Graph2D, Method_Generator } from "../../Graph2D_Types";
import { Aspect_Ratio_Props, Events, Move_Graph, Pointer_Move_Props } from "./Events_Types";

const defaultPointerMove : Pointer_Move_Props = {
    enable : true,
    delay : 15,
    hoverCursor : "grab",
    moveCursor : "grabbing",
    defaultCursor : "default",
    pointerCapture : true
}


function Events({state, graphHandler} : Method_Generator) : Events {

//-------------- Aspect Ratio -----------------

    function aspectRatio({ratio, axis="y", anchor="start"} : Aspect_Ratio_Props) : Graph2D{
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

    const lastCoordinates = {x : 0, y : 0};
    let options = defaultPointerMove;

    function pointerMove(props : Partial<Pointer_Move_Props>) : Graph2D{
        options = {...defaultPointerMove, ...props};

        state.canvasElement.removeEventListener("pointerdown", onPointerDown);
        state.canvasElement.removeEventListener("pointerup", onPointerUp);
        state.canvasElement.removeEventListener("pointermove", pointerStyle);
        state.canvasElement.style.cursor = options.defaultCursor;

        if(options.enable){
            state.canvasElement.addEventListener("pointerdown", onPointerDown);
            state.canvasElement.addEventListener("pointerup", onPointerUp);
            state.canvasElement.addEventListener("pointermove", pointerStyle);
        }
        

        return graphHandler;
    }

//---------------------------------------------
//------------- Pointer Down ------------------

    function onPointerDown(e : PointerEvent){     
        if(inClientRect(e.clientX, e.clientY)){
            if(options.pointerCapture)
                state.canvasElement.setPointerCapture(e.pointerId);
            lastCoordinates.x = e.clientX;
            lastCoordinates.y = e.clientY;
            state.canvasElement.removeEventListener("pointermove", pointerStyle);
            state.canvasElement.addEventListener("pointermove", onPointerMove);
            state.canvasElement.style.cursor = options.moveCursor;
        }
    }

//---------------------------------------------
//-------------- Pointer Move -----------------
    
    function onPointerMove(e:PointerEvent){
        e.preventDefault();
        moveOnPointer({x:e.clientX, y:e.clientY});
    }

//---------------------------------------------
//--------------- Pointer Up ------------------

    function onPointerUp(){
        state.canvasElement.style.cursor = options.hoverCursor;
        state.canvasElement.removeEventListener("pointermove", onPointerMove);
        state.canvasElement.addEventListener("pointermove", pointerStyle);
    }

//---------------------------------------------
//-------------- Pointer Style ----------------

    function pointerStyle(e : PointerEvent){
        if(inClientRect(e.clientX, e.clientY)){
            state.canvasElement.style.cursor = options.hoverCursor;
            return;
        }
        state.canvasElement.style.cursor = options.defaultCursor;
    }

//---------------------------------------------
//------------ Move On Pointer ----------------
    
    const moveOnPointer = throttle<Move_Graph>(({x,y})=>{

        if(state.axis.type === "rectangular" || state.axis.type === "polar"){
            const xDisplacement = state.scale.primary.x.invert(lastCoordinates.x) - state.scale.primary.x.invert(x);
            const yDisplacement = state.scale.primary.y.invert(lastCoordinates.y) - state.scale.primary.y.invert(y);
    
            state.axis.x.start += xDisplacement;
            state.axis.x.end += xDisplacement;
            state.axis.y.start += yDisplacement;
            state.axis.y.end += yDisplacement;
        }

        if(state.axis.type === "log-log"){
            const xDisplacement = Math.log10(Math.abs(state.scale.primary.x.invert(lastCoordinates.x))) - Math.log10(Math.abs(state.scale.primary.x.invert(x)));
            const yDisplacement = Math.log10(Math.abs(state.scale.primary.y.invert(lastCoordinates.y))) - Math.log10(Math.abs(state.scale.primary.y.invert(y)));
            
            state.axis.x.start *= Math.pow(10 , xDisplacement);
            state.axis.x.end *= Math.pow(10 , xDisplacement);
            state.axis.y.start *= Math.pow(10 , yDisplacement);
            state.axis.y.end *= Math.pow(10 , yDisplacement);
        }

        if(state.axis.type === "x-log"){
            const xDisplacement = Math.log10(Math.abs(state.scale.primary.x.invert(lastCoordinates.x))) - Math.log10(Math.abs(state.scale.primary.x.invert(x)));
            const yDisplacement = state.scale.primary.y.invert(lastCoordinates.y) - state.scale.primary.y.invert(y);

            state.axis.x.start *= Math.pow(10 , xDisplacement);
            state.axis.x.end *= Math.pow(10 , xDisplacement);
            state.axis.y.start += yDisplacement;
            state.axis.y.end += yDisplacement;
        }

        if(state.axis.type === "y-log"){
            const xDisplacement = state.scale.primary.x.invert(lastCoordinates.x) - state.scale.primary.x.invert(x);
            const yDisplacement = Math.log10(Math.abs(state.scale.primary.y.invert(lastCoordinates.y))) - Math.log10(Math.abs(state.scale.primary.y.invert(y)));

            state.axis.x.start += xDisplacement;
            state.axis.x.end += xDisplacement;
            state.axis.y.start *= Math.pow(10 , yDisplacement);
            state.axis.y.end *= Math.pow(10 , yDisplacement);
        }

        lastCoordinates.x = x;
        lastCoordinates.y = y;


        state.compute.client();
        if(options.callBack != null) options.callBack(graphHandler);
        state.draw.client();

    });

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

    function throttle<T>(func : (args:T)=>void) : (args:T)=>void{
        let shouldWait = false;
        let lastArgs : T | null;
        const timeoutFunction = ()=>{
            if(lastArgs == null)
                shouldWait = false;
            else{
                func(lastArgs);
                lastArgs = null;
                setTimeout(timeoutFunction, options.delay);
            }
        }

        return (args:T)=>{
            if(shouldWait){
                lastArgs = args;
                return;
            }

            func(args);
            shouldWait = true;
            setTimeout(timeoutFunction, options.delay);
        }
    }

//---------------------------------------------


    return {
        aspectRatio,
        pointerMove
    };
}

export default Events;