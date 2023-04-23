import { Area } from "../../Data/Area/Area_Types";
import { Heat_Map } from "../../Data/HeatMap/Heat_Map_Types";
import { Line_Chart, Marker_Type } from "../../Data/LineChart/LineChart_Types";
import { Vector_Field } from "../../Data/VectorField/Vector_Field_Types";
import { createMarker, getLineDash } from "../../tools/Helplers/Helplers.js";
import { Draw_Icon_Props, Legend_Method_Generator } from "../Legend_Types";
import { Legend_Draw } from "./Draw_Legend_Types";

function LegendDraw({legendState, state} : Legend_Method_Generator) : Legend_Draw {

//------------------ Draw ---------------------

    function draw(){
        if(!legendState.enable) return;
        const graphRect = state.context.graphRect();

        legendState.compute();


        state.context.data.save();
        state.context.data.translate(Math.round(graphRect.x + legendState.metrics.x), Math.round(graphRect.y + legendState.metrics.y));
        state.context.data.textBaseline = "top";

        //Background
        state.context.data.fillStyle = legendState.background.color;
        state.context.data.globalAlpha = legendState.background.opacity;
        state.context.data.fillRect(0, 0, legendState.metrics.width, legendState.metrics.height);

        //Border
        state.context.data.strokeStyle = legendState.border.color;
        state.context.data.globalAlpha = legendState.border.opacity;
        state.context.data.lineWidth = legendState.border.width;
        state.context.data.setLineDash(getLineDash(legendState.border.style));
        state.context.data.strokeRect(legendState.border.width%2*0.5, legendState.border.width%2*0.5, Math.round(legendState.metrics.width), Math.round(legendState.metrics.height));

        //Title
        state.context.data.fillStyle = legendState.title.color;
        state.context.data.globalAlpha = legendState.title.opacity;
        state.context.data.font = `${legendState.title.specifier} ${legendState.title.size} ${legendState.title.font}`;
        state.context.data.fillText(legendState.title.text, legendState.metrics.titleCoord, legendState.metrics.textOffset);

        //Entries
        legendState.metrics.data.forEach((entrie, i)=>{
            state.context.data.fillStyle = entrie.text.color;
            state.context.data.globalAlpha = entrie.text.opacity;
            state.context.data.font = `${entrie.text.specifier} ${entrie.text.size} ${entrie.text.font}`;
            state.context.data.fillText(entrie.label, legendState.metrics.items[i].x, legendState.metrics.items[i].y);

            legendState.metrics.items[i].drawIcon({
                dataset : state.data.find(set=>set.dataset.id()===entrie.dataset)?.dataset!,
                state, legendState,
                x : legendState.metrics.items[i].x - legendState.metrics.textOffset - legendState.width,
                y : legendState.metrics.items[i].y + legendState.metrics.items[i].height/2
            });
        })
        

        state.context.data.restore();

        
    }

//---------------------------------------------

    return {
        draw
    }

}

export default LegendDraw;









//------------- Draw Line Chart ---------------

    export function drawLineChart({dataset, legendState, state, x, y} : Draw_Icon_Props<Line_Chart>){

        if(dataset.lineEnable()){
            const rawColor = dataset.lineColor();
            const rawOpacity = dataset.lineOpacity();
            const rawStyle = dataset.lineStyle();
            const rawWidth = dataset.lineWidth();

            //If any property is dynamic, it uses only the first value
            const color = typeof rawColor === "string" ? rawColor : rawColor[0];
            const opacity = typeof rawOpacity === "number" ? rawOpacity : rawOpacity[0];
            const style = typeof rawStyle === "string" ? rawStyle : rawStyle[0];
            const width = typeof rawWidth === "number" ? rawWidth : rawWidth[0];
            
            const yCoord = Math.round(y) - width%2*0.5;
            const xCoord = Math.round(x);

            state.context.data.strokeStyle = color;
            state.context.data.globalAlpha = opacity;
            state.context.data.setLineDash(getLineDash(style));
            state.context.data.lineWidth = width;
            state.context.data.beginPath();
            state.context.data.moveTo(xCoord,yCoord);
            state.context.data.lineTo(xCoord + legendState.width, yCoord);
            state.context.data.stroke();
        }

        if(dataset.markerEnable()){
            const rawColor = dataset.markerColor();
            const rawOpacity = dataset.markerOpacity();
            const rawStyle = dataset.markerStyle();
            const rawWidth = dataset.markerWidth();
            const rawType = dataset.markerType();
            const rawFill = dataset.markerFilled();

            //If any property is dynamic, it uses only the first value
            const color = typeof rawColor === "string" ? rawColor : rawColor[0];
            const opacity = typeof rawOpacity === "number" ? rawOpacity : rawOpacity[0];
            const style = typeof rawStyle === "string" ? rawStyle : rawStyle[0];
            const width = typeof rawWidth === "number" ? rawWidth : rawWidth[0];
            const type = typeof rawType === "string" ? rawType : rawType[0];
            const fill = typeof rawFill === "boolean" ? rawFill : rawFill[0];

            const marker = createMarker({type:type as Marker_Type, size:0.8});

            const xCoord = Math.round(x + legendState.width/2) - width%2*0.5;
            const yCoord = Math.round(y) - width%2*0.5;

            state.context.data.save();
            state.context.data.translate(xCoord, yCoord);
            state.context.data.strokeStyle = color;
            state.context.data.fillStyle = color;
            state.context.data.lineWidth = width;
            state.context.data.globalAlpha = opacity;
            state.context.data.setLineDash(getLineDash(style));
            fill ? state.context.data.fill(marker) : state.context.data.stroke(marker);
            state.context.data.restore();
            
        }
    }

