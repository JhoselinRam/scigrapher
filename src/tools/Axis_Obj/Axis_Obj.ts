import { Axis_Property, Graph2D_State, Secondary_Axis } from "../../Graph2D/Graph2D_Types.js";
import mapping from "../Mapping/Mapping.js";
import { Mapping } from "../Mapping/Mapping_Types.js";
import { Axis_Obj, Compute_Sizes, CreateAxis_Props, Create_Labels, Label_Rect } from "./Axis_Obj_Types";

function CreateAxis({state, axis, scale}:CreateAxis_Props) : Axis_Obj{
    const complementary = axis==="x"?"y":"x";
    const axisUsed = scale==="primary"? state.axis[axis] : state.secondary[axis] as Secondary_Axis;
    const scaleUsed = (state.scale[scale] as Axis_Property<Mapping>)[axis];
    const compScale = (state.scale[scale] as Axis_Property<Mapping>)[complementary];
    const positions = computePositions(scaleUsed, axisUsed.ticks, axisUsed.minSpacing);
    const {labels} = createLabels(positions, axis, state, scale);
    const {translation, axisStart, axisEnd} = computeSizes(state, axis, compScale, scale);
    const rects =  computeRects(positions, labels, axis, state, translation, scaleUsed, scale);

//----------------- Draw ----------------------
    
    function draw(){
        const margin = 2;
        const translationUsed = Math.round(translation) + axisUsed.baseWidth%2 * 0.5;

        state.context.canvas.save();
        state.context.canvas.translate(state.context.clientRect.x, state.context.clientRect.y);

        //Base
        state.context.canvas.strokeStyle = axisUsed.baseColor;
        state.context.canvas.globalAlpha = axisUsed.baseOpacity;
        state.context.canvas.lineWidth = axisUsed.baseWidth;
        state.context.canvas.beginPath();
        if(axis === "x"){
            state.context.canvas.moveTo(axisStart, translationUsed);
            state.context.canvas.lineTo(axisEnd, translationUsed);
        }
        if(axis === "y"){
            state.context.canvas.moveTo(translationUsed, axisStart);
            state.context.canvas.lineTo(translationUsed, axisEnd);
        }
        state.context.canvas.stroke();

        //Ticks
        state.context.canvas.strokeStyle = axisUsed.tickColor;
        state.context.canvas.globalAlpha = axisUsed.tickOpacity;
        state.context.canvas.lineWidth = axisUsed.tickWidth;
        state.context.canvas.beginPath();
        positions.forEach(item=>{
            if(item === 0 && state.axis.position === "center") return;

            const coor = Math.round(scaleUsed.map(item)) + axisUsed.tickWidth%2 * 0.5;

            if(state.axis.position === "center"){
                if(axis==="x"){
                    state.context.canvas.moveTo(coor, translationUsed - axisUsed.tickSize);
                    state.context.canvas.lineTo(coor, translationUsed + axisUsed.tickSize);
                }
                if(axis==="y"){
                    state.context.canvas.moveTo(translationUsed - axisUsed.tickSize, coor);
                    state.context.canvas.lineTo(translationUsed + axisUsed.tickSize, coor);
                }
            }
            else{
                let direction : number
                switch(state.axis.position){
                    case "bottom-left":
                        if(axis==="x")
                            direction = scale==="primary"? 1 : -1;
                        else
                            direction = scale==="primary"? -1 : 1;
                        break;
                    
                    case "bottom-right":
                        direction = scale==="primary"? 1 : -1;
                        break;

                    case "top-left":
                        direction = scale==="primary"? -1 : 1;
                        break;

                    case "top-right":
                        if(axis==="x")
                            direction = scale==="primary"? -1 : 1;
                        else
                            direction = scale==="primary"? 1 : -1;
                        break
                }
                if(axis==="x"){
                    state.context.canvas.moveTo(coor, translationUsed);
                    state.context.canvas.lineTo(coor, translationUsed + direction*axisUsed.tickSize);
                }
                if(axis==="y"){
                    state.context.canvas.moveTo(translationUsed + direction*axisUsed.tickSize, coor);
                    state.context.canvas.lineTo(translationUsed, coor);
                }
            }
        });
        state.context.canvas.stroke();

        //Text
        state.context.canvas.textBaseline = "top";
        state.context.canvas.font = `${axisUsed.textSize} ${axisUsed.textFont}`;
        rects.forEach((item, index)=>{
            if(positions[index] === 0 && state.axis.position === "center") return;

            if(state.axis[axis].overlap && state.axis.position === "center"){
                //Clear the area for the label
                state.context.canvas.clearRect(item.x-margin, item.y-margin, item.width+2*margin, item.height+2*margin);
                
                //Redraws the backgroun in this area
                state.context.canvas.fillStyle = state.background.color;
                state.context.canvas.globalAlpha = state.background.opacity;
                state.context.canvas.fillRect(item.x-(margin+1), item.y-(margin+1), item.width+2*(margin+1), item.height+2*(margin+1));
            }

            state.context.canvas.fillStyle = axisUsed.textColor;
            state.context.canvas.globalAlpha = axisUsed.textOpacity;
            drawLabel(state.context.canvas, labels[index], item.x, item.y, axisUsed.unit);
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

export function computePositions(scale:Mapping, ticks: "auto" | number | Array<number>, minSpacing:number) : Array<number>{
    const fullDomain = Math.abs(scale.domain[1] - scale.domain[0]);
    let positions : Array<number> = [];

    switch(typeof ticks){
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
    let positions : Array<number> = [];
    const fullRange = Math.abs(scale.range[1] - scale.range[0]);
    const minPartition = Math.floor(fullRange/minSpacing);
    const tickMultiplier = [1,2,5,10]; //Order is important!!
    
    if(minPartition<=1){
        positions.push(scale.domain[0]);
        positions.push(scale.domain[1]);
        return positions;
    }

    if(scale.type==="linear"){
        const minDomainSpacing = Math.abs((scale.domain[1] - scale.domain[0])/minPartition);
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
    
    if(scale.type === "log"){
        const domainStart = Math.abs(scale.domain[0]) < Math.abs(scale.domain[1]) ? Math.abs(scale.domain[0]) : Math.abs(scale.domain[1]);
        const domainEnd = Math.abs(scale.domain[1]) > Math.abs(scale.domain[0]) ? Math.abs(scale.domain[1]) : Math.abs(scale.domain[0]);
        const initialMagnitude = Math.floor(Math.log10(Math.abs(domainStart)));
        const finalMagnitude = Math.floor(Math.log10(Math.abs(domainEnd)));
        
        let magnitudeLeap = 1;
        const unitRange = Math.abs(scale.map(Math.pow(10,initialMagnitude + 1)) - scale.map(Math.pow(10,initialMagnitude)));
    
        if(minSpacing > unitRange){
            const minPartition = Math.ceil(minSpacing/unitRange);
            const minPartitionOrder = Math.floor(Math.log10(minPartition));
            for(let i=0; i<3; i++){
                if(minPartition/Math.pow(10,minPartitionOrder) <= tickMultiplier[i])
                    break;
                magnitudeLeap = tickMultiplier[i+1];
            }
            magnitudeLeap *= Math.pow(10,minPartitionOrder);
        }

        for(let i=initialMagnitude; i<=finalMagnitude; i+=magnitudeLeap){
            const candidate = Math.pow(10,i);            
            
            if(candidate>=domainStart && candidate<=domainEnd){
                if(scale.domain[0]>0 && scale.domain[1]>0)
                    positions.push(candidate);
                if(scale.domain[0]<0 && scale.domain[1]<0)
                    positions.push(-candidate);
            }
        }

    }

    return positions;
}

//---------------------------------------------
//------------- Create Labels -----------------

export function createLabels(positions:Array<number>, axis:"x"|"y", state:Graph2D_State, scale:"primary" | "secondary") : Create_Labels{
    const maxDecimals = 5;
    let maxWidth : number = 0;
    let maxHeight : number = 0;

    const textSizeUsed = scale==="primary"? state.axis[axis].textSize : (state.secondary[axis] as Secondary_Axis).textSize;
    const textFontUsed = scale==="primary"? state.axis[axis].textFont : (state.secondary[axis] as Secondary_Axis).textFont;

    state.context.canvas.save();
    state.context.canvas.font = `${textSizeUsed} ${textFontUsed}`;

    const labels = positions.map(position=>{
        let label : string = "";
        const magnitudeOrder = position===0? 0 : Math.floor(Math.log10(Math.abs(position)));
     
        if(magnitudeOrder<-2 || magnitudeOrder>3){
            const fixed = Number.isInteger(position/Math.pow(10,magnitudeOrder)) ? 0 : maxDecimals;
            let temp = position.toExponential(fixed).split("e");
            if(fixed === maxDecimals){
                for(let i=0; i<maxDecimals; i++){
                    if(!temp[0].endsWith("0"))
                        break;
                    temp[0] = temp[0].slice(0,-1);
                }
            }
            label = temp.join("e");
            label = label.replace("e","x10").replace("-", "– ");

        }
        else{
            const fixed = Number.isInteger(position) ? 0 : maxDecimals;
            let temp = position.toFixed(fixed);
            //Remove tailing ceros.
            if(fixed === maxDecimals){
                for(let i=0; i<maxDecimals; i++){
                    if(!temp.endsWith("0"))
                        break;     
                    temp = temp.slice(0, -1);
                    }
            }
            label = temp
            label = label.replace("-", "– ");
            
            if(Math.abs(position)>999){
                const caracteres = label.split("");
                const commaIndex = label.includes("– ") ? 3 : 1; 
                caracteres.splice(commaIndex,0,",");
                label = caracteres.join("");
            }
        }

        if(scale === "primary")
            label = `${label}${state.axis[axis].unit}`;
        if(scale === "secondary" && state.secondary[axis] != null)
            label = `${label}${(state.secondary[axis] as Secondary_Axis).unit}`;
        
        const textSize = getTextSize(label, axis, state, scale);
        if(textSize.width > maxWidth)
            maxWidth = textSize.width;
        if(textSize.height > maxHeight)
            maxHeight = textSize.height;

            
        return label;
    });
    
    state.context.canvas.restore();
    
    return {
        labels,
        maxWidth,
        maxHeight
    }

}

//---------------------------------------------
//--------------- Compute rects ---------------

function computeRects(positions:Array<number>, labels:Array<string>, axis:"x"|"y", state:Graph2D_State, translation:number, scaleUsed : Mapping, scale:"primary"|"secondary") : Array<Label_Rect>{
    let rects : Array<Label_Rect> = [];

    positions.forEach((item, index)=>{
        const coord1 = scaleUsed.map(item); //coordinate 1
        const textSize = getTextSize(labels[index], axis, state, scale);
        let coord2 = translation; //coordinate 2

        if(state.axis[axis].dynamic && state.axis.position==="center"){
            const textDistance = axis==="x" ? textSize.height : textSize.width;
            const margin = axis==="x" ? state.margin.y.end : state.margin.x.start;
            let threshold = -margin -textDistance -state.labelOffset -state.axis[axis].tickSize;
            threshold = axis==="x" ? threshold + state.context.clientRect.height : threshold;
            const auxTranslation = axis==="x"? translation : -translation
            
            if(auxTranslation > threshold){
                const maxOffset = 2*state.labelOffset + 2*state.axis[axis].tickSize + textDistance;
                if(axis==="x"){
                    const offset = mapping({
                        from : [threshold, threshold+textDistance+state.labelOffset+state.axis[axis].tickSize],
                        to : [0, maxOffset]
                    }).map(translation);
                    coord2 -= offset > maxOffset ? maxOffset : offset;    
                }
                if(axis==="y"){
                    const offset = mapping({
                        from : [-threshold, -threshold-textDistance-state.labelOffset-state.axis[axis].tickSize],
                        to : [0, maxOffset]
                    }).map(translation);
                    coord2 += offset > maxOffset ? maxOffset : offset;
                }
            }
        }

        const axisUsed = scale==="primary"? state.axis[axis] : state.secondary[axis] as Secondary_Axis;
        let x = axis==="x" ? coord1 - textSize.width/2 : coord2 - axisUsed.tickSize - state.labelOffset - textSize.width;
        let y = axis==="x" ? coord2 + axisUsed.tickSize + state.labelOffset : coord1 - textSize.height/2;

        if(scale === "primary"){
            if(state.axis.position === "bottom-right")
                x = axis==="x" ? x : coord2 + axisUsed.tickSize + state.labelOffset;
            
            if(state.axis.position === "top-left")
                y = axis==="x" ? coord2 - textSize.height - axisUsed.tickSize - state.labelOffset : y;
    
            if(state.axis.position === "top-right"){
                x = axis==="x" ? x : coord2 + axisUsed.tickSize + state.labelOffset;
                y = axis==="x" ? coord2 - textSize.height - axisUsed.tickSize - state.labelOffset : y;
            }
        }
        if(scale === "secondary"){
            if(state.axis.position === "bottom-left"){
                x = axis==="x" ? x : coord2 + axisUsed.tickSize + state.labelOffset;
                y = axis==="x" ? coord2 - textSize.height - axisUsed.tickSize - state.labelOffset : y;
            }

            if(state.axis.position === "bottom-right")
                y = axis==="x" ? coord2 - textSize.height - axisUsed.tickSize - state.labelOffset : y;

            if(state.axis.position === "top-left")
                x = axis==="x" ? x : coord2 + axisUsed.tickSize + state.labelOffset;
        }

        rects.push({ x, y, width : textSize.width, height: textSize.height});

    });
    

    return rects;
}

//---------------------------------------------
//-------------- Compute Sizes ----------------

    function computeSizes(state:Graph2D_State, axis:"x"|"y", compScale:Mapping, scale:"primary"|"secondary") : Compute_Sizes{
        let translation = 0;
        let axisStart = 0;
        let axisEnd = 0;


        switch(state.axis.position){
            case "center":
                translation = compScale.map(0);
                let marginStart = 0;
                let marginEnd = 0;
                let clientSize = 0;

                if(axis === "x"){
                    marginStart = state.margin["y"].start;
                    marginEnd = state.margin["y"].end;
                    clientSize = state.context.clientRect.height;
                    axisEnd = state.context.clientRect.width;
                }
                if(axis === "y"){
                    marginStart = state.margin["x"].start;
                    marginEnd = state.margin["x"].end;
                    clientSize = state.context.clientRect.width;
                    axisEnd = state.context.clientRect.height;
                }

                if(state.axis[axis].contained){
                    if(translation < marginStart)
                        translation = marginStart;
                    
                    if(translation > clientSize - marginEnd)
                        translation = clientSize - marginEnd;
                }
                break;

            case "bottom-left":
                if(axis === "x"){
                    const secondaryEnabled = state.axisObj.secondary.width>0? 1 : 0;
                    
                    if(scale === "primary")
                        translation = state.context.clientRect.height - state.margin.y.start - state.axisObj.primary.height;
                    if(scale === "secondary")
                        translation = state.margin.y.end + state.axisObj.secondary.height;

                    axisStart = state.margin.x.start + state.axisObj.primary.width;
                    axisEnd = state.context.clientRect.width - secondaryEnabled*(state.margin.x.end + state.axisObj.secondary.width);
                }
                if(axis==="y"){
                    const secondaryEnabled = state.axisObj.secondary.height>0? 1 : 0;
                    
                    if(scale === "primary")
                        translation = state.margin.x.start + state.axisObj.primary.width;
                    if(scale === "secondary") 
                        translation = state.context.clientRect.width - state.margin.x.end - state.axisObj.secondary.width;

                    axisStart = secondaryEnabled*(state.margin.y.end + state.axisObj.secondary.height);
                    axisEnd = state.context.clientRect.height - state.margin.y.start - state.axisObj.primary.height;
                }
                break;

            case "bottom-right":
                if(axis === "x"){
                    const secondaryEnabled = state.axisObj.secondary.width>0? 1 : 0;
                    
                    if(scale === "primary")
                        translation = state.context.clientRect.height - state.margin.y.start - state.axisObj.primary.height;
                    if(scale === "secondary")
                        translation = state.margin.y.end + state.axisObj.secondary.height;

                    axisStart = secondaryEnabled*(state.margin.x.start + state.axisObj.secondary.width);
                    axisEnd = state.context.clientRect.width - state.margin.x.end - state.axisObj.primary.width;
                }
                if(axis==="y"){
                    const secondaryEnabled = state.axisObj.secondary.height>0? 1 : 0;
                    
                    if(scale === "primary")
                        translation = state.context.clientRect.width - state.margin.x.end - state.axisObj.primary.width;
                    if(scale === "secondary") 
                        translation = state.margin.x.start + state.axisObj.secondary.width;

                    axisStart = secondaryEnabled*(state.margin.y.end + state.axisObj.secondary.height);
                    axisEnd = state.context.clientRect.height - state.margin.y.start - state.axisObj.primary.height;
                }
                break;

            case "top-left":
                if(axis === "x"){
                    const secondaryEnabled = state.axisObj.secondary.width>0? 1 : 0;
                    
                    if(scale === "primary")
                        translation = state.margin.y.end + state.axisObj.primary.height;
                    if(scale === "secondary")
                        translation = state.context.clientRect.height - state.margin.y.start - state.axisObj.secondary.height;

                    axisStart = state.margin.x.start + state.axisObj.primary.width;
                    axisEnd = state.context.clientRect.width - secondaryEnabled*(state.margin.x.end + state.axisObj.secondary.width);
                }
                if(axis==="y"){
                    const secondaryEnabled = state.axisObj.secondary.height>0? 1 : 0;
                    
                    if(scale === "primary")
                        translation = state.margin.x.start + state.axisObj.primary.width;
                    if(scale === "secondary") 
                        translation = state.context.clientRect.width - state.margin.x.end - state.axisObj.secondary.width;

                    axisStart = state.margin.y.end + state.axisObj.primary.height;
                    axisEnd = state.context.clientRect.height - secondaryEnabled*(state.margin.y.start + state.axisObj.secondary.height);
                }
                break;

            case "top-right":
                if(axis === "x"){
                    const secondaryEnabled = state.axisObj.secondary.width>0? 1 : 0;
                    
                    if(scale === "primary")
                        translation = state.margin.y.end + state.axisObj.primary.height;
                    if(scale === "secondary")
                        translation = state.context.clientRect.height - state.margin.y.start - state.axisObj.secondary.height;

                    axisStart = secondaryEnabled*(state.margin.x.start + state.axisObj.secondary.width);
                    axisEnd = state.context.clientRect.width - state.margin.x.end - state.axisObj.primary.width;
                }
                if(axis==="y"){
                    const secondaryEnabled = state.axisObj.secondary.height>0? 1 : 0;
                    
                    if(scale === "primary")
                        translation = state.context.clientRect.width - state.margin.x.end - state.axisObj.primary.width;
                    if(scale === "secondary") 
                        translation = state.margin.x.start + state.axisObj.secondary.width;

                    axisStart = state.margin.y.end + state.axisObj.primary.height;
                    axisEnd = state.context.clientRect.height - secondaryEnabled*(state.margin.y.start + state.axisObj.secondary.height);
                }
                break;
        }


        return {
            translation,
            axisStart,
            axisEnd
        };

    }

//---------------------------------------------
//----------------- Text Size -----------------

    function getTextSize(text:string, axis:"x"|"y", state:Graph2D_State, scale:"primary"|"secondary") : {width:number, height:number}{
        const textSizeUsed = scale==="primary"? state.axis[axis].textSize : (state.secondary[axis] as Secondary_Axis).textSize;
        const textFontUsed = scale==="primary"? state.axis[axis].textFont : (state.secondary[axis] as Secondary_Axis).textFont;
        let width = 0;
        let height = 0;
        
        state.context.canvas.save();
        state.context.canvas.font = `${textSizeUsed} ${textFontUsed}`;
        
        if(!text.includes("x10")){
            const metrics = state.context.canvas.measureText(text);
            width = metrics.width;
            height = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
        }
        else{
            const scaleFactor = 0.85;
            const unit =  scale === "primary"? state.axis[axis].unit : (state.secondary[axis] as Secondary_Axis).unit;

            const parts = text.split("x10");
            const number = `${parts[0]}x10`
            const exponent = parts[1].replace("+", "").replace(unit, "");
            
            const metrics0 = state.context.canvas.measureText(number);
            const metrics1 = state.context.canvas.measureText(exponent);
            const metrics2 = state.context.canvas.measureText(unit);

            width = metrics0.width  + metrics1.width*scaleFactor + metrics2.width;
            height = metrics0.actualBoundingBoxAscent + metrics0.actualBoundingBoxDescent;
        }
        
        state.context.canvas.restore();

        return {
            width,
            height
        }
    }

//---------------------------------------------
//--------------- Draw Label ------------------

    function drawLabel(context:CanvasRenderingContext2D, text:string, x:number, y:number, unit:string){
        if(!text.includes("x10")){
            context.fillText(text, x, y);
            return;
        }

        const scaleFactor = 0.85;
        const parts = text.split("x10");
        const number = `${parts[0]}x10`
        const exponent = parts[1].replace("+", "").replace(unit, "");
        const exponentStart = context.measureText(number).width;
        const unitStart = exponentStart + context.measureText(exponent).width*scaleFactor + 1;

        context.fillText(number, x, y);
        context.save();
        context.translate(x+exponentStart, y);
        context.scale(scaleFactor, scaleFactor);
        context.fillText(exponent, 0, -2);
        context.restore();
        context.fillText(unit, x+unitStart, y);
    }

//---------------------------------------------




export default CreateAxis;