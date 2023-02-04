import { Axis_Property, Graph2D_State } from "../../Graph2D/Graph2D_Types.js";
import mapping from "../Mapping/Mapping.js";
import { Mapping } from "../Mapping/Mapping_Types.js";
import { Axis_Obj, Compute_Sizes, CreateAxis_Props, Create_Labels, Label_Rect } from "./Axis_Obj_Types";

function CreateAxis({state, axis, scale}:CreateAxis_Props) : Axis_Obj{
    const complementary = axis==="x"?"y":"x";
    const scaleUsed = (state.scale[scale] as Axis_Property<Mapping>)[axis];
    const compScale = (state.scale[scale] as Axis_Property<Mapping>)[complementary];
    const positions = computePositions(scaleUsed, state.axis[axis].ticks, state.axis[axis].minSpacing);
    const {labels} = createLabels(positions, axis, state);
    const {translation, axisStart, axisEnd} = computeSizes(state, axis, compScale, scale);
    const rects =  computeRects(positions, labels, axis, state, translation, scaleUsed, scale);

//----------------- Draw ----------------------
    
    function draw(){
        const margin = 2;
        state.context.canvas.save();
        state.context.canvas.translate(state.context.clientRect.x, state.context.clientRect.y);

        //Base
        state.context.canvas.strokeStyle = state.axis[axis].baseColor;
        state.context.canvas.globalAlpha = state.axis[axis].baseOpacity;
        state.context.canvas.lineWidth = state.axis[axis].baseWidth;
        state.context.canvas.beginPath();
        if(axis === "x"){
            state.context.canvas.moveTo(axisStart, translation);
            state.context.canvas.lineTo(axisEnd, translation);
        }
        if(axis === "y"){
            state.context.canvas.moveTo(translation, axisStart);
            state.context.canvas.lineTo(translation, axisEnd);
        }
        state.context.canvas.stroke();

        //Ticks
        state.context.canvas.strokeStyle = state.axis[axis].tickColor;
        state.context.canvas.globalAlpha = state.axis[axis].tickOpacity;
        state.context.canvas.lineWidth = state.axis[axis].tickWidth;
        state.context.canvas.beginPath();
        positions.forEach(item=>{
            if(item === 0 && state.axis.position === "center") return;

            const coor = Math.round(scaleUsed.map(item)) + state.axis[axis].tickWidth%2 * 0.5;

            switch(state.axis.position){
                case "center":
                    if(axis==="x"){
                        state.context.canvas.moveTo(coor, translation - state.axis[axis].tickSize);
                        state.context.canvas.lineTo(coor, translation + state.axis[axis].tickSize);
                    }
                    if(axis==="y"){
                        state.context.canvas.moveTo(translation - state.axis[axis].tickSize, coor);
                        state.context.canvas.lineTo(translation + state.axis[axis].tickSize, coor);
                    }
                    break;

                case "bottom-left":
                    if(axis==="x"){
                        state.context.canvas.moveTo(coor, translation);
                        state.context.canvas.lineTo(coor, translation + state.axis[axis].tickSize);
                    }
                    if(axis==="y"){
                        state.context.canvas.moveTo(translation - state.axis[axis].tickSize, coor);
                        state.context.canvas.lineTo(translation, coor);
                    }
                    break;
                
                case "bottom-right":
                    if(axis==="x"){
                        state.context.canvas.moveTo(coor, translation);
                        state.context.canvas.lineTo(coor, translation + state.axis[axis].tickSize);
                    }
                    if(axis==="y"){
                        state.context.canvas.moveTo(translation, coor);
                        state.context.canvas.lineTo(translation + state.axis[axis].tickSize, coor);
                    }
                    break;

                case "top-left":
                    if(axis==="x"){
                        state.context.canvas.moveTo(coor, translation - state.axis[axis].tickSize);
                        state.context.canvas.lineTo(coor, translation);
                    }
                    if(axis==="y"){
                        state.context.canvas.moveTo(translation - state.axis[axis].tickSize, coor);
                        state.context.canvas.lineTo(translation, coor);
                    }
                    break;

                case "top-right":
                    if(axis==="x"){
                        state.context.canvas.moveTo(coor, translation - state.axis[axis].tickSize);
                        state.context.canvas.lineTo(coor, translation);
                    }
                    if(axis==="y"){
                        state.context.canvas.moveTo(translation, coor);
                        state.context.canvas.lineTo(translation + state.axis[axis].tickSize, coor);
                    }
                    break;
            }
        });
        state.context.canvas.stroke();

        //Text
        state.context.canvas.textBaseline = "top";
        state.context.canvas.font = `${state.axis[axis].textSize} ${state.axis[axis].textFont}`;
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

            state.context.canvas.fillStyle = state.axis[axis].textColor;
            state.context.canvas.globalAlpha = state.axis[axis].textOpacity;
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

export function computePositions(scale:Mapping, ticks: "auto" | number | Array<number>, minSpacing:number) : Array<number>{
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

export function createLabels(positions:Array<number>, axis:"x"|"y", state:Graph2D_State) : Create_Labels{
    let maxWidth : number = 0;
    let maxHeight : number = 0;

    state.context.canvas.save();
    state.context.canvas.font = `${state.axis[axis].textSize} ${state.axis[axis].textFont}`;

    const labels = positions.map(position=>{
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

        label = `${label}${state.axis[axis].unit}`;
        
        const width = state.context.canvas.measureText(label).width; 
        if(width > maxWidth)
            maxWidth = width;
            
        return label;
    });
    
    const metrics = state.context.canvas.measureText(labels[0]);
    maxHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
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
        const textSize = getTextSize(labels[index], axis, state);
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


        let x = axis==="x" ? coord1 - textSize.width/2 : coord2 - state.axis[axis].tickSize - state.labelOffset - textSize.width;
        let y = axis==="x" ? coord2 + state.axis[axis].tickSize + state.labelOffset : coord1 - textSize.height/2;

        if(scale === "primary"){
            if(state.axis.position === "bottom-right")
                x = axis==="x" ? x : coord2 + state.axis[axis].tickSize + state.labelOffset;
            
            if(state.axis.position === "top-left")
                y = axis==="x" ? coord2 - textSize.height - state.axis[axis].tickSize - state.labelOffset : y;
    
            if(state.axis.position === "top-right"){
                x = axis==="x" ? x : coord2 + state.axis[axis].tickSize + state.labelOffset;
                y = axis==="x" ? coord2 - textSize.height - state.axis[axis].tickSize - state.labelOffset : y;
            }
        }
        if(scale === "secondary"){
            if(state.axis.position === "bottom-left"){
                x = axis==="x" ? x : coord2 + state.axis[axis].tickSize + state.labelOffset;
                y = axis==="x" ? coord2 - textSize.height - state.axis[axis].tickSize - state.labelOffset : y;
            }

            if(state.axis.position === "bottom-right")
                y = axis==="x" ? coord2 - textSize.height - state.axis[axis].tickSize - state.labelOffset : y;

            if(state.axis.position === "top-left")
                x = axis==="x" ? x : coord2 + state.axis[axis].tickSize + state.labelOffset;
        }

        rects.push({ x, y, width : textSize.width, height: textSize.height});

    });
    

    return rects;
}

//---------------------------------------------
//----------- Compute Translation -------------

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

                    axisStart = secondaryEnabled*(state.margin.y.end + state.axisObj.secondary.width);
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

                    axisStart = secondaryEnabled*(state.margin.y.end + state.axisObj.secondary.width);
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

                    axisStart = state.margin.y.end + state.axisObj.primary.width;
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

        translation = Math.round(translation) + state.axis[axis].baseWidth%2 * 0.5;
        return {
            translation,
            axisStart,
            axisEnd
        };

    }

//---------------------------------------------
//----------------- Text Size -----------------

    function getTextSize(text:string, axis:"x"|"y", state:Graph2D_State) : {width:number, height:number}{
        state.context.canvas.save();
        state.context.canvas.font = `${state.axis[axis].textSize} ${state.axis[axis].textFont}`;
        const metrics = state.context.canvas.measureText(text);
        state.context.canvas.restore();

        return {
            width : metrics.width,
            height : metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent
        }
    }

//---------------------------------------------




export default CreateAxis;