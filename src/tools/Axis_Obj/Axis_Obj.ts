import { Graph2D_State } from "../../Graph2D/Graph2D_Types.js";
import mapping from "../Mapping/Mapping.js";
import { Mapping } from "../Mapping/Mapping_Types.js";
import { Axis_Obj, CreateAxis_Props, Draw_Axis_Props, Label_Rect } from "./Axis_Obj_Types";

const minSpacing = 45;  //Minimun space between ticks in pixels

function CreateAxis({state, axis, ticks="auto"}:CreateAxis_Props) : Axis_Obj{
    const positions = computePositions(state.scale.primary[axis], ticks);
    const labels = createLabels(positions, state.axis[axis].unit);
    const translation = computeTranslation(state, axis);
    const rects =  computeRects(positions, labels, axis, state);
    const labelOffset = 4;

//----------------- Draw ----------------------
    
    function draw({context, type, color, opacity, text, width, position=0, tickSize, dynamic=true, contained=true} : Draw_Axis_Props){
        context.canvas.save();
        context.canvas.translate(context.clientRect.x, context.clientRect.y);

        switch(type){
            case "centerX":{
                let translation = position;

                if(contained){
                    if(translation < context.margin.top)
                        translation = context.margin.top;

                    if(translation > context.clientRect.height - context.margin.bottom)
                        translation = context.clientRect.height - context.margin.bottom;
                }

                //Base
                translation = Math.round(translation) + width.base%2 * 0.5;
                context.canvas.beginPath();
                context.canvas.strokeStyle = color.base;
                context.canvas.globalAlpha = opacity.base;
                context.canvas.lineWidth = width.base;
                context.canvas.moveTo(0, translation);
                context.canvas.lineTo(context.clientRect.width, translation);
                context.canvas.stroke();

                //Ticks
                context.canvas.beginPath();
                context.canvas.strokeStyle = color.tick;
                context.canvas.globalAlpha = opacity.tick;
                context.canvas.lineWidth = width.tick;
                positions.forEach(item=>{
                    if(item === 0) return;
                    const coor = Math.round(scale.map(item)) + width.tick%2 * 0.5;
                    context.canvas.moveTo(coor, translation-tickSize);
                    context.canvas.lineTo(coor, translation+tickSize);
                });
                context.canvas.stroke();

                //text
                context.canvas.textAlign = "center";
                context.canvas.textBaseline = "top";
                context.canvas.fillStyle = color.text;
                context.canvas.globalAlpha = opacity.text;
                context.canvas.font = `${text.size} ${text.font}`;
                labels.forEach((item, index)=>{
                    if(positions[index] === 0) return;

                    const xCoor = scale.map(positions[index]);
                    let yCord = translation+tickSize+labelOffset;
                    
                    if(dynamic){
                        const metrics = context.canvas.measureText(item);
                        const height = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
                        
                        if(translation > context.clientRect.height - context.margin.bottom - height - labelOffset - tickSize){
                            const maxOffset = 2*labelOffset+2*tickSize+height;
                            const offset = mapping({
                                from : [context.clientRect.height-context.margin.bottom-height-labelOffset-tickSize, context.clientRect.height-context.margin.bottom],
                                to : [0, maxOffset]
                            }).map(translation);
                            yCord -= offset > maxOffset ? maxOffset : offset;
                        }
                    }
                    
                    context.canvas.fillText(item, xCoor, yCord);
                });

                }
                break;
                
            case "centerY":{
                let translation = position;

                if(contained){
                    if(translation < context.margin.start)
                        translation = context.margin.start;

                    if(translation > context.clientRect.width - context.margin.end)
                        translation = context.clientRect.width - context.margin.end;
                }
        
                //Base
                translation = Math.round(translation) + width.base%2 * 0.5;
                context.canvas.beginPath();
                context.canvas.strokeStyle = color.base;
                context.canvas.globalAlpha = opacity.base;
                context.canvas.lineWidth = width.base;
                context.canvas.moveTo(translation, 0);
                context.canvas.lineTo(translation, context.clientRect.height);
                context.canvas.stroke();

                //Ticks
                context.canvas.beginPath();
                context.canvas.strokeStyle = color.tick;
                context.canvas.globalAlpha = opacity.tick;
                context.canvas.lineWidth = width.tick;
                positions.forEach(item=>{
                    if(item === 0) return;
                    const coor = Math.round(scale.map(item)) + width.tick%2 * 0.5;
                    context.canvas.moveTo(translation-tickSize, coor);
                    context.canvas.lineTo(translation+tickSize, coor);
                });
                context.canvas.stroke();

                //text
                context.canvas.textAlign = "end";
                context.canvas.textBaseline = "middle";
                context.canvas.fillStyle = color.text;
                context.canvas.font = `${text.size} ${text.font}`;
                context.canvas.globalAlpha = opacity.text;
                labels.forEach((item, index)=>{
                    if(positions[index] === 0) return;

                    const yCoor = scale.map(positions[index]);
                    let xCord = translation-tickSize-labelOffset;

                    if(dynamic){
                        const width = context.canvas.measureText(item).width;
                        
                        if(translation < context.margin.start + width + labelOffset + tickSize){
                            const maxOffset = 2*labelOffset+2*tickSize+width;
                            const offset = mapping({
                                from : [context.margin.start + width + labelOffset + tickSize, context.margin.start],
                                to : [0, maxOffset]
                            }).map(translation);
                            xCord += offset > maxOffset ? maxOffset : offset;
                        }
                    }

                    context.canvas.fillText(item, xCord, yCoor);

                });

                }
                break;
                
            case "left":
                break;

            case "right":
                break;
                
            case "top":
                break;
                
            case "bottom":
                break;
            }
        
        context.canvas.restore();
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

function computePositions(scale:Mapping, ticks: "auto" | number | Array<number>) : Array<number>{
    const fullDomain = Math.abs(scale.domain[1] - scale.domain[0]);
    let positions : Array<number> = [];

    switch(typeof(ticks)){
        case "string":
            positions = autoCompute(scale);
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

function autoCompute(scale:Mapping):Array<number>{
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

function computeRects(positions:Array<number>, labels:Array<string>, axis:"x"|"y", state:Graph2D_State) : Array<Label_Rect> | undefined{
    if(state.axis.position !== "center") return;
    
    let rects : Array<Label_Rect>;
    const complementary = axis==="x"?"y":"x";

    positions.forEach((item, index)=>{
        if(item === 0) return;

        const coordinate = state.scale.primary[axis].map(item);

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







export default CreateAxis;