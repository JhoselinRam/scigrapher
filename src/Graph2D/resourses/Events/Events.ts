import mapping from "../../../tools/Mapping/Mapping.js";
import { Mapping } from "../../../tools/Mapping/Mapping_Types";
import { Axis_Property, Graph2D, Method_Generator, Primary_Axis, RecursivePartial, Secondary_Axis } from "../../Graph2D_Types";
import { Aspect_Ratio, Events, Event_Cursor, Move_Event, Move_State, Pointer_Move_Props, Pointer_State, Pointer_Zoom_Props, Resize_Event_Props, Resize_State, Zoom_Event, Zoom_State } from "./Events_Types";

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
        pointers : [],
        pointerCapture : true
    };
    const moveState : Move_State = {
        enable : false,
        delay : 12,
        positionA : {
            x:0,
            y:0
        },
        onMove : (args)=>{}
    };
    const zoomState : Zoom_State = {
        enable : false,
        delay : 12,
        onZoom : (args)=>{},
        anchor : "pointer",
        strength : 5,
        type : "area",
        rect : {
            background : "#0075FF",
            opacity : 0.05,
            borderColor  : "#0057bd",
            borderOpacity : 0.5,
            borderWidth : 1
        },
        positionA : {
            x : 0,
            y : 0,
        },
        positionB : {
            x : 0,
            y : 0,
        },
        touch : {
            onZoomTouch : ()=>{},
            distance : 0,
            anchor : {x:0, y:0}
        }
    };

    const resizeState : Resize_State =  {
        anchor : "center",
        enable : false,
        preserveAspectRatio : true,
        onResize : ()=>{},
        delay : 12,
        observer : new ResizeObserver(element => resizeState.onResize(element[0])),
        reset : true
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
            if(zoomState.enable){
                zoomState.onZoom = throttle<Zoom_Event>(zoomOnPointer, zoomState.delay);
                zoomState.touch.onZoomTouch = throttle<void>(zoomOnTouch, zoomState.delay);
            }
            
        }
    }

//--------------------------------------------
//----------------- On Down ------------------

    function onDown(e : PointerEvent){     
        if(inClientRect(e.clientX, e.clientY)){
            if(pointerState.pointerCapture)
                state.canvasElement.setPointerCapture(e.pointerId);
            
            //Stores the domain and scale only on a new gesture
            if(pointerState.pointers.length === 0){
                pointerState.lastDomain = {
                    x : { start : state.axis.x.start, end : state.axis.x.end },
                    y : { start : state.axis.y.start, end : state.axis.y.end }
                };
                pointerState.lastScale = { x : state.scale.primary.x, y : state.scale.primary.y };
                moveState.positionA = { x : e.clientX, y : e.clientY };
                zoomState.positionA = { x : e.clientX, y : e.clientY }
            }
            
            //Save the pointer info
            if(pointerState.pointers.length < 2){
                pointerState.pointers.push({
                    id : e.pointerId,
                    position : { x : e.clientX, y : e.clientY}
                });
            }

            //Necessary for zoom on mobile devices
            if(pointerState.pointers.length === 2 && zoomState.enable){
                zoomState.touch.distance = distance(pointerState.pointers[0].position, pointerState.pointers[1].position, pointerState.lastScale);
                if(zoomState.anchor === "pointer"){
                    const clientPositionA = clientCoords(pointerState.pointers[0].position.x, pointerState.pointers[0].position.y);
                    const clientPositionB = clientCoords(pointerState.pointers[1].position.x, pointerState.pointers[1].position.y);
                    let [centerX, centerY] = middlePoint(clientPositionA[0], clientPositionA[1], clientPositionB[0], clientPositionB[1]);
                    centerX = pointerState.lastScale.x.invert(centerX);
                    centerY = pointerState.lastScale.y.invert(centerY);

                    if(pointerState.lastScale.x.type === "log")
                        centerX = Math.log10(Math.abs(centerX));
                    if(pointerState.lastScale.y.type === "log")
                        centerY = Math.log10(Math.abs(centerY));

                    zoomState.touch.anchor = {x:centerX, y:centerY}
                }
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
                    shiftKey : e.shiftKey,
                    anchor : zoomState.anchor,
                    touch : false
                });
            }
            break;

        case "touch":
            pointerState.pointers.forEach(pointer=>{
                if(pointer.id === e.pointerId)
                    pointer.position = {x:e.clientX, y:e.clientY}
            });

            if(moveState.enable){
                if(pointerState.pointers.length === 1)
                    moveState.onMove({x:pointerState.pointers[0].position.x, y:pointerState.pointers[0].position.y});
            }
            if(zoomState.enable){
                if(pointerState.pointers.length === 2){
                    zoomState.positionA = {x:pointerState.pointers[0].position.x, y:pointerState.pointers[0].position.y}
                    zoomState.positionB = {x:pointerState.pointers[1].position.x, y:pointerState.pointers[1].position.y}
                    
                    zoomState.touch.onZoomTouch();
                }
            }
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

    //remove the pointer
    for(let i=0; i<pointerState.pointers.length; i++){
        if(pointerState.pointers[i].id === e.pointerId)
            pointerState.pointers.splice(i,1);
    }

    if(zoomState.enable && !moveState.enable && zoomState.type==="area" && e.pointerType === "mouse")
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

        return [x - canvasRect.x - state.context.clientRect.x, y - canvasRect.y - state.context.clientRect.y];
    }

