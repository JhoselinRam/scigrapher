import mapping from "../../../tools/Mapping/Mapping.js";
import { Mapping, Mapping_Type } from "../../../tools/Mapping/Mapping_Types";
import { Axis_Property, Graph2D, graphCallback, Method_Generator, Primary_Axis, RecursivePartial, Secondary_Axis } from "../../Graph2D_Types";
import { Aspect_Ratio, Events, Event_Cursor, Move_Event, Move_State, Pointer_Move_Props, Pointer_State, Pointer_Zoom_Props, Resize_Axis, Resize_Event_Props, Resize_State, Scale_Reference, Zoom_Event, Zoom_State } from "./Events_Types";

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
        onMove : (args)=>{},
        primaryAxis : true,
        secondaryAxis : true
    };
    const zoomState : Zoom_State = {
        enable : false,
        delay : 12,
        onZoom : (args)=>{},
        anchor : "pointer",
        strength : 5,
        primaryAxis : true,
        secondaryAxis : true,
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
        secondaryAnchor : "center",
        enable : false,
        preserveAspectRatio : true,
        onResize : ()=>{},
        delay : 12,
        observer : new ResizeObserver(element => resizeState.onResize(element[0])),
        reset : true,
        primaryAxis : true,
        secondaryAxis : true
    };
    

