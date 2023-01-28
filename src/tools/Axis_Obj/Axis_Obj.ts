import { Graph2D_State } from "../../Graph2D/Graph2D_Types.js";
import mapping from "../Mapping/Mapping.js";
import { Mapping } from "../Mapping/Mapping_Types.js";
import { Axis_Obj, CreateAxis_Props, Label_Rect } from "./Axis_Obj_Types";

const labelOffset = 4;

function CreateAxis({state, axis, ticks="auto", minSpacing}:CreateAxis_Props) : Axis_Obj{
    const positions = computePositions(state.scale.primary[axis], ticks, minSpacing);
    const labels = createLabels(positions, state.axis[axis].unit);
    const translation = computeTranslation(state, axis);
    const rects =  computeRects(positions, labels, axis, state, translation);

//----------------- Draw ----------------------
    
    function draw(){
        state.context.canvas.save();
        state.context.canvas.translate(state.context.clientRect.x, state.context.clientRect.y);

        //Base
        state.context.canvas.beginPath();
        state.context.canvas.strokeStyle = state.axis[axis].baseColor;
        state.context.canvas.globalAlpha = state.axis[axis].baseOpacity;
        state.context.canvas.lineWidth = state.axis[axis].baseWidth;
        if(axis === "x"){
            state.context.canvas.moveTo(0, translation);
            state.context.canvas.lineTo(state.context.clientRect.width, translation);
        }
        if(axis === "y"){
            state.context.canvas.moveTo(translation, 0);
            state.context.canvas.lineTo(translation, state.context.clientRect.height);
        }
        state.context.canvas.stroke();

        //Ticks
        state.context.canvas.beginPath();
        state.context.canvas.strokeStyle = state.axis[axis].tickColor;
        state.context.canvas.globalAlpha = state.axis[axis].tickOpacity;
        state.context.canvas.lineWidth = state.axis[axis].tickWidth;
        positions.forEach(item=>{
            if(item === 0) return;
            const coor = Math.round(state.scale.primary[axis].map(item)) + state.axis[axis].tickWidth%2 * 0.5;
            if(axis==="x"){
                state.context.canvas.moveTo(coor, translation-state.axis[axis].tickSize);
                state.context.canvas.lineTo(coor, translation+state.axis[axis].tickSize);
            }
            if(axis==="y"){
                state.context.canvas.moveTo(translation-state.axis[axis].tickSize, coor);
                state.context.canvas.lineTo(translation+state.axis[axis].tickSize, coor);
            }
        });
        state.context.canvas.stroke();

        //text
        state.context.canvas.textBaseline = "top";
        state.context.canvas.fillStyle = state.axis[axis].textColor;
        state.context.canvas.globalAlpha = state.axis[axis].textOpacity;
        state.context.canvas.font = `${state.axis[axis].textSize} ${state.axis[axis].textFont}`;
        rects?.forEach((item, index)=>{
            if(positions[index] === 0) return;

            state.context.canvas.fillText(labels[index], item.x, item.y);
        });

        state.context.canvas.restore();

    }
               
    
//---------------------------------------------    

    return {
        positions,
        labels,
        draw,
        rects
    };
}



//---------------------------------------------
//----------- Compute Positions ---------------

function computePositions(scale:Mapping, ticks: "auto" | number | Array<number>, minSpacing:number) : Array<number>{
    const fullDomain = Math.abs(scale.domain[1] - scale.domain[0]);
    let positions : Array<number> = [];

    switch(typeof(ticks)){
        case "string":
            positions = autoCompute(scale, minSpacing);
            break;

        case "number":
            const delta = fullDomain/(ticks-1);
            for(let i=0; i<ticks; i++)
                positions.push(scale.domain[0] + delta*i);
            
            break;
        
        case "object":
            ticks.forEach(item=>{
                if(item>=scale.domain[0] && item<=scale.domain[1])
                    positions.push(item);
            });
            break;
    }

    return positions;
}

//---------------------------------------------
//------------- Auto Compute ------------------

function autoCompute(scale:Mapping, minSpacing:number):Array<number>{
    const fullRange = Math.abs(scale.range[1] - scale.range[0]);
    let positions : Array<number> = [];

    if(scale.type==="linear"){
        const minPartition = Math.floor(fullRange/minSpacing);
        if(minPartition<1){
            positions.push(scale.domain[0]);
            positions.push(scale.domain[1]);
            return positions;
        }

        const minDomainSpacing = Math.abs((scale.domain[1] - scale.domain[0])/minPartition);
        const tickMultiplier = [1,2,5,10]; //Order is important!!
        let magnitudeOrder = Math.floor(Math.log10(minDomainSpacing));
        let multiplier : number = 1;
        for(let i=0; i<3; i++){
            if(minDomainSpacing/Math.pow(10,magnitudeOrder) <= tickMultiplier[i])
                break;
            multiplier = tickMultiplier[i+1];
        }
        const start = scale.domain[0]<scale.domain[1]?scale.domain[0]:scale.domain[1];
        const end = scale.domain[1]>scale.domain[0]?scale.domain[1]:scale.domain[0];
        let multCounter = Math.ceil(start / (multiplier*Math.pow(10,magnitudeOrder)));
        const divisions = Math.floor((end - multCounter*multiplier*Math.pow(10,magnitudeOrder)) / (multiplier*Math.pow(10,magnitudeOrder)));   

        for(let i=0; i<=divisions; i++){
            const newPosition = (multCounter+i)*multiplier*Math.pow(10,magnitudeOrder);
            positions.push(newPosition);
        }
    }
    else{

    }


    return positions;
}

