import { Axis_Obj } from "../../../tools/Axis_Obj/Axis_Obj_Types";
import { Axis_Property, Graph2D, Method_Generator, RecursivePartial } from "../../Graph2D_Types";
import { Aspect_Ratio, Events, Move_Event, Pointer_Move_Props, Pointer_Zoom_Props, Zoom_Event } from "./Events_Types";

function Events({state, graphHandler} : Method_Generator) : Events {

//-------------- Apply Events -----------------

    function applyEvents(){
        //Reset all events in the element
        state.canvasElement.removeEventListener("pointerdown", onDown);
        state.canvasElement.removeEventListener("pointermove", onStyle);
        state.canvasElement.removeEventListener("pointerup", onUp);
        state.canvasElement.style.cursor = "default";
        state.canvasElement.style.touchAction = "auto";
        
        if(state.events.move.enable || state.events.zoom.enable){
            state.canvasElement.addEventListener("pointerdown", onDown);
            state.canvasElement.addEventListener("pointermove", onStyle);
            state.canvasElement.addEventListener("pointerup", onUp);
            state.canvasElement.style.touchAction = "none";

            if(state.events.move.enable)
                state.events.move.onMove = throttle<Move_Event>(moveOnPointer, state.events.move.delay);
            if(state.events.zoom.enable)
                state.events.zoom.onZoom = throttle<Zoom_Event>(zoomOnPointer, state.events.zoom.delay);
            
        }
    }

//--------------------------------------------
//----------------- On Down ------------------

    function onDown(e : PointerEvent){     
        if(inClientRect(e.clientX, e.clientY)){
            if(state.events.pointerCapture)
                state.canvasElement.setPointerCapture(e.pointerId);
            
            state.events.lastPosition = {
                x : e.clientX, 
                y : e.clientY
            };
            state.events.lastAxisDomain = {
                x : {
                    start : state.axis.x.start,
                    end : state.axis.x.end
                },
                y : {
                    start : state.axis.y.start,
                    end : state.axis.y.end
                }
            };
            state.events.lastScale = {
                x : state.scale.primary.x,
                y : state.scale.primary.y,
            }

            state.canvasElement.style.cursor = state.events.moveCursor;
            state.canvasElement.removeEventListener("pointermove", onStyle);
            state.canvasElement.addEventListener("pointermove", onMove);
        }
    }

//---------------------------------------------
//----------------- On Move -------------------
    
function onMove(e:PointerEvent){
    switch(e.pointerType){
        case "mouse":
            if(state.events.move.enable){
                state.events.move.onMove({x:e.clientX, y:e.clientY});
                break
            }
            if(state.events.zoom.enable){
                state.events.zoom.onZoom({x:e.clientX, y:e.clientY, type:state.events.zoom.type});
            }
            break;

        case "touch":

            break;

        default:
            console.error("Pointer type no recognised");
            break;
    }
    
}

//---------------------------------------------
//------------------ On Up --------------------

function onUp(e : PointerEvent){
    state.canvasElement.style.cursor = state.events.hoverCursor;
    state.canvasElement.removeEventListener("pointermove", onMove);
    state.canvasElement.addEventListener("pointermove", onStyle);

    if(state.events.zoom.enable && state.events.zoom.type==="area" && e.pointerType === "mouse")
        zoomRectOnUp();
}

//---------------------------------------------
//----------------- On Style ------------------

function onStyle(e : PointerEvent){
    if(inClientRect(e.clientX, e.clientY)){
        state.canvasElement.style.cursor = state.events.hoverCursor;
        return;
    }
    state.canvasElement.style.cursor = state.events.defaultCursor;
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
//-------------- Client Coords ----------------

    function clientCoords(x:number, y:number) : [number, number] {
        const canvasRect = state.canvasElement.getBoundingClientRect();
        return [x - canvasRect.x, y - canvasRect.y];
    }

//---------------------------------------------
//--------------- Throttle --------------------

function throttle<T>(func : (args:T)=>void, delay:number) : (args:T)=>void{
    let shouldWait = false;
    const timeoutFunction = ()=>{
            shouldWait = false;
    }

    return (args:T)=>{
        if(shouldWait)
            return;

        func(args);
        shouldWait = true;
        setTimeout(timeoutFunction, delay);
    }
}

//---------------------------------------------
//------------ Move On Pointer ----------------

    function moveOnPointer({x,y}:Move_Event){
        if(state.scale.primary.x.type === "linear"){
            const xDisplacement = state.scale.primary.x.invert(state.events.lastPosition.x) - state.scale.primary.x.invert(x);
            state.axis.x.start += xDisplacement;
            state.axis.x.end += xDisplacement;
        }
        if(state.scale.primary.x.type === "log"){
            const xDisplacement = Math.log10(Math.abs(state.scale.primary.x.invert(state.events.lastPosition.x))) - Math.log10(Math.abs(state.scale.primary.x.invert(x)));
            state.axis.x.start *= Math.pow(10 , xDisplacement);
            state.axis.x.end *= Math.pow(10 , xDisplacement);
        }
        
        if(state.scale.primary.y.type === "linear"){
            const yDisplacement = state.scale.primary.y.invert(state.events.lastPosition.y) - state.scale.primary.y.invert(y);
            state.axis.y.start += yDisplacement;
            state.axis.y.end += yDisplacement;
        }
        if(state.scale.primary.y.type === "log"){
            const yDisplacement = Math.log10(Math.abs(state.scale.primary.y.invert(state.events.lastPosition.y))) - Math.log10(Math.abs(state.scale.primary.y.invert(y)));
            state.axis.y.start *= Math.pow(10 , yDisplacement);
            state.axis.y.end *= Math.pow(10 , yDisplacement);
        }

        //update the las position computed
        state.events.lastPosition = {x, y};

        state.compute.client();
        if(state.events.move.callback != null) state.events.move.callback(graphHandler);
        state.draw.client();
    }

//---------------------------------------------
//------------ Zoom On Pointer ----------------

function zoomOnPointer({x, y, type} : Zoom_Event){
        if(type === "area"){
            state.draw.client()

            let [pointerX, pointerY] = clientCoords(x, y);
            const [initialX, initialY] = clientCoords(state.events.lastPosition.x, state.events.lastPosition.y);
            const minX = state.context.clientRect.x+2;
            const maxX = minX + state.context.clientRect.width-2;
            const minY = state.context.clientRect.y+2;
            const maxY = minY + state.context.clientRect.height-2;

            pointerX = pointerX<minX? minX : (pointerX>maxX? maxX : pointerX);
            pointerY = pointerY<minY? minY : (pointerY>maxY? maxY : pointerY);
            
            pointerX += pointerX === initialX? 3 : 0;
            pointerY += pointerY === initialY? 3 : 0;

            state.context.canvas.save();

            state.context.canvas.fillStyle = state.events.zoom.rect.background;
            state.context.canvas.globalAlpha = state.events.zoom.rect.opacity;
            state.context.canvas.fillRect(initialX, initialY, pointerX-initialX, pointerY-initialY);
            state.context.canvas.strokeStyle = state.events.zoom.rect.borderColor;
            state.context.canvas.globalAlpha = state.events.zoom.rect.borderOpacity;
            state.context.canvas.lineWidth = state.events.zoom.rect.borderWidth;
            state.context.canvas.strokeRect(initialX, initialY, pointerX-initialX, pointerY-initialY);

            state.context.canvas.restore();

            state.events.secondaryLastPosition.x = pointerX;
            state.events.secondaryLastPosition.y = pointerY;
        }

        if(type === "drag"){
            const [pointerX, pointerY] = clientCoords(x, y);
            const [initialX, initialY] = clientCoords(state.events.lastPosition.x, state.events.lastPosition.y);
            const domainWidth = state.events.lastAxisDomain.x.end-state.events.lastAxisDomain.x.start;
            const domainHeight = state.events.lastAxisDomain.y.end-state.events.lastAxisDomain.y.start;
            const aspectRatio = domainWidth / domainHeight;
            const domainPointerX = state.events.lastScale.x.invert(pointerX);
            const domainInitialX = state.events.lastScale.x.invert(initialX);
            const domainInitialY = state.events.lastScale.y.invert(initialY);
            
            if(state.axis.type === "rectangular" || state.axis.type === "polar"){
                const displacement = state.events.zoom.strength*(domainPointerX - domainInitialX);
                const newDomainWidth = displacement>0? domainWidth/(1+displacement/domainWidth) : domainWidth*(1+Math.abs(displacement)/domainWidth);
                const newDomainHeight = newDomainWidth / aspectRatio;

                state.axis.x.start = newDomainWidth/domainWidth*(state.events.lastAxisDomain.x.start - domainInitialX) + domainInitialX;
                state.axis.x.end = newDomainWidth/domainWidth*(state.events.lastAxisDomain.x.end - domainInitialX) + domainInitialX;
                state.axis.y.start = newDomainHeight/domainHeight*(state.events.lastAxisDomain.y.start - domainInitialY) + domainInitialY;
                state.axis.y.end = newDomainHeight/domainHeight*(state.events.lastAxisDomain.y.end - domainInitialY) + domainInitialY;
            }

            state.compute.client();
            if(state.events.zoom.callback != null) state.events.zoom.callback(graphHandler);
            state.draw.client();
        }
    }

//---------------------------------------------
//---------------------------------------------

    function zoomRectOnUp(){
        let [initialX, initialY] = clientCoords(state.events.lastPosition.x, state.events.lastPosition.y);
        let finalX = state.events.secondaryLastPosition.x;
        let finalY = state.events.secondaryLastPosition.y;
        
        if(initialX > finalX){
            const aux = initialX;
            initialX = finalX;
            finalX = aux;
        }
        if(initialY > finalY){
            const aux = initialY;
            initialY = finalY;
            finalY = aux;
        }
        if(initialX>0 && initialY>0){
            const xStart = state.scale.primary.x.invert(initialX);
            const xEnd = state.scale.primary.x.invert(finalX);
            const yStart = state.scale.primary.y.invert(initialY);
            const yEnd = state.scale.primary.y.invert(finalY);       

            state.axis.x.start = xStart;
            state.axis.x.end = xEnd;
            state.axis.y.start = yStart;
            state.axis.y.end = yEnd;
        }
        
        state.compute.client();
        if(state.events.zoom.callback != null) state.events.zoom.callback(graphHandler);
        state.draw.client();
    }

//---------------------------------------------























//---------- Customization Methods ------------
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

    function pointerMove( options ?: Partial<Pointer_Move_Props>) : Graph2D{

        state.events.move.enable = options != null && options.enable != null ? options.enable : true;
        state.events.moveCursor = "grabbing";
        state.events.hoverCursor = "grab";
        state.events.defaultCursor = "default";
        if(options != null){
            if(options.delay != null) state.events.move.delay = options.delay;
            if(options.pointerCapture != null) state.events.pointerCapture = options.pointerCapture;
            if(options.hoverCursor != null) state.events.hoverCursor = options.hoverCursor;
            if(options.moveCursor != null) state.events.moveCursor = options.moveCursor;
            if(options.defaultCursor != null) state.events.defaultCursor = options.defaultCursor;
            state.events.move.callback = options.callback;
        }
        
        applyEvents();
        return graphHandler;
        
    }

//--------------------------------------------
//--------------- Pointer Zoom ----------------

    function pointerZoom(options ?: RecursivePartial<Pointer_Zoom_Props>) : Graph2D{
        state.events.zoom.enable = options != null && options.enable != null ? options.enable : true;
        state.events.defaultCursor = "default";
        state.events.hoverCursor = "zoom-in";
        state.events.moveCursor = "zoom-in";
        if(options != null){
            if(options.delay != null) state.events.zoom.delay = options.delay;
            if(options.pointerCapture != null) state.events.pointerCapture = options.pointerCapture;
            if(options.hoverCursor != null) state.events.hoverCursor = options.hoverCursor;
            if(options.moveCursor != null) state.events.moveCursor = options.moveCursor;
            if(options.defaultCursor != null) state.events.defaultCursor = options.defaultCursor;
            if(options.axis != null) state.events.zoom.axis = options.axis;
            if(options.strength != null) state.events.zoom.strength = options.strength;
            if(options.type != null) state.events.zoom.type = options.type;
            state.events.zoom.callback = options.callback as (handler:Graph2D)=>void | undefined;
            if(options.rect != null) state.events.zoom.rect = {...state.events.zoom.rect, ...options.rect};
        }
        
        applyEvents();
        return graphHandler;
    }

//---------------------------------------------


    return {
        aspectRatio,
        pointerMove,
        pointerZoom
    };
}

export default Events;