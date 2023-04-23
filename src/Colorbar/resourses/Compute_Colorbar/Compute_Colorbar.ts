import { Heat_Map } from "../../../Data/HeatMap/Heat_Map_Types.js";
import { Graph2D_State } from "../../../Graph2D/Graph2D_Types.js";
import colorInterpolator from "../../../tools/Color_Map/Color_Interpolator.js";
import { formatNumber, getTextSize } from "../../../tools/Helplers/Helplers.js";
import mapping from "../../../tools/Mapping/Mapping.js";
import { Mapping } from "../../../tools/Mapping/Mapping_Types.js";
import { Colorbar_Entries, Colorbar_Method_Generator, Colorbar_State } from "../../Colorbar_Types";
import { Compute_Colorbar } from "./Compute_Colorbar_Types";

function ComputeColorbar({barState, state} : Colorbar_Method_Generator) : Compute_Colorbar{
    
//---------------------------------------------
    
    function compute(){
        if(!barState.enable) return;

        let gradientSteps : Array<{position:number, color:string}> = [];
        barState.gradient.entries = [];
        


        //Compute the gradient components
        if(typeof barState.data === "string"){
            [gradientSteps, barState.gradient.entries] = idCompute(barState.data);
        }
        if(typeof barState.data === "object"){
            barState.data.sort((a,b) => a.position - b.position);
            const maxPosition = barState.data[barState.data.length-1].position;
            barState.data.forEach(item => {
                const position = barState.reverse ? 1 - item.position/maxPosition : item.position/maxPosition;
                
                barState.gradient.entries.push({
                    position,
                    color : item.color,
                    label : `${item.label}${barState.unit}`
                })
                
                gradientSteps.push({position, color:item.color})
            });
        }







        //Compute the absolute sizes and change the margin if needed
        const graphRect = state.context.graphRect();
        const titleSize = getTextSize(barState.title.text, barState.title.size, barState.title.font, barState.title.specifier, state.context.data);
        let labelWidth = 0;
        let labelHeight = 0;

        barState.gradient.entries.forEach(item=>{
            const size = getTextSize(item.label, barState.label.size, barState.label.font, barState.label.specifier, state.context.data);
            
            if(size.width > labelWidth)
                labelWidth = size.width;
            if(size.height > labelHeight)
                labelHeight = size.height;
        });

        
        if(typeof barState.position === "string"){
            switch(barState.position){
                case "x-start":{
                    //Size
                    barState.metrics.width = barState.width + barState.textOffset + labelWidth;
                    barState.metrics.height = (graphRect.height - 2*state.marginUsed.defaultMargin) * barState.size;
                    barState.gradient.gradientObject = state.context.data.createLinearGradient(0, barState.metrics.height, 0, 0);
    
                    if(barState.title.text !== "") barState.metrics.width += barState.textOffset + titleSize.height; 
                    
                    //Margin
                    const minMargin = barState.metrics.width + 6*state.marginUsed.defaultMargin;
                    if(state.marginUsed.x.start < minMargin) 
                        state.marginUsed.x.start = minMargin;
                        
                    //Coordinates
                    let startPosition = 0;
                    if(barState.title.text !== ""){
                        if(barState.title.position === "start"){
                            barState.metrics.titleCoord = 0;
                            startPosition = titleSize.height + barState.textOffset;
                        }
                        else
                            barState.metrics.titleCoord = barState.metrics.width - titleSize.height;
                    }
                    if(barState.label.position === "start"){
                        barState.metrics.labelCoord = startPosition + labelWidth;
                        barState.metrics.barCoord = barState.metrics.labelCoord + barState.textOffset;
                    }
                    if(barState.label.position === "end"){
                        barState.metrics.barCoord = startPosition;
                        barState.metrics.labelCoord = barState.metrics.barCoord + barState.width + barState.textOffset;
                    }
                }
                break;
    
                case "x-end":{
                    //Size
                    barState.metrics.width = barState.width + barState.textOffset + labelWidth;
                    barState.metrics.height = (graphRect.height - 2*state.marginUsed.defaultMargin) * barState.size;
                    barState.gradient.gradientObject = state.context.data.createLinearGradient(0, barState.metrics.height, 0, 0);
    
                    if(barState.title.text !== "") barState.metrics.width += barState.textOffset + titleSize.height;
    
                    //Margin
                    const minMargin = barState.metrics.width + 6*state.marginUsed.defaultMargin;
                    if(state.marginUsed.x.end < minMargin) 
                        state.marginUsed.x.end = minMargin;
    
                    //Coordinates
                    let startPosition = 0;
                    if(barState.title.text !== ""){
                        if(barState.title.position === "start"){
                            barState.metrics.titleCoord = 0;
                            startPosition = titleSize.height + barState.textOffset;
                        }
                        else
                            barState.metrics.titleCoord = barState.metrics.width - titleSize.height;
                    }
                    if(barState.label.position === "start"){
                        barState.metrics.labelCoord = startPosition + labelWidth;
                        barState.metrics.barCoord = barState.metrics.labelCoord + barState.textOffset;
                    }
                    if(barState.label.position === "end"){
                        barState.metrics.barCoord = startPosition;
                        barState.metrics.labelCoord = barState.metrics.barCoord + barState.width + barState.textOffset;
                    }
                }
               break;
    
                case "y-start":{
                    //Size
                    barState.metrics.width = (graphRect.width - 2*state.marginUsed.defaultMargin) * barState.size;
                    barState.metrics.height = barState.width + barState.textOffset + labelHeight;
                    barState.gradient.gradientObject = state.context.data.createLinearGradient(0, 0, barState.metrics.width, 0);
    
                    if(barState.title.text !== "") barState.metrics.height += barState.textOffset + titleSize.height;
    
                    //Margin
                    const minMargin = barState.metrics.height + 6*state.marginUsed.defaultMargin;
                    if(state.marginUsed.y.start < minMargin) 
                        state.marginUsed.y.start = minMargin;
    
                    //Coordinates
                    let startPosition = 0;
                    if(barState.title.text !== ""){
                        if(barState.title.position === "start")
                            barState.metrics.titleCoord = barState.metrics.height - titleSize.height;
                        else{
                            barState.metrics.titleCoord = 0;
                            startPosition = titleSize.height + barState.textOffset
                        }
                    }
                    if(barState.label.position === "start"){
                        barState.metrics.barCoord = startPosition;
                        barState.metrics.labelCoord = barState.metrics.barCoord + barState.width + barState.textOffset;
                    }
                    if(barState.label.position === "end"){
                        barState.metrics.labelCoord = startPosition;
                        barState.metrics.barCoord = startPosition + labelHeight + barState.textOffset;
                    }
                }
                break;
    
                case "y-end":{
                    //Size
                    barState.metrics.width = (graphRect.width - 2*state.marginUsed.defaultMargin) * barState.size;
                    barState.metrics.height = barState.width + barState.textOffset + labelHeight;
                    barState.gradient.gradientObject = state.context.data.createLinearGradient(0, 0, barState.metrics.width, 0);
    
                    if(barState.title.text !== "") barState.metrics.height += barState.textOffset + titleSize.height;
                
                    //Margin
                    const minMargin = barState.metrics.height + 6*state.marginUsed.defaultMargin;
                    if(state.marginUsed.y.end < minMargin) 
                        state.marginUsed.y.end = minMargin;
    
                    //Coordinates
                    let startPosition = 0;
                    if(barState.title.text !== ""){
                        if(barState.title.position === "start")
                            barState.metrics.titleCoord = barState.metrics.height - titleSize.height;
                        else{
                            barState.metrics.titleCoord = 0;
                            startPosition = titleSize.height + barState.textOffset
                        }
                    }
                    if(barState.label.position === "start"){
                        barState.metrics.barCoord = startPosition;
                        barState.metrics.labelCoord = barState.metrics.barCoord + barState.width + barState.textOffset;
                    }
                    if(barState.label.position === "end"){
                        barState.metrics.labelCoord = startPosition;
                        barState.metrics.barCoord = startPosition + labelHeight + barState.textOffset;
                    }
                }
                break;
            }
        }
        if(typeof barState.position === "object"){
            if(barState.position.orientation === "vertical"){
                //Size
                barState.metrics.width = barState.width + barState.textOffset + labelWidth;
                barState.metrics.height = graphRect.height * barState.size;
                barState.gradient.gradientObject = state.context.data.createLinearGradient(0, barState.metrics.height, 0, 0);

                if(barState.title.text !== "") barState.metrics.width += barState.textOffset + titleSize.height;

                //Coordinates
                let startPosition = 0;
                if(barState.title.text !== ""){
                    if(barState.title.position === "start"){
                        barState.metrics.titleCoord = 0;
                        startPosition = titleSize.height + barState.textOffset;
                    }
                    else
                        barState.metrics.titleCoord = barState.metrics.width - titleSize.height;
                }
                if(barState.label.position === "start"){
                    barState.metrics.labelCoord = startPosition + labelWidth;
                    barState.metrics.barCoord = barState.metrics.labelCoord + barState.textOffset;
                }
                if(barState.label.position === "end"){
                    barState.metrics.barCoord = startPosition;
                    barState.metrics.labelCoord = barState.metrics.barCoord + barState.width + barState.textOffset;
                }
            }
            if(barState.position.orientation === "horizontal"){
                 //Size
                 barState.metrics.width = graphRect.width * barState.size;
                 barState.metrics.height = barState.width + barState.textOffset + labelHeight;
                 barState.gradient.gradientObject = state.context.data.createLinearGradient(0, 0, barState.metrics.width, 0);

                 if(barState.title.text !== "") barState.metrics.height += barState.textOffset + titleSize.height;

                 //Coordinates
                 let startPosition = 0;
                 if(barState.title.text !== ""){
                     if(barState.title.position === "start")
                         barState.metrics.titleCoord = barState.metrics.height - titleSize.height;
                     else{
                         barState.metrics.titleCoord = 0;
                         startPosition = titleSize.height + barState.textOffset
                     }
                 }
                 if(barState.label.position === "start"){
                     barState.metrics.barCoord = startPosition;
                     barState.metrics.labelCoord = barState.metrics.barCoord + barState.width + barState.textOffset;
                 }
                 if(barState.label.position === "end"){
                     barState.metrics.labelCoord = startPosition;
                     barState.metrics.barCoord = startPosition + labelHeight + barState.textOffset;
                 }
            }
        }



        gradientSteps.forEach(item=>{ barState.gradient.gradientObject.addColorStop(item.position, item.color) }); 

        const [xPosition, yPosition] = getBarPosition(state, barState);
        barState.metrics.position.x = xPosition;
        barState.metrics.position.y = yPosition;

        
    }

//---------------------------------------------
//-------- Compute With ID ---------------------

function idCompute(id:string) : [Array<{position:number, color:string}>, Colorbar_Entries]{
    const rawEntries : Array<{position:number, color:string}> = [];
    let visualEntries : Colorbar_Entries = [];
    const tolerance = 0.0001;
    const maxStops = 30;
    
    
    const candidate = state.data.filter(item=>item.dataset.id()===id)
    if(candidate.length === 0) return [rawEntries, visualEntries];
    
    
    const dataset = candidate[0].dataset as Heat_Map;

    //Unfolds the color and data objects, structure is not important here
    const colorArray : Array<string> = ([] as Array<string>).concat(...dataset.color());
    const dataArray : Array<number> = ([] as Array<number>).concat(...dataset.data());

    //Combines the data objects, selects unique entries and sorts it
    let values : Array<{data:number, color:string}> = [];
    dataArray.forEach((dataValue, i)=>values.push({ data : dataValue, color : colorArray[i] }));
    values = values.sort((a,b)=>a.data-b.data).filter((item, i)=>{ return i===0? true : Math.abs(item.data - values[i-1].data) > tolerance });
    
    const minData = values[0].data;
    const maxData = values[values.length-1].data;
    const maxColor = values[values.length-1].color;
    const scale = barState.reverse? mapping({from:[maxData, minData], to:[0,1]}) : mapping({from:[minData, maxData], to:[0,1]});
    
    visualEntries = getVisualEntries(values, scale);
    
    if(values.length>maxStops){
        const delta = Math.floor(values.length/maxStops);

        values = values.filter((item, i) => i%(delta+1)===0);
        
        if(Math.abs(values[values.length-1].data - maxData) > tolerance)
            values.push({data:maxData, color:maxColor})
    }

    values.forEach(item=>{
        let position = scale.map(item.data);
        position = position<0?0:(position>1?1:position)
        rawEntries.push({
            position,
            color : item.color
        })
    });

    

    
    return [rawEntries, visualEntries];
}

//---------------------------------------------
//------------ Get Visual Entries -------------

    function getVisualEntries(values : Array<{data:number, color:string}>, scale:Mapping) : Colorbar_Entries{
        const entries : Colorbar_Entries = [];
        const maxIndex = values.length - 1;
        let [minValue, maxValue] = scale.domain;
        if(barState.reverse) [minValue, maxValue] = [maxValue, minValue]
        const range = maxValue - minValue;

        //Density as a number
        if(typeof barState.ticks.density === "number"){
            const delta = range / (barState.ticks.density - 1);
            const maxDecimals = 2;

            //First and last tick
            entries.push({
                position : scale.map(values[0].data),
                color : values[0].color,
                label : `${formatNumber(values[0].data, maxDecimals)}${barState.unit}`
            })
            entries.push({
                position : scale.map(values[maxIndex].data),
                color : values[maxIndex].color,
                label : `${formatNumber(values[maxIndex].data, maxDecimals)}${barState.unit}`
            })

            //Internal ticks
            for(let i=1; i<barState.ticks.density - 1; i++){
                const value = minValue + i*delta;
                let indexFound = 0;

                values.find((item, i)=>{
                    if(item.data>value){
                        indexFound = i;
                        return true;
                    }
                    return false;
                });

                const colorFound = colorInterpolator({
                    from:[values[indexFound-1].data, values[indexFound].data],
                    to : [values[indexFound-1].color, values[indexFound].color],
                    space : "rgb"
                }).map(value);

                entries.push({
                    position : scale.map(value),
                    color : colorFound,
                    label : `${formatNumber(value, maxDecimals)}${barState.unit}`
                });
            }
        }

        if(typeof barState.ticks.density === "object"){
            if(typeof barState.ticks.density[0] === "string"){
                const labels = barState.ticks.density as Array<string>;
                const delta = range / (labels.length - 1);

                //First and last tick
                entries.push({
                    position : scale.map(values[0].data),
                    color : values[0].color,
                    label : `${labels[0]}${barState.unit}`
                })
                entries.push({
                    position : scale.map(values[maxIndex].data),
                    color : values[maxIndex].color,
                    label : `${labels[labels.length - 1]}${barState.unit}`
                })

            //Internal ticks
                for(let i=1; i<labels.length-1; i++){
                    const value = minValue + i*delta;
                    let indexFound = 0;

                    values.find((item, i)=>{
                        if(item.data>value){
                            indexFound = i;
                            return true;
                        }
                        return false;
                    });

                    const colorFound = colorInterpolator({
                        from:[values[indexFound-1].data, values[indexFound].data],
                        to : [values[indexFound-1].color, values[indexFound].color],
                        space : "rgb"
                    }).map(value);

                    entries.push({
                        position : scale.map(value),
                        color : colorFound,
                        label : `${labels[i]}${barState.unit}`
                    });
                }
            }
            
            if(typeof barState.ticks.density[0] === "object"){
                const labels = barState.ticks.density as Array<{position:number, label:string}>;

                labels.forEach(entry =>{
                    const value = entry.position;
                    if(value < minValue || value > maxValue) return;

                    let indexFound = 0;

                    values.find((item, i)=>{
                        if(item.data>value){
                            indexFound = i;
                            return true;
                        }
                        return false;
                    });

                    const colorFound = colorInterpolator({
                        from:[values[indexFound-1].data, values[indexFound].data],
                        to : [values[indexFound-1].color, values[indexFound].color],
                        space : "rgb"
                    }).map(value);

                    entries.push({
                        position : scale.map(value),
                        color : colorFound,
                        label : `${entry.label}${barState.unit}`
                    });
                })

            }
        }

        return entries;
    }

//---------------------------------------------


    return {
        compute
    }
}

