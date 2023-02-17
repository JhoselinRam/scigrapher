import mapping from "../../../tools/Mapping/Mapping.js";
import { Mapping } from "../../../tools/Mapping/Mapping_Types";
import { Axis_Property, Graph2D, Method_Generator, Primary_Axis, RecursivePartial, Secondary_Axis } from "../../Graph2D_Types";
import { Aspect_Ratio, Events, Event_Cursor, Move_Event, Move_State, Pointer_Move_Props, Pointer_State, Pointer_Zoom_Props, Zoom_Event, Zoom_State } from "./Events_Types";

function Events({state, graphHandler} : Method_Generator) : Events {
    //Default Options
    const cursor : Event_Cursor = {
        default : "",
        hover : "",
        move : ""
    };
    const pointerState : Pointer_State = {
        lastDomain : {
            x : { start : 0, end : 0 },
            y : { start : 0, end : 0 }
        },
        lastScale : {
            x : mapping({from:[0,1], to:[0,1]}),
            y : mapping({from:[0,1], to:[0,1]})
        },
        pointerPosition1 : { x:0, y:0},
        pointerPosition2 : { x:0, y:0},
        pointerCapture : true
    };
    const moveState : Move_State = {
        enable : false,
        delay : 12,
        onMove : (args)=>{}
    };
    const zoomState : Zoom_State = {
        enable : false,
        delay : 12,
        onZoom : (args)=>{},
        anchor : "pointer",
        strenght : 15,
        type : "area",
        rect : {
            background : "#0075FF",
            opacity : 0.05,
            borderColor  : "#0057bd",
            borderOpacity : 0.5,
            borderWidth : 1
        }
    };
    

//-------------- Apply Events -----------------

    function applyEvents(){
        //Reset all events in the element
        state.canvasElement.removeEventListener("pointerdown", onDown);
        state.canvasElement.removeEventListener("pointermove", onStyle);
        state.canvasElement.removeEventListener("pointerup", onUp);
        state.canvasElement.style.cursor = "default";
        state.canvasElement.style.touchAction = "auto";
        
        if(moveState.enable || zoomState.enable){
            state.canvasElement.addEventListener("pointerdown", onDown);
            state.canvasElement.addEventListener("pointermove", onStyle);
            state.canvasElement.addEventListener("pointerup", onUp);
            state.canvasElement.style.touchAction = "none";

            if(moveState.enable)
                moveState.onMove = throttle<Move_Event>(moveOnPointer, moveState.delay);
            if(zoomState.enable)
                zoomState.onZoom = throttle<Zoom_Event>(zoomOnPointer, zoomState.delay);
            
        }
    }

//--------------------------------------------
//----------------- On Down ------------------

    function onDown(e : PointerEvent){     
        if(inClientRect(e.clientX, e.clientY)){
            if(pointerState.pointerCapture)
                state.canvasElement.setPointerCapture(e.pointerId);
            
            pointerState.pointerPosition1 = {
                x : e.clientX, 
                y : e.clientY
            };
            pointerState.lastDomain = {
                x : {
                    start : state.axis.x.start,
                    end : state.axis.x.end
                },
                y : {
                    start : state.axis.y.start,
                    end : state.axis.y.end
                }
            };
            pointerState.lastScale = {
                x : state.scale.primary.x,
                y : state.scale.primary.y,
            }

            state.canvasElement.style.cursor = cursor.move;
            state.canvasElement.removeEventListener("pointermove", onStyle);
            state.canvasElement.addEventListener("pointermove", onMove);
        }
    }

//---------------------------------------------
//----------------- On Move -------------------
    
function onMove(e:PointerEvent){
    switch(e.pointerType){
        case "mouse":
            if(moveState.enable){
                moveState.onMove({x:e.clientX, y:e.clientY});
                break;
            }
            if(zoomState.enable){
                zoomState.onZoom({
                    x:e.clientX, 
                    y:e.clientY, 
                    type:zoomState.type,
                    shiftKey : e.shiftKey
                });
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
    state.canvasElement.style.cursor = cursor.hover;
    state.canvasElement.removeEventListener("pointermove", onMove);
    state.canvasElement.addEventListener("pointermove", onStyle);

    if(zoomState.enable && zoomState.type==="area" && e.pointerType === "mouse")
        zoomRectOnUp();
}

//---------------------------------------------
//----------------- On Style ------------------

function onStyle(e : PointerEvent){
    if(inClientRect(e.clientX, e.clientY)){
        state.canvasElement.style.cursor = cursor.hover;
        return;
    }
    state.canvasElement.style.cursor = cursor.default;
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
            const xDisplacement = state.scale.primary.x.invert(pointerState.pointerPosition1.x) - state.scale.primary.x.invert(x);
            state.axis.x.start += xDisplacement;
            state.axis.x.end += xDisplacement;
        }
        if(state.scale.primary.x.type === "log"){
            const xDisplacement = Math.log10(Math.abs(state.scale.primary.x.invert(pointerState.pointerPosition1.x))) - Math.log10(Math.abs(state.scale.primary.x.invert(x)));
            state.axis.x.start *= Math.pow(10 , xDisplacement);
            state.axis.x.end *= Math.pow(10 , xDisplacement);
        }
        
        if(state.scale.primary.y.type === "linear"){
            const yDisplacement = state.scale.primary.y.invert(pointerState.pointerPosition1.y) - state.scale.primary.y.invert(y);
            state.axis.y.start += yDisplacement;
            state.axis.y.end += yDisplacement;
        }
        if(state.scale.primary.y.type === "log"){
            const yDisplacement = Math.log10(Math.abs(state.scale.primary.y.invert(pointerState.pointerPosition1.y))) - Math.log10(Math.abs(state.scale.primary.y.invert(y)));
            state.axis.y.start *= Math.pow(10 , yDisplacement);
            state.axis.y.end *= Math.pow(10 , yDisplacement);
        }

        //update the las position computed
        pointerState.pointerPosition1 = {x, y};

        state.compute.client();
        if(moveState.callback != null) moveState.callback(graphHandler);
        state.draw.client();
    }

//---------------------------------------------
//------------ Zoom On Pointer ----------------

function zoomOnPointer({x, y, type, shiftKey} : Zoom_Event){
        if(type === "area"){
            state.draw.client()
            
            let [initialX, initialY] = [0,0];
            let [pointerX, pointerY] = clientCoords(x, y);
            const minX = state.context.clientRect.x+2;
            const maxX = minX + state.context.clientRect.width-2;
            const minY = state.context.clientRect.y+2;
            const maxY = minY + state.context.clientRect.height-2;
            
            pointerX = pointerX<minX? minX : (pointerX>maxX? maxX : pointerX);
            pointerY = pointerY<minY? minY : (pointerY>maxY? maxY : pointerY);
            
            //Shifts the selection if the shift key is pressed
            if(shiftKey){
                pointerState.pointerPosition1.x += x - pointerState.pointerPosition2.x;
                pointerState.pointerPosition1.y += y - pointerState.pointerPosition2.y;
            }

            [initialX, initialY] = clientCoords(pointerState.pointerPosition1.x, pointerState.pointerPosition1.y);
            initialX = initialX<minX? minX : (initialX>maxX? maxX : initialX);
            initialY = initialY<minY? minY : (initialY>maxY? maxY : initialY);
            
            pointerX += pointerX === initialX? 2 : 0;
            pointerY += pointerY === initialY? 2 : 0;

            state.context.canvas.save();

            state.context.canvas.fillStyle = zoomState.rect.background;
            state.context.canvas.globalAlpha = zoomState.rect.opacity;
            state.context.canvas.fillRect(initialX, initialY, pointerX-initialX, pointerY-initialY);
            state.context.canvas.strokeStyle = zoomState.rect.borderColor;
            state.context.canvas.globalAlpha = zoomState.rect.borderOpacity;
            state.context.canvas.lineWidth = zoomState.rect.borderWidth;
            state.context.canvas.strokeRect(initialX, initialY, pointerX-initialX, pointerY-initialY);

            state.context.canvas.restore();

            pointerState.pointerPosition2.x = x;
            pointerState.pointerPosition2.y = y;
        }

        if(type === "drag"){
            const [pointerX, pointerY] = clientCoords(x, y);
            const [initialX, initialY] = clientCoords(pointerState.pointerPosition1.x, pointerState.pointerPosition1.y);
            const domainWidth = pointerState.lastDomain.x.end-pointerState.lastDomain.x.start;
            const domainHeight = pointerState.lastDomain.y.end-pointerState.lastDomain.y.start;
            const aspectRatio = domainWidth / domainHeight;
            const domainPointerX = pointerState.lastScale.x.invert(pointerX);
            const domainInitialX = pointerState.lastScale.x.invert(initialX);
            const domainInitialY = pointerState.lastScale.y.invert(initialY);
    
            if(state.axis.type === "rectangular" || state.axis.type === "polar"){
                const displacement = zoomState.strenght*(domainPointerX - domainInitialX);
                const newDomainWidth = displacement>0? domainWidth/(1+displacement/domainWidth) : domainWidth*(1+Math.abs(displacement)/domainWidth);
                const newDomainHeight = newDomainWidth / aspectRatio;

                state.axis.x.start = newDomainWidth/domainWidth*(pointerState.lastDomain.x.start - domainInitialX) + domainInitialX;
                state.axis.x.end = newDomainWidth/domainWidth*(pointerState.lastDomain.x.end - domainInitialX) + domainInitialX;
                state.axis.y.start = newDomainHeight/domainHeight*(pointerState.lastDomain.y.start - domainInitialY) + domainInitialY;
                state.axis.y.end = newDomainHeight/domainHeight*(pointerState.lastDomain.y.end - domainInitialY) + domainInitialY;
            }

            state.compute.client();
            if(zoomState.callback != null) zoomState.callback(graphHandler);
            state.draw.client();
        }
    }

//---------------------------------------------
//---------------------------------------------

    function zoomRectOnUp(){
        let [initialX, initialY] = clientCoords(pointerState.pointerPosition1.x, pointerState.pointerPosition1.y);
        let[finalX, finalY] = clientCoords(pointerState.pointerPosition2.x, pointerState.pointerPosition2.y);
        
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
            const yStart = state.scale.primary.y.invert(finalY);
            const yEnd = state.scale.primary.y.invert(initialY);       

            state.axis.x.start = xStart;
            state.axis.x.end = xEnd;
            state.axis.y.start = yStart;
            state.axis.y.end = yEnd;
        }
        
        state.compute.client();
        if(zoomState.callback != null) zoomState.callback(graphHandler);
        state.draw.client();
    }

//---------------------------------------------























//---------- Customization Methods ------------
//-------------- Aspect Ratio -----------------

    function aspectRatio(args ?: Partial<Aspect_Ratio>) : Graph2D{
        //Combines the default values and the arguments pased
        const options : Aspect_Ratio = {
            ratio : 1,
            sourse : "x",
            target : "y",
            anchor : "start",
            ...args
        }
        //Calculation whith this condition lead to no change at all
        if(options.sourse === options.target){
            console.warn("Sourse and Target are equal, this lead to no change being made")
            return graphHandler;
        } 

        if(state.secondary.x == null && (options.sourse==="xSecondary" || options.target==="xSecondary")){
            console.error("Secondary X axis not defined yet");
            return graphHandler;
        }
        
        if(state.secondary.y == null && (options.sourse==="ySecondary" || options.target==="ySecondary")){
            console.error("Secondary Y axis not defined yet");
            return graphHandler;
        }


        //Set the sourse and target properties
        const graphRect = state.context.graphRect();
        let sourseAxis : Primary_Axis | Secondary_Axis = state.axis.x;
        let targetAxis : Primary_Axis | Secondary_Axis = state.axis.y;
        let sourseType : "log" | "linear" = "linear";
        let targetType : "log" | "linear" = "linear";
        let sourseSize = graphRect.width;
        let targetSize = graphRect.height;
        
        switch(options.sourse){
            case "x":
                sourseType = state.scale.primary.x.type;
                break;
            case "y":
                sourseAxis = state.axis.y;
                sourseType = state.scale.primary.y.type;
                sourseSize = graphRect.height;
                break;
            case "xSecondary":
                sourseAxis = state.secondary.x as Secondary_Axis;
                sourseType = (state.scale.secondary as Axis_Property<Mapping>).x.type;
                break;
            case "ySecondary":
                sourseAxis = state.secondary.y as Secondary_Axis;
                sourseType = (state.scale.secondary as Axis_Property<Mapping>).y.type;
                sourseSize = graphRect.height;
                break;
        }
        
        switch(options.target){
            case "x":
                targetAxis = state.axis.x;
                targetType = state.scale.primary.x.type;
                targetSize = graphRect.width;
                break;
            case "y":
                targetType = state.scale.primary.y.type;
                break;
            case "xSecondary":
                targetAxis = state.secondary.x as Secondary_Axis;
                targetType = (state.scale.secondary as Axis_Property<Mapping>).x.type;
                targetSize = graphRect.width;
                break;
            case "ySecondary":
                targetAxis = state.secondary.y as Secondary_Axis;
                targetType = (state.scale.secondary as Axis_Property<Mapping>).y.type;
                break;
        }

        //Start the calculations
        const fixpoint = typeof options.anchor === "number"? options.anchor : targetAxis[options.anchor];
        let sourseDomain = Math.abs(sourseAxis.start - sourseAxis.end);
        let targetDomain = Math.abs(targetAxis.start - targetAxis.end);

        if(sourseType === "log")
            sourseDomain = Math.abs(Math.log10(Math.abs(sourseAxis.start)) - Math.log10(Math.abs(sourseAxis.end)));

        if(targetType === "linear"){
            const newTargetDomain = targetSize/sourseSize * sourseDomain/options.ratio;
            const m = newTargetDomain/targetDomain;
            targetAxis.start = m*(targetAxis.start - fixpoint) + fixpoint;
            targetAxis.end = m*(targetAxis.end - fixpoint) + fixpoint;
        }
        
        if(targetType === "log"){
            targetDomain = Math.abs(Math.log10(Math.abs(targetAxis.start)) - Math.log10(Math.abs(targetAxis.end)));
            const newTargetDomain = targetSize/sourseSize * sourseDomain/options.ratio;
            const m = newTargetDomain/targetDomain;

            if(targetAxis.start>0 && targetAxis.end>0){
                targetAxis.start = Math.pow(10, m*(Math.log10(targetAxis.start) - Math.log10(Math.abs(fixpoint))) + Math.log10(Math.abs(fixpoint)));
                targetAxis.end = Math.pow(10, m*(Math.log10(targetAxis.end) - Math.log10(Math.abs(fixpoint))) + Math.log10(Math.abs(fixpoint)));
            }
            
            if(targetAxis.start<0 && targetAxis.end<0){
                targetAxis.start = -Math.pow(10, m*(Math.log10(Math.abs(targetAxis.start)) - Math.log10(Math.abs(fixpoint))) + Math.log10(Math.abs(fixpoint)));
                targetAxis.end = -Math.pow(10, m*(Math.log10(Math.abs(targetAxis.end)) - Math.log10(Math.abs(fixpoint))) + Math.log10(Math.abs(fixpoint)));
            }
        }
   
        state.compute.client();
        state.draw.client();

        return graphHandler;
    }

//---------------------------------------------
//------------- Pointer Move ------------------

    function pointerMove( options ?: Partial<Pointer_Move_Props>) : Graph2D{

        moveState.enable = options != null && options.enable != null ? options.enable : true;
        cursor.move = "grabbing";
        cursor.hover = "grab";
        cursor.default = "default";
        if(options != null){
            if(options.delay != null) moveState.delay = options.delay;
            if(options.pointerCapture != null) pointerState.pointerCapture = options.pointerCapture;
            if(options.hoverCursor != null) cursor.hover = options.hoverCursor;
            if(options.moveCursor != null) cursor.move = options.moveCursor;
            if(options.defaultCursor != null) cursor.default = options.defaultCursor;
            moveState.callback = options.callback;
        }
        
        applyEvents();
        return graphHandler;
        
    }

//--------------------------------------------
//--------------- Pointer Zoom ----------------

    function pointerZoom(options ?: RecursivePartial<Pointer_Zoom_Props>) : Graph2D{
        zoomState.enable = options != null && options.enable != null ? options.enable : true;
        cursor.default = "default";
        cursor.hover = "zoom-in";
        cursor.move = "zoom-in";
        if(options != null){
            if(options.delay != null) zoomState.delay = options.delay;
            if(options.pointerCapture != null) pointerState.pointerCapture = options.pointerCapture;
            if(options.hoverCursor != null) cursor.hover = options.hoverCursor;
            if(options.moveCursor != null) cursor.move = options.moveCursor;
            if(options.defaultCursor != null) cursor.default = options.defaultCursor;
            if(options.strength != null) zoomState.strenght = options.strength;
            if(options.type != null) zoomState.type = options.type;
            zoomState.callback = options.callback as (handler:Graph2D)=>void | undefined;
            if(options.rect != null) zoomState.rect = {...zoomState.rect, ...options.rect};
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