//---------------------------------------------
//------------- Create Labels -----------------

function createLabels(positions:Array<number>, suffix?:string) : Array<string>{
    return positions.map(position=>{
        let label : string = "";
        const magnitudeOrder = position===0? 0 : Math.floor(Math.log10(Math.abs(position)));
     
        if(magnitudeOrder<-2 || magnitudeOrder>3){
            const fixed = Number.isInteger(position/Math.pow(10,magnitudeOrder)) ? 0 : 2;
            const temp = position.toExponential(fixed).split("e");
            label = (fixed===2 && temp[0].endsWith("0")) ? [temp[0].slice(0,-1),temp[1]].join("e") : temp.join("e");
            label = label.replace("e","x10").replace("-", "– ");
        }
        else{
            const fixed = Number.isInteger(position) ? 0 : 2;
            const temp = position.toFixed(fixed);
            label = (fixed===2 && temp.endsWith("0")) ? temp.slice(0,-1) : temp;
            label = label.replace("-", "– ");
            if(Math.abs(position)>999){
                const caracteres = label.split("");
                caracteres.splice(label.indexOf("– ")+2,0,",");
                label = caracteres.join("");
            }
        }

        if(suffix != null)
            label = `${label}${suffix}`;
            
        return label;
    });
}

//---------------------------------------------
//--------------- Compute rects ---------------

function computeRects(positions:Array<number>, labels:Array<string>, axis:"x"|"y", state:Graph2D_State, translation:number) : Array<Label_Rect> | undefined{
    if(state.axis.position !== "center") return;
    
    let rects : Array<Label_Rect> = [];

    positions.forEach((item, index)=>{
        const coord1 = state.scale.primary[axis].map(item); //coordinate 1
        const textSize = getTextSize(labels[index], axis, state);
        let coord2 = translation; //coordinate 2

        if(state.axis[axis].dynamic){
            const textDistance = axis==="x" ? textSize.height : textSize.width;
            const margin = axis==="x" ? state.margin.y.end : state.margin.x.start;
            let threshold = -margin -textDistance -labelOffset -state.axis[axis].tickSize;
            threshold = axis==="x" ? threshold + state.context.clientRect.height : threshold;
            const auxTranslation = axis==="x"? translation : -translation
            
            if(auxTranslation > threshold){
                const maxOffset = 2*labelOffset + 2*state.axis[axis].tickSize + textDistance;
                if(axis==="x"){
                    const offset = mapping({
                        from : [threshold, threshold+textDistance+labelOffset+state.axis[axis].tickSize],
                        to : [0, maxOffset]
                    }).map(translation);
                    coord2 -= offset > maxOffset ? maxOffset : offset;    
                }
                if(axis==="y"){
                    const offset = mapping({
                        from : [-threshold, -threshold-textDistance-labelOffset-state.axis[axis].tickSize],
                        to : [0, maxOffset]
                    }).map(translation);
                    coord2 += offset > maxOffset ? maxOffset : offset;
                }
            }
        }

        const x = axis==="x" ? coord1 - textSize.width/2 : coord2 - state.axis[axis].tickSize - labelOffset - textSize.width;
        const y = axis==="x" ? coord2 + state.axis[axis].tickSize + labelOffset : coord1 - textSize.height/2;

        rects.push({ x, y, width : textSize.width, height: textSize.height});

    });
    

    return rects;
}

//---------------------------------------------
//----------- Compute Translation -------------

    function computeTranslation(state:Graph2D_State, axis:"x"|"y") : number{
        let translation : number = 0;
        const complementary = axis==="x"?"y":"x";
        const clientSize = axis==="x" ? state.context.clientRect.height : state.context.clientRect.width;

        switch(state.axis.position){
            case "center":
                translation = state.scale.primary[complementary].map(0);

                if(state.axis[axis].contained){
                    if(translation < state.margin[complementary].start)
                        translation = state.margin[complementary].start;
                    
                    if(translation > clientSize - state.margin[complementary].end)
                        translation = clientSize - state.margin[complementary].end;
                }
                break;

            case "bottom-left":
                break;

            case "bottom-right":
                break;

            case "top-left":
                break;

            case "top-right":
                break;
        }

        translation = Math.round(translation) + state.axis[axis].baseWidth%2 * 0.5;
        return translation;

    }

//---------------------------------------------
//----------------- Text Size -----------------

    function getTextSize(text:string, axis:"x"|"y", state:Graph2D_State) : {width:number, height:number}{
        state.context.canvas.save();
        state.context.canvas.font = `${state.axis[axis].textSize}px ${state.axis[axis].textFont}`;
        const metrics = state.context.canvas.measureText(text);
        state.context.canvas.restore();

        return {
            width : metrics.width,
            height : metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent
        }
    }

//---------------------------------------------




export default CreateAxis;