//------------ Move On Pointer ----------------

    function moveOnPointer({x,y}:Move_Event){
        if(state.scale.primary.x.type === "linear"){
            const xDisplacement = state.scale.primary.x.invert(moveState.positionA.x) - state.scale.primary.x.invert(x);
            state.axis.x.start += xDisplacement;
            state.axis.x.end += xDisplacement;
        }
        if(state.scale.primary.x.type === "log"){
            const xDisplacement = Math.log10(Math.abs(state.scale.primary.x.invert(moveState.positionA.x))) - Math.log10(Math.abs(state.scale.primary.x.invert(x)));
            state.axis.x.start *= Math.pow(10 , xDisplacement);
            state.axis.x.end *= Math.pow(10 , xDisplacement);
        }
        
        if(state.scale.primary.y.type === "linear"){
            const yDisplacement = state.scale.primary.y.invert(moveState.positionA.y) - state.scale.primary.y.invert(y);
            state.axis.y.start += yDisplacement;
            state.axis.y.end += yDisplacement;
        }
        if(state.scale.primary.y.type === "log"){
            const yDisplacement = Math.log10(Math.abs(state.scale.primary.y.invert(moveState.positionA.y))) - Math.log10(Math.abs(state.scale.primary.y.invert(y)));
            state.axis.y.start *= Math.pow(10 , yDisplacement);
            state.axis.y.end *= Math.pow(10 , yDisplacement);
        }

        //update the las position computed
        moveState.positionA = {x, y};

        state.compute.client();
        if(moveState.callback != null) moveState.callback(graphHandler);
        state.draw.client();
    }

//---------------------------------------------
//------------ Zoom On Pointer ----------------