//---------------------------------------------
//--------------- Draw Area -------------------

    export function drawArea({dataset, legendState, state, x, y} : Draw_Icon_Props<Area>){
        const color = dataset.color();
        const opacity = dataset.opacity();
        const iconHeight = 8;

        state.context.data.fillStyle = color;
        state.context.data.globalAlpha = opacity;
        state.context.data.fillRect(Math.round(x), Math.round(y - iconHeight/2), legendState.width, iconHeight);
    }

//---------------------------------------------
//----------- Draw Vector Field ---------------

    export function drawVectorField({dataset, legendState, state, x, y} : Draw_Icon_Props<Vector_Field>){
        const rawColor = dataset.color();
        const rawOpacity = dataset.opacity();
        const rawStyle = dataset.style();
        const rawWidth = dataset.width();
        const length = dataset.maxLength();
        const arrowSize = {x:4, y:2.5};

        const color = typeof rawColor === "string" ? rawColor : rawColor[0][0];
        const opacity = typeof rawOpacity === "number" ? rawOpacity : rawOpacity[0][0];
        const style = typeof rawStyle === "string" ? rawStyle : rawStyle[0][0];
        const width = typeof rawWidth === "number" ? rawWidth : rawWidth[0][0];

        const yCoord = Math.round(y) - width%2*0.5;
        const xStart = x + legendState.width/2 - length/2;
        const xEnd = xStart + length;

        state.context.data.strokeStyle = color;
        state.context.data.globalAlpha = opacity;
        state.context.data.lineWidth = width;
        state.context.data.setLineDash(getLineDash(style));
        state.context.data.beginPath();
        state.context.data.moveTo(xStart, yCoord);
        state.context.data.lineTo(xEnd, yCoord);
        state.context.data.lineTo(xEnd-arrowSize.x, yCoord+arrowSize.y);
        state.context.data.moveTo(xEnd, yCoord);
        state.context.data.lineTo(xEnd-arrowSize.x, yCoord-arrowSize.y);

        state.context.data.stroke();

    }

//---------------------------------------------
//-------------- Draw Heat Map ----------------

    export function drawHeatMap({dataset, legendState, state, x, y} : Draw_Icon_Props<Heat_Map>){
        const iconHeight = 8;
        const rawOpacity = dataset.opacity();
        const opacity = typeof rawOpacity === "number" ? rawOpacity : rawOpacity[0][0];

        const gradienData = getColorGradient(dataset);
        const gradient = state.context.data.createLinearGradient(Math.round(x), y, Math.round(x+legendState.width), y);

        gradienData.forEach((item, i)=>{
            gradient.addColorStop(i/(gradienData.length-1), item);
        });

        state.context.data.fillStyle = gradient;
        state.context.data.globalAlpha = opacity;
        state.context.data.fillRect(Math.round(x), Math.round(y - iconHeight/2), legendState.width, iconHeight);



    }

//---------------------------------------------
//---------- Get Color Gradient ---------------

function getColorGradient(dataset : Heat_Map) : Array<string>{
    const gradient : Array<string> = []; 
    const tolerance = 0.0001;    
    const maxStops = 10;
    
    //Unfolds the color and data objects, structure is not important here
    const colorArray : Array<string> = ([] as Array<string>).concat(...dataset.color());
    const dataArray : Array<number> = ([] as Array<number>).concat(...dataset.data());

    //Combines the data objects, selects unique entries and sorts it
    let values : Array<{data:number, color:string}> = [];
    
    dataArray.forEach((dataValue, i)=>values.push({ data : dataValue, color : colorArray[i] }));
    values = values.sort((a,b)=>a.data-b.data).filter((item, i)=>{ return i===0? true : Math.abs(item.data - values[i-1].data) > tolerance });

    //Reduces the amount of data
    const maxData = values[values.length-1].data;
    const maxColor = values[values.length-1].color;
    
    if(values.length>maxStops){
        const delta = Math.floor(values.length/maxStops);

        values = values.filter((item, i) => i%(delta+1)===0);
        
        if(Math.abs(values[values.length-1].data - maxData) > tolerance)
            values.push({data:maxData, color:maxColor})
    }

    values.forEach(item=>gradient.push(item.color));

    return gradient;
}

//---------------------------------------------