//-------------- Apply Events -----------------

    function applyEvents(){
        //Reset all events in the element
        state.canvasDataElement.removeEventListener("pointerdown", onDown);
        state.canvasDataElement.removeEventListener("pointermove", onStyle);
        state.canvasDataElement.removeEventListener("pointerup", onUp);
        state.canvasDataElement.style.cursor = "default";
        state.canvasDataElement.style.touchAction = "auto";
        
        if(moveState.enable || zoomState.enable){
            state.canvasDataElement.addEventListener("pointerdown", onDown);
            state.canvasDataElement.addEventListener("pointermove", onStyle);
            state.canvasDataElement.addEventListener("pointerup", onUp);
            state.canvasDataElement.style.touchAction = "none";

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
                state.canvasDataElement.setPointerCapture(e.pointerId);
            
            //Stores the domain and scale only on a new gesture
            if(pointerState.pointers.length === 0){
                pointerState.lastDomain = {
                    x : { start : state.axis.x.start, end : state.axis.x.end },
                    y : { start : state.axis.y.start, end : state.axis.y.end }
                };
                pointerState.lastScale = { x : state.scale.primary.x, y : state.scale.primary.y };
                moveState.positionA = { x : e.clientX, y : e.clientY };
                zoomState.positionA = { x : e.clientX, y : e.clientY };
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


            state.canvasDataElement.style.cursor = cursor.move;
            state.canvasDataElement.removeEventListener("pointermove", onStyle);
            state.canvasDataElement.addEventListener("pointermove", onMove);
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
    state.canvasDataElement.style.cursor = cursor.hover;
    state.canvasDataElement.removeEventListener("pointermove", onMove);
    state.canvasDataElement.addEventListener("pointermove", onStyle);

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
        state.canvasDataElement.style.cursor = cursor.hover;
        return;
    }
    state.canvasDataElement.style.cursor = cursor.default;
}

//---------------------------------------------
//------------- In Client Rect ----------------

function inClientRect(x:number, y:number) : boolean{
    const graphRect = state.context.graphRect();
    const canvasRect = state.canvasDataElement.getBoundingClientRect();
    const pointerX = Math.round(x - canvasRect.x);
    const pointerY = Math.round(y - canvasRect.y);
    const minX = graphRect.x;
    const maxX = minX + graphRect.width;
    const minY = graphRect.y;
    const maxY = minY + graphRect.height;

    return pointerX>=minX && pointerX<=maxX && pointerY>=minY && pointerY<=maxY
}

//---------------------------------------------
//-------------- Client Coords ----------------

    function clientCoords(x:number, y:number) : [number, number] {
        const canvasRect = state.canvasDataElement.getBoundingClientRect();
        const graphRect = state.context.graphRect();

        return [x - canvasRect.x - graphRect.x, y - canvasRect.y - graphRect.y];
    }

//------------ Move On Pointer ----------------

    function moveOnPointer({x,y}:Move_Event){
        //Apply the effect on the primary axis
        if(moveState.primaryAxis){
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
        }

        //Apply the effect on the secondary axis if necessary
        if(moveState.secondaryAxis){
            if(state.secondary.x != null && state.secondary.x.enable){
                const xScale = state.scale.secondary.x as Mapping;
                if(xScale.type === "linear"){
                    const xDisplacement = xScale.invert(moveState.positionA.x) - xScale.invert(x);
                    state.secondary.x.start += xDisplacement;
                    state.secondary.x.end += xDisplacement;
                }
                
                if(xScale.type === "log"){
                    const xDisplacement = Math.log10(Math.abs(xScale.invert(moveState.positionA.x))) - Math.log10(Math.abs(xScale.invert(x)));
                    state.secondary.x.start *= Math.pow(10 , xDisplacement);
                    state.secondary.x.end *= Math.pow(10 , xDisplacement);
                }
            }
            if(state.secondary.y != null && state.secondary.y.enable){
                const yScale = state.scale.secondary.y as Mapping;
                if(yScale.type === "linear"){
                    const yDisplacement = yScale.invert(moveState.positionA.y) - yScale.invert(y);
                    state.secondary.y.start += yDisplacement;
                    state.secondary.y.end += yDisplacement;
                }
                
                if(yScale.type === "log"){
                    const yDisplacement = Math.log10(Math.abs(yScale.invert(moveState.positionA.y))) - Math.log10(Math.abs(yScale.invert(y)));
                    state.secondary.y.start *= Math.pow(10 , yDisplacement);
                    state.secondary.y.end *= Math.pow(10 , yDisplacement);
                }
            }
        }
        

        //update the las position computed
        moveState.positionA = {x, y};

        state.compute.client();
        if(moveState.callback != null) moveState.callback(graphHandler);
        state.dirty.client = true;
        state.draw.full();
    }

//---------------------------------------------
//------------ Zoom On Pointer ----------------

function zoomOnPointer({x, y, type, shiftKey, anchor} : Zoom_Event){
        if(type === "area"){
            const graphRect = state.context.graphRect();
            state.dirty.client = true;
            state.draw.client()
            
            let [initialX, initialY] = [0,0];
            let [pointerX, pointerY] = clientCoords(x, y);
            const minX = 2;
            const maxX = minX + graphRect.width-2;
            const minY = 2;
            const maxY = minY + graphRect.height-2;
            
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
            state.context.canvas.translate(graphRect.x, graphRect.y);
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
            const newAxis : Axis_Property<{start:number, end:number}> = {x:{start:0, end:0}, y:{start:0, end:0}};
            
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

            //Computes the new axis positions
            if(state.scale.primary.x.type === "linear"){
                newAxis.x.start = newDomainWidth/domainWidth*(pointerState.lastDomain.x.start - fixpoint.x) + fixpoint.x;
                newAxis.x.end = newDomainWidth/domainWidth*(pointerState.lastDomain.x.end - fixpoint.x) + fixpoint.x;
            }
            if(state.scale.primary.y.type === "linear"){
                newAxis.y.start = newDomainHeight/domainHeight*(pointerState.lastDomain.y.start - fixpoint.y) + fixpoint.y;
                newAxis.y.end = newDomainHeight/domainHeight*(pointerState.lastDomain.y.end - fixpoint.y) + fixpoint.y;
            }
            
            if(state.scale.primary.x.type === "log"){
                const sign = (state.axis.x.start >0 && state.axis.x.end >0)? 1: -1;
                newAxis.x.start = sign*Math.pow(10, newDomainWidth/domainWidth*(Math.log10(Math.abs(pointerState.lastDomain.x.start)) - fixpoint.x) + fixpoint.x);
                newAxis.x.end = sign*Math.pow(10, newDomainWidth/domainWidth*(Math.log10(Math.abs(pointerState.lastDomain.x.end)) - fixpoint.x) + fixpoint.x);        
            }
            if(state.scale.primary.y.type === "log"){
                const sign = (state.axis.y.start >0 && state.axis.y.end >0)? 1: -1;
                newAxis.y.start = sign*Math.pow(10, newDomainWidth/domainWidth*(Math.log10(Math.abs(pointerState.lastDomain.y.start)) - fixpoint.y) + fixpoint.y);
                newAxis.y.end = sign*Math.pow(10, newDomainWidth/domainWidth*(Math.log10(Math.abs(pointerState.lastDomain.y.end)) - fixpoint.y) + fixpoint.y);        
            }

            //Apply effects on secondary axis
            if(zoomState.secondaryAxis){
                if(state.secondary.x != null && state.secondary.x.enable){
                    const xScale = state.scale.secondary.x as Mapping;
                    const [newStart, newEnd] = scaleByReference({
                        reference : {
                            scale : state.scale.primary.x,
                            lastDomain : {start:state.axis.x.start, end:state.axis.x.end},
                            newDomain : {start:newAxis.x.start, end:newAxis.x.end}
                        },
                        target : {
                            scale : xScale,
                            domain : {start:state.secondary.x.start, end:state.secondary.x.end}
                        }
                    });

                    state.secondary.x.start = newStart;
                    state.secondary.x.end = newEnd;
                }
                if(state.secondary.y != null && state.secondary.y.enable){
                    const yScale = state.scale.secondary.y as Mapping;
                    const [newStart, newEnd] = scaleByReference({
                        reference : {
                            scale : state.scale.primary.y,
                            lastDomain : {start:state.axis.y.start, end:state.axis.y.end},
                            newDomain : {start:newAxis.y.start, end:newAxis.y.end}
                        },
                        target : {
                            scale : yScale,
                            domain : {start:state.secondary.y.start, end:state.secondary.y.end}
                        }
                    });

                    state.secondary.y.start = newStart;
                    state.secondary.y.end = newEnd;
                }
            }

            if(zoomState.primaryAxis){
                state.axis.x.start = newAxis.x.start;
                state.axis.x.end = newAxis.x.end;
                state.axis.y.start = newAxis.y.start;
                state.axis.y.end = newAxis.y.end;
            }

            state.compute.client();
            if(zoomState.callback != null) zoomState.callback(graphHandler);
            state.dirty.client = true;
            state.draw.full();
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
            //Apply the effect on the primary axis
            if(zoomState.primaryAxis){
                const xStart = state.scale.primary.x.invert(initialX);
                const xEnd = state.scale.primary.x.invert(finalX);
                const yStart = state.scale.primary.y.invert(finalY);
                const yEnd = state.scale.primary.y.invert(initialY);       
    
                state.axis.x.start = xStart;
                state.axis.x.end = xEnd;
                state.axis.y.start = yStart;
                state.axis.y.end = yEnd;
            }

            //Apply on the secondary axis
            if(zoomState.secondaryAxis){
                if(state.secondary.x != null && state.secondary.x.enable){
                    const xScale = state.scale.secondary.x as Mapping;
                    const xStart = xScale.invert(initialX);
                    const xEnd = xScale.invert(finalX);
                    state.secondary.x.start = xStart;
                    state.secondary.x.end = xEnd;
                }
                
                if(state.secondary.y != null && state.secondary.y.enable){
                    const yScale = state.scale.secondary.y as Mapping;
                    const yStart = yScale.invert(initialX);
                    const yEnd = yScale.invert(finalX);
                    state.secondary.y.start = yStart;
                    state.secondary.y.end = yEnd;
                }
            }
        }


        
        state.compute.client();
        if(zoomState.callback != null) zoomState.callback(graphHandler);
        state.dirty.client = true;
        state.draw.full();
    }

//---------------------------------------------
//------------ Zoom On Touch ------------------

    function zoomOnTouch(){
        const [xPointerA, yPointerA] = clientCoords(zoomState.positionA.x, zoomState.positionA.y);
        const [xPointerB, yPointerB] = clientCoords(zoomState.positionB.x, zoomState.positionB.y);
        const [xMiddle, yMiddle] = middlePoint(xPointerA, yPointerA, xPointerB, yPointerB);
        const newDistance = distance(zoomState.positionA, zoomState.positionB, pointerState.lastScale);
        const newAxis : Axis_Property<{start:number, end:number}> = {x:{start:0, end:0}, y:{start:0, end:0}};
        
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
            newAxis.x.start = newDomainWidth/domainWidth*(pointerState.lastDomain.x.start - fixpoint.x) + fixpoint.x;
            newAxis.x.end = newDomainWidth/domainWidth*(pointerState.lastDomain.x.end - fixpoint.x) + fixpoint.x;
        }
        if(state.scale.primary.y.type === "linear"){
            newAxis.y.start = newDomainHeight/domainHeight*(pointerState.lastDomain.y.start - fixpoint.y) + fixpoint.y;
            newAxis.y.end = newDomainHeight/domainHeight*(pointerState.lastDomain.y.end - fixpoint.y) + fixpoint.y;
        }
        
        if(state.scale.primary.x.type === "log"){
            const sign = (state.axis.x.start>0 && state.axis.x.end>0)? 1 : -1;
            newAxis.x.start = sign * Math.pow(10, newDomainWidth/domainWidth*(Math.log10(Math.abs(pointerState.lastDomain.x.start)) - fixpoint.x) + fixpoint.x);
            newAxis.x.end = sign * Math.pow(10, newDomainWidth/domainWidth*(Math.log10(Math.abs(pointerState.lastDomain.x.end)) - fixpoint.x) + fixpoint.x);
        }
        if(state.scale.primary.y.type === "log"){
            const sign = (state.axis.y.start>0 && state.axis.y.end>0)? 1 : -1;
            newAxis.y.start = sign * Math.pow(10, newDomainWidth/domainWidth*(Math.log10(Math.abs(pointerState.lastDomain.y.start)) - fixpoint.y) + fixpoint.y);
            newAxis.y.end = sign * Math.pow(10, newDomainWidth/domainWidth*(Math.log10(Math.abs(pointerState.lastDomain.y.end)) - fixpoint.y) + fixpoint.y);
        }

        if(zoomState.secondaryAxis){
            if(state.secondary.x != null && state.secondary.x.enable){
                const xScale = state.scale.secondary.x as Mapping;
                const [newStart, newEnd] = scaleByReference({
                    reference : {
                        scale : state.scale.primary.x,
                        lastDomain : {start:state.axis.x.start, end:state.axis.x.end},
                        newDomain : {start:newAxis.x.start, end:newAxis.x.end}
                    },
                    target : {
                        scale : xScale,
                        domain : {start:state.secondary.x.start, end:state.secondary.x.end}
                    }
                });

                state.secondary.x.start = newStart;
                state.secondary.x.end = newEnd;
            }
            if(state.secondary.y != null && state.secondary.y.enable){
                const yScale = state.scale.secondary.y as Mapping;
                const [newStart, newEnd] = scaleByReference({
                    reference : {
                        scale : state.scale.primary.y,
                        lastDomain : {start:state.axis.y.start, end:state.axis.y.end},
                        newDomain : {start:newAxis.y.start, end:newAxis.y.end}
                    },
                    target : {
                        scale : yScale,
                        domain : {start:state.secondary.y.start, end:state.secondary.y.end}
                    }
                });

                state.secondary.y.start = newStart;
                state.secondary.y.end = newEnd;
            }
        }

        if(zoomState.primaryAxis){
            state.axis.x.start = newAxis.x.start;
            state.axis.x.end = newAxis.x.end;
            state.axis.y.start = newAxis.y.start;
            state.axis.y.end = newAxis.y.end;
        }


        
        
        state.compute.client();
        if(zoomState.callback != null) zoomState.callback(graphHandler);
        state.dirty.client = true;
        state.draw.full();
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
        state.canvasElement.width = width*dpi;
        state.canvasElement.height = height*dpi;
        
        state.canvasDataElement.style.width = `${width}px`;
        state.canvasDataElement.style.height = `${height}px`;
        state.canvasDataElement.width = width*dpi;
        state.canvasDataElement.height = height*dpi;


        if(resizeState.preserveAspectRatio){
            const lastRect = state.context.graphRect();
            state.compute.labels();
            const newRect = state.context.graphRect();
            
            if(resizeState.primaryAxis){
                const [xStart, xEnd] = resizeAxis({
                    start : state.axis.x.start,
                    end : state.axis.x.end, 
                    anchor : typeof resizeState.anchor === "object"? resizeState.anchor[0] : resizeState.anchor,
                    scale :  state.scale.primary.x,
                    lastSize : lastRect.width,
                    newSize : newRect.width
                });
                const [yStart, yEnd] = resizeAxis({
                    start : state.axis.y.start,
                    end : state.axis.y.end, 
                    anchor : typeof resizeState.anchor === "object"? resizeState.anchor[1] : resizeState.anchor,
                    scale :  state.scale.primary.y,
                    lastSize : lastRect.height,
                    newSize : newRect.height
                });

                state.axis.x.start = xStart;
                state.axis.x.end = xEnd;
                state.axis.y.start = yStart;
                state.axis.y.end = yEnd;
            }

            if(resizeState.secondaryAxis){
                if(state.secondary.x != null && state.secondary.x.enable){
                    const [xStart, xEnd] = resizeAxis({
                        start : state.secondary.x.start,
                        end : state.secondary.x.end, 
                        anchor : typeof resizeState.secondaryAnchor === "object"? resizeState.secondaryAnchor[0] : resizeState.secondaryAnchor,
                        scale :  state.scale.secondary.x as Mapping,
                        lastSize : lastRect.width,
                        newSize : newRect.width
                    });
                    state.secondary.x.start = xStart;
                    state.secondary.x.end = xEnd;
                }

                if(state.secondary.y != null && state.secondary.y.enable){
                    const [yStart, yEnd] = resizeAxis({
                        start : state.secondary.y.start,
                        end : state.secondary.y.end, 
                        anchor : typeof resizeState.secondaryAnchor === "object"? resizeState.secondaryAnchor[1] : resizeState.secondaryAnchor,
                        scale :  state.scale.secondary.y as Mapping,
                        lastSize : lastRect.height,
                        newSize : newRect.height
                    });
                    state.secondary.y.start = yStart;
                    state.secondary.y.end = yEnd;
                }
            }
        }


        state.compute.full();
        if(resizeState.callback != null) resizeState.callback(graphHandler);
        state.dirty.full = true;
        state.draw.full();


    }