function zoomOnPointer({x, y, type, shiftKey, anchor} : Zoom_Event){
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
                zoomState.positionA.x += x - zoomState.positionB.x;
                zoomState.positionA.y += y - zoomState.positionB.y;
            }

            [initialX, initialY] = clientCoords(zoomState.positionA.x, zoomState.positionA.y);
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

            zoomState.positionB.x = x;
            zoomState.positionB.y = y;
        }

        if(type === "drag"){
            const [pointerX, pointerY] = clientCoords(x, y);
            const [initialX, initialY] = clientCoords(zoomState.positionA.x, zoomState.positionA.y);

            let xDomainStart = pointerState.lastDomain.x.start;
            let xDomainEnd = pointerState.lastDomain.x.end;
            let yDomainStart = pointerState.lastDomain.y.start;
            let yDomainEnd = pointerState.lastDomain.y.end;
            let domainPointerX = pointerState.lastScale.x.invert(pointerX);
            let domainInitialX = pointerState.lastScale.x.invert(initialX);
            let domainInitialY = pointerState.lastScale.y.invert(initialY);
            const fixpoint = {x : domainInitialX, y : domainInitialY } //if zoomState.anchor === "pointer"
            if(typeof anchor === "object"){
                fixpoint.x = anchor[0];
                fixpoint.y = anchor[1];
            }
            if(anchor === "center"){
                fixpoint.x = xDomainStart + (xDomainEnd - xDomainStart)/2;
                fixpoint.y = yDomainStart + (yDomainEnd - yDomainStart)/2;
            }

            if(state.scale.primary.x.type === "log"){
                xDomainStart = Math.log10(Math.abs(xDomainStart));
                xDomainEnd = Math.log10(Math.abs(xDomainEnd));
                domainPointerX = Math.log10(Math.abs(domainPointerX));
                domainInitialX = Math.log10(Math.abs(domainInitialX));
                fixpoint.x = Math.log10(Math.abs(fixpoint.x));
            }
            if(state.scale.primary.y.type === "log"){
                domainInitialY = Math.log10(Math.abs(domainInitialY));
                fixpoint.y = Math.log10(Math.abs(fixpoint.y));
            }

            const domainWidth = xDomainEnd - xDomainStart;
            const domainHeight = yDomainEnd - yDomainStart;
            const aspectRatio = domainWidth / domainHeight;

            const displacement = zoomState.strength*(domainPointerX - domainInitialX);
            const newDomainWidth = displacement>0? domainWidth/(1+displacement/domainWidth) : domainWidth*(1+Math.abs(displacement)/domainWidth);
            const newDomainHeight = newDomainWidth / aspectRatio;

            if(state.scale.primary.x.type === "linear"){
                state.axis.x.start = newDomainWidth/domainWidth*(pointerState.lastDomain.x.start - fixpoint.x) + fixpoint.x;
                state.axis.x.end = newDomainWidth/domainWidth*(pointerState.lastDomain.x.end - fixpoint.x) + fixpoint.x;
            }
            if(state.scale.primary.y.type === "linear"){
                state.axis.y.start = newDomainHeight/domainHeight*(pointerState.lastDomain.y.start - fixpoint.y) + fixpoint.y;
                state.axis.y.end = newDomainHeight/domainHeight*(pointerState.lastDomain.y.end - fixpoint.y) + fixpoint.y;
            }
            
            if(state.scale.primary.x.type === "log"){
                const sign = (state.axis.x.start >0 && state.axis.x.end >0)? 1: -1;
                state.axis.x.start = sign*Math.pow(10, newDomainWidth/domainWidth*(Math.log10(Math.abs(pointerState.lastDomain.x.start)) - fixpoint.x) + fixpoint.x);
                
                state.axis.x.end = sign*Math.pow(10, newDomainWidth/domainWidth*(Math.log10(Math.abs(pointerState.lastDomain.x.end)) - fixpoint.x) + fixpoint.x);        
            }
            if(state.scale.primary.y.type === "log"){
                const sign = (state.axis.y.start >0 && state.axis.y.end >0)? 1: -1;
                state.axis.y.start = sign*Math.pow(10, newDomainWidth/domainWidth*(Math.log10(Math.abs(pointerState.lastDomain.y.start)) - fixpoint.y) + fixpoint.y);
                
                state.axis.y.end = sign*Math.pow(10, newDomainWidth/domainWidth*(Math.log10(Math.abs(pointerState.lastDomain.y.end)) - fixpoint.y) + fixpoint.y);        
            }

            state.compute.client();
            if(zoomState.callback != null) zoomState.callback(graphHandler);
            state.draw.client();
    }
}