export default ComputeColorbar;














//------------ Get Bar Position ---------------

function getBarPosition(state : Graph2D_State, barState:Colorbar_State) : [number, number]{
    const graphRect = state.context.graphRect();
    let xPosition = 0;
    let yPosition = 0;

    if(typeof barState.position === "string"){
        switch(barState.position){
            case "x-start":
                xPosition = Math.round(state.context.clientRect.x + 3*state.marginUsed.defaultMargin);
                yPosition = Math.round(graphRect.y + graphRect.height/2 - barState.metrics.height/2);
                break;
    
            case "x-end":
                xPosition = Math.round(state.context.clientRect.x + state.context.clientRect.width - 3*state.marginUsed.defaultMargin - barState.metrics.width);
                yPosition = Math.round(graphRect.y + graphRect.height/2 - barState.metrics.height/2);
                break;
    
            case "y-start":
                xPosition = Math.round(graphRect.x + graphRect.width/2 - barState.metrics.width/2);
                yPosition = Math.round(state.context.clientRect.y + state.context.clientRect.height - 3*state.marginUsed.defaultMargin - barState.metrics.height);
                break;
    
            case "y-end":
                xPosition = Math.round(graphRect.x + graphRect.width/2 - barState.metrics.width/2);
                yPosition = Math.round(state.context.clientRect.y + 3*state.marginUsed.defaultMargin);
                break;
        }
    }
    if(typeof barState.position === "object"){
        xPosition = state.context.clientRect.x + barState.position.x;
        yPosition = state.context.clientRect.y + barState.position.y;
    }



    return [xPosition, yPosition];
}

//---------------------------------------------