//---------------------------------------------























//---------- Customization Methods ------------
//-------------- Aspect Ratio -----------------

    function aspectRatio(args ?: Partial<Aspect_Ratio>, callback?:graphCallback) : Graph2D{
        //Combines the default values and the arguments pased
        const options : Aspect_Ratio = {
            ratio : 1,
            source : "x",
            target : "y",
            anchor : "start",
            ...args
        }

        if(state.secondary.x == null && (options.source==="xSecondary" || options.target==="xSecondary")){
            console.error("Secondary X axis not defined yet");
            return graphHandler;
        }
        
        if(state.secondary.y == null && (options.source==="ySecondary" || options.target==="ySecondary")){
            console.error("Secondary Y axis not defined yet");
            return graphHandler;
        }


        //Set the source and target properties
        const graphRect = state.context.graphRect();
        let sourceAxis : Primary_Axis | Secondary_Axis = state.axis.x;
        let targetAxis : Primary_Axis | Secondary_Axis = state.axis.y;
        let sourceType : Mapping_Type = "linear";
        let targetType : Mapping_Type = "linear";
        let sourceSize = graphRect.width;
        let targetSize = graphRect.height;
        
        switch(options.source){
            case "x":
                sourceType = state.scale.primary.x.type;
                break;
            case "y":
                sourceAxis = state.axis.y;
                sourceType = state.scale.primary.y.type;
                sourceSize = graphRect.height;
                break;
            case "xSecondary":
                sourceAxis = state.secondary.x as Secondary_Axis;
                sourceType = (state.scale.secondary as Axis_Property<Mapping>).x.type;
                break;
            case "ySecondary":
                sourceAxis = state.secondary.y as Secondary_Axis;
                sourceType = (state.scale.secondary as Axis_Property<Mapping>).y.type;
                sourceSize = graphRect.height;
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
        let sourceDomain = Math.abs(sourceAxis.start - sourceAxis.end);
        let targetDomain = Math.abs(targetAxis.start - targetAxis.end);

        if(sourceType === "log")
            sourceDomain = Math.abs(Math.log10(Math.abs(sourceAxis.start)) - Math.log10(Math.abs(sourceAxis.end)));

        if(targetType === "linear"){
            const newTargetDomain = targetSize/sourceSize * sourceDomain/options.ratio;
            const m = newTargetDomain/targetDomain;
            targetAxis.start = m*(targetAxis.start - fixpoint) + fixpoint;
            targetAxis.end = m*(targetAxis.end - fixpoint) + fixpoint;
        }
        
        if(targetType === "log"){
            targetDomain = Math.abs(Math.log10(Math.abs(targetAxis.start)) - Math.log10(Math.abs(targetAxis.end)));
            const newTargetDomain = targetSize/sourceSize * sourceDomain/options.ratio;
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
        if(callback != null) callback(graphHandler);
        state.dirty.client = true;


        return graphHandler;
    }

//---------------------------------------------
//------------- Pointer Move ------------------

    function pointerMove( options ?: Partial<Pointer_Move_Props>) : Graph2D{

        moveState.enable = true;
        cursor.move = "grabbing";
        cursor.hover = "grab";
        cursor.default = "default";
        if(options != null){
            if(options.enable != null) moveState.enable = options.enable;
            if(options.delay != null) moveState.delay = options.delay;
            if(options.primaryAxis != null) moveState.primaryAxis = options.primaryAxis;
            if(options.secondaryAxis != null) moveState.secondaryAxis = options.secondaryAxis;
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
        zoomState.enable = true;
        cursor.default = "default";
        cursor.hover = "zoom-in";
        cursor.move = "zoom-in";
        if(options != null){
            if(options.enable != null) zoomState.enable = options.enable;
            if(options.delay != null) zoomState.delay = options.delay;
            if(options.primaryAxis != null) zoomState.primaryAxis = options.primaryAxis;
            if(options.secondaryAxis != null) zoomState.secondaryAxis = options.secondaryAxis;
            if(options.pointerCapture != null) pointerState.pointerCapture = options.pointerCapture;
            if(options.hoverCursor != null) cursor.hover = options.hoverCursor;
            if(options.moveCursor != null) cursor.move = options.moveCursor;
            if(options.defaultCursor != null) cursor.default = options.defaultCursor;
            if(options.strength != null) zoomState.strength = options.strength;
            if(options.anchor != null) zoomState.anchor = options.anchor as "center" | "pointer" | [number, number];
            if(options.type != null) zoomState.type = options.type;
            zoomState.callback = options.callback as graphCallback | undefined;
            if(options.rect != null) zoomState.rect = {...zoomState.rect, ...options.rect};
        }
        
        applyEvents();
        return graphHandler;
    }

//---------------------------------------------
//---------------------------------------------

    function containerResize(options ?: RecursivePartial<Resize_Event_Props>) : Graph2D{
        resizeState.enable = true;
        resizeState.reset = true;
        if(options != null){
            if(options.enable != null) resizeState.enable = options.enable;
            if(options.preserveAspectRatio != null) resizeState.preserveAspectRatio = options.preserveAspectRatio;
            if(options.delay != null) resizeState.delay = options.delay;
            if(options.primaryAxis != null) resizeState.primaryAxis = options.primaryAxis;
            if(options.secondaryAxis != null) resizeState.secondaryAxis = options.secondaryAxis;
            if(options.anchor != null) resizeState.anchor = options.anchor as "center" | [number, number];
            if(options.secondaryAnchor != null) resizeState.secondaryAnchor = options.secondaryAnchor as "center" | [number, number];
            resizeState.callback = options.callback as graphCallback;
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
//-------------- Resize Axis ------------------

    function resizeAxis({start, end, anchor, scale, lastSize, newSize} : Resize_Axis) : [number, number]{
        let axisStart = start;
        let axisEnd = end;
        const newAxis : [number, number] = [0,0];
        
        let fixpoint = typeof anchor === "number"? anchor : axisStart+(axisEnd - axisStart)/2;


        if(scale.type === "log"){
            axisStart = Math.log10(Math.abs(axisStart));
            axisEnd = Math.log10(Math.abs(axisEnd));
            fixpoint = typeof anchor === "number"? Math.log10(Math.abs(fixpoint)) : axisStart+(axisEnd - axisStart)/2;
        }

        const domainSize = axisEnd - axisStart;
        const density = domainSize / lastSize;
        const newDomainSize = density * newSize;

        
        newAxis[0] = newDomainSize/domainSize * (axisStart - fixpoint) + fixpoint;
        newAxis[1] = newDomainSize/domainSize * (axisEnd - fixpoint) + fixpoint;
        
        if(scale.type === "log"){
            const sign = (start>0 && end>0)? 1 : -1;
            newAxis[0] = sign * Math.pow(10, newAxis[0]);
            newAxis[1] = sign * Math.pow(10, newAxis[1]);
        }

        return newAxis;
    }

//---------------------------------------------
//---------------------------------------------

    function scaleByReference({target, reference} : Scale_Reference) : [number,number]{
        let lastStart = reference.lastDomain.start;
        let lastEnd = reference.lastDomain.end;
        let newStart = reference.newDomain.start;
        let newEnd = reference.newDomain.end;
        let axisStart = target.domain.start;
        let axisEnd = target.domain.end;

        if(reference.scale.type === "log"){
            if(reference.lastDomain.start>0 && reference.lastDomain.end>0){
                lastStart = Math.log10(Math.abs(lastStart));
                lastEnd = Math.log10(Math.abs(lastEnd));
                newStart = Math.log10(Math.abs(newStart));
                newEnd = Math.log10(Math.abs(newEnd));
            }else{
                const auxLastStart = lastStart;
                const auxNewStart = newStart;
                lastStart = Math.log10(Math.abs(lastEnd));
                lastEnd = Math.log10(Math.abs(auxLastStart));
                newStart = Math.log10(Math.abs(newEnd));
                newEnd = Math.log10(Math.abs(auxNewStart));
            }
        }

        if(reference.scale.type === "log"){
            if(target.domain.start>0 && target.domain.end>0){
                axisStart = Math.log10(Math.abs(axisStart));
                axisEnd = Math.log10(Math.abs(axisEnd));
            } else{
                const auxStart = axisStart;
                axisStart = Math.log10(Math.abs(axisEnd));
                axisEnd = Math.log10(Math.abs(auxStart));
            }
        }

        const domain = lastEnd - lastStart;
        const deltaStart = (newStart - lastStart) / domain;
        const deltaEnd = (newEnd - lastEnd) / domain;

        let secondaryStart = axisStart + deltaStart*(axisEnd - axisStart);
        let secondaryEnd = axisEnd + deltaEnd*(axisEnd - axisStart);

        if(reference.scale.type === "log"){
            if(target.domain.start>0 && target.domain.end>0){
                secondaryStart = Math.pow(10, secondaryStart);
                secondaryEnd = Math.pow(10, secondaryEnd);
            } else {
                const auxStart = secondaryStart
                secondaryStart = -Math.pow(10, secondaryEnd);
                secondaryEnd = -Math.pow(10, auxStart);
            }
        }

        return [secondaryStart, secondaryEnd];
    }

//---------------------------------------------