//---------------------------------------------
//---------------------------------------------

    function zoomRectOnUp(){
        let [initialX, initialY] = clientCoords(zoomState.positionA.x, zoomState.positionA.y);
        let[finalX, finalY] = clientCoords(zoomState.positionB.x, zoomState.positionB.y);
        const minX = state.context.clientRect.x+2;
        const maxX = minX + state.context.clientRect.width-2;
        const minY = state.context.clientRect.y+2;
        const maxY = minY + state.context.clientRect.height-2;

        initialX = initialX<minX? minX : (initialX>maxX? maxX : initialX);
        initialY = initialY<minY? minY : (initialY>maxY? maxY : initialY);
        finalX = finalX<minX? minX : (finalX>maxX? maxX : finalX);
        finalY = finalY<minY? minY : (finalY>maxY? maxY : finalY);
        
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
//------------ Zoom On Touch ------------------

    function zoomOnTouch(){
        const [xPointerA, yPointerA] = clientCoords(zoomState.positionA.x, zoomState.positionA.y);
        const [xPointerB, yPointerB] = clientCoords(zoomState.positionB.x, zoomState.positionB.y);
        const [xMiddle, yMiddle] = middlePoint(xPointerA, yPointerA, xPointerB, yPointerB);
        const newDistance = distance(zoomState.positionA, zoomState.positionB, pointerState.lastScale);
        
        let xDomainPointerA = pointerState.lastScale.x.invert(xPointerA);
        let yDomainPointerA = pointerState.lastScale.y.invert(yPointerA);
        let xDomainPointerB = pointerState.lastScale.x.invert(xPointerB);
        let yDomainPointerB = pointerState.lastScale.y.invert(yPointerB);
        let xDomainAnchor = pointerState.lastScale.x.invert(xMiddle);
        let yDomainAnchor = pointerState.lastScale.y.invert(yMiddle);
        let xDomainStart = pointerState.lastDomain.x.start;
        let xDomainEnd = pointerState.lastDomain.x.end;
        let yDomainStart = pointerState.lastDomain.y.start;
        let yDomainEnd = pointerState.lastDomain.y.end;
        
        if(pointerState.lastScale.x.type === "log"){
            xDomainPointerA = Math.log10(Math.abs(xDomainPointerA));
            xDomainPointerB = Math.log10(Math.abs(xDomainPointerB));
            xDomainAnchor = Math.log10(Math.abs(xDomainAnchor));
            xDomainStart = Math.log10(Math.abs(xDomainStart));
            xDomainEnd = Math.log10(Math.abs(xDomainEnd));
        }
        
        if(pointerState.lastScale.y.type === "log"){
            yDomainPointerA = Math.log10(Math.abs(yDomainPointerA));
            yDomainPointerB = Math.log10(Math.abs(yDomainPointerB));
            yDomainAnchor = Math.log10(Math.abs(yDomainAnchor));
            yDomainStart = Math.log10(Math.abs(yDomainStart));
            yDomainEnd = Math.log10(Math.abs(yDomainEnd));
        }

        
        const domainWidth = xDomainEnd - xDomainStart;
        const domainHeight = yDomainEnd - yDomainStart;
        const aspectRatio = domainWidth / domainHeight;
        
        
        const displacement = zoomState.strength*(newDistance - zoomState.touch.distance);
        const newDomainWidth = displacement>0? domainWidth/(1+displacement/domainWidth) : domainWidth*(1+Math.abs(displacement)/domainWidth);
        const newDomainHeight = newDomainWidth / aspectRatio;
        
        const fixpoint = {  // <- if zoomState.anchor === "pointer"
            x : (xDomainAnchor - newDomainWidth/domainWidth*zoomState.touch.anchor.x) / (newDomainWidth/domainWidth - 1),
            y : (yDomainAnchor - newDomainHeight/domainHeight*zoomState.touch.anchor.y) / (newDomainHeight/domainHeight - 1),
        }
        if(typeof zoomState.anchor === "object"){
            fixpoint.x = zoomState.anchor[0];
            fixpoint.y = zoomState.anchor[1];
        }
        if(zoomState.anchor === "center"){
            fixpoint.x = xDomainStart + domainWidth/2;
            fixpoint.y = yDomainStart + domainHeight/2;
        }
        
        if(state.scale.primary.x.type === "linear"){
                state.axis.x.start = newDomainWidth/domainWidth*(pointerState.lastDomain.x.start - fixpoint.x) + fixpoint.x;
                state.axis.x.end = newDomainWidth/domainWidth*(pointerState.lastDomain.x.end - fixpoint.x) + fixpoint.x;
            }
        if(state.scale.primary.y.type === "linear"){
            state.axis.y.start = newDomainHeight/domainHeight*(pointerState.lastDomain.y.start - fixpoint.y) + fixpoint.y;
            state.axis.y.end = newDomainHeight/domainHeight*(pointerState.lastDomain.y.end - fixpoint.y) + fixpoint.y;
        }
        
        
        state.compute.client();
        if(zoomState.callback != null) zoomState.callback(graphHandler);
        state.draw.client();
    }

//---------------------------------------------
//--------------- On Resize -------------------

    function onResize(container : ResizeObserverEntry){
        if(resizeState.reset){
            resizeState.reset = false;
            return;
        }
        const width = container.borderBoxSize[0].inlineSize;
        const height = container.borderBoxSize[0].blockSize;
        const dpi = window.devicePixelRatio;

        //Set the new canvas size
        state.canvasElement.style.width = `${width}px`;
        state.canvasElement.style.height = `${height}px`;
        state.canvasElement.width = Math.round(width*dpi);
        state.canvasElement.height = height*dpi;

        if(resizeState.preserveAspectRatio){
            let xStart = state.axis.x.start;
            let xEnd = state.axis.x.end;
            let yStart = state.axis.y.start;
            let yEnd = state.axis.y.end;
            const fixpoint = typeof resizeState.anchor==="object"? {x:resizeState.anchor[0], y:resizeState.anchor[1]} : {x:xStart+(xEnd-xStart)/2, y:yStart+(yEnd-yStart)/2};

            if(state.scale.primary.x.type === "log"){
                xStart = Math.log10(Math.abs(xStart));
                xEnd = Math.log10(Math.abs(xEnd));
                fixpoint.x = Math.log10(Math.abs(fixpoint.x));
            }
            
            if(state.scale.primary.y.type === "log"){
                yStart = Math.log10(Math.abs(yStart));
                yEnd = Math.log10(Math.abs(yEnd));
                fixpoint.y = Math.log10(Math.abs(fixpoint.y));
            }


            const lastGraphRect = state.context.graphRect();
            const domainWidth = xEnd - xStart;
            const domainHeight = yEnd - yStart;
            const xDensity = domainWidth/lastGraphRect.width;
            const yDensity = domainHeight/lastGraphRect.height;
    
            //Partially computes the new state
            state.compute.labels();
            const newGraphRect = state.context.graphRect();
            const newDomainWidth = xDensity * newGraphRect.width;
            const newDomainHeight = yDensity * newGraphRect.height;

            if(state.scale.primary.x.type === "linear"){
                state.axis.x.start = newDomainWidth/domainWidth*(xStart - fixpoint.x) + fixpoint.x;
                state.axis.x.end = newDomainWidth/domainWidth*(xEnd - fixpoint.x) + fixpoint.x;
            }
            if(state.scale.primary.y.type === "linear"){
                state.axis.y.start = newDomainHeight/domainHeight*(yStart - fixpoint.y) + fixpoint.y;
                state.axis.y.end = newDomainHeight/domainHeight*(yEnd - fixpoint.y) + fixpoint.y;
            }

            if(state.scale.primary.x.type === "log"){
                const sign = (state.axis.x.start >0 && state.axis.x.end >0)? 1: -1;
                state.axis.x.start = sign * Math.pow(10, newDomainWidth/domainWidth*(xStart - fixpoint.x) + fixpoint.x);
                state.axis.x.end = sign * Math.pow(10, newDomainWidth/domainWidth*(xEnd - fixpoint.x) + fixpoint.x);
            }
            if(state.scale.primary.y.type === "log"){
                const sign = (state.axis.y.start >0 && state.axis.y.end >0)? 1: -1;
                state.axis.y.start = sign * Math.pow(10, newDomainHeight/domainHeight*(yStart - fixpoint.y) + fixpoint.y);
                state.axis.y.end = sign * Math.pow(10, newDomainHeight/domainHeight*(yEnd - fixpoint.y) + fixpoint.y);
            }
        }


        state.compute.full();
        if(resizeState.callback != null) resizeState.callback(graphHandler);
        state.draw.full();


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
            if(options.strength != null) zoomState.strength = options.strength;
            if(options.anchor != null) zoomState.anchor = options.anchor as "center" | "pointer" | [number, number];
            if(options.type != null) zoomState.type = options.type;
            zoomState.callback = options.callback as (handler:Graph2D)=>void | undefined;
            if(options.rect != null) zoomState.rect = {...zoomState.rect, ...options.rect};
        }
        
        applyEvents();
        return graphHandler;
    }

//---------------------------------------------
//---------------------------------------------

    function containerResize(options : RecursivePartial<Resize_Event_Props>) : Graph2D{
        resizeState.enable = options != null && options.enable != null ? options.enable : true;
        resizeState.reset = true;
        if(options != null){
            if(options.preserveAspectRatio != null) resizeState.preserveAspectRatio = options.preserveAspectRatio;
            if(options.delay != null) resizeState.delay = options.delay;
            if(options.anchor != null) resizeState.anchor = options.anchor as "center" | [number, number];
            resizeState.callback = options.callback as (handler:Graph2D)=>void;
        }
        
        //Remove old listener
        resizeState.observer.unobserve(state.container);

        if(resizeState.enable){
            resizeState.onResize = throttle<ResizeObserverEntry>(onResize, resizeState.delay);
            resizeState.observer.observe(state.container);
        }


        return graphHandler;
    }

//---------------------------------------------


    return {
        aspectRatio,
        pointerMove,
        pointerZoom,
        containerResize
    };
}
export default Events;










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
//-------------- Middle Point -----------------

function middlePoint(x1:number, y1:number, x2:number, y2:number) : [number, number]{
    const minX = Math.min(x1, x2);
    const minY = Math.min(y1, y2);
    const deltaX = Math.abs(x1 - x2);
    const deltaY = Math.abs(y1 - y2);

    return [minX+deltaX/2, minY+deltaY/2];
}

//---------------------------------------------
//--------------- Distance --------------------

function distance(pointA:Axis_Property<number>, pointB:Axis_Property<number>, scale:Axis_Property<Mapping>) : number{
    let x1 = scale.x.invert(pointA.x);
    let x2 = scale.x.invert(pointB.x);
    let y1 = scale.y.invert(pointA.y);
    let y2 = scale.y.invert(pointB.y);

    if(scale.x.type === "log"){
        x1 = Math.log10(Math.abs(x1));
        x2 = Math.log10(Math.abs(x2));
    }

    if(scale.y.type === "log"){
        y1 = Math.log10(Math.abs(y1));
        y2 = Math.log10(Math.abs(y2));
    }

    return Math.hypot(x1-x2, y1-y2);
}

//---------------------------------------------
