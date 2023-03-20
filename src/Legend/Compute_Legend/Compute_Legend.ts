import { flattenDiagnosticMessageText } from "typescript";
import { Area } from "../../Data/Area/Area_Types.js";
import { Datasets } from "../../Data/Data_Types.js";
import { Heat_Map } from "../../Data/HeatMap/Heat_Map_Types.js";
import { Line_Chart } from "../../Data/LineChart/LineChart_Types.js";
import { Vector_Field } from "../../Data/VectorField/Vector_Field_Types.js";
import { getTextSize } from "../../tools/Helplers/Helplers.js";
import { drawArea, drawHeatMap, drawLineChart, drawVectorField } from "../Draw_Legend/Draw_Legend.js";
import { DrawIcon, Legend_Method_Generator } from "../Legend_Types";
import { Compute_Legend } from "./Compute_Legend_Types";

function ComputeLegend({graphHandler, legendHandler, legendState, state} : Legend_Method_Generator) : Compute_Legend {

//---------------- Compute --------------------

    function compute(){
        
        //Remove any disable dataset
        legendState.metrics.data = legendState.data.filter(entrie=>{
            const dataset = state.data.find(set=>set.dataset.id()===entrie.dataset)?.dataset;
            if(dataset == null) return false;
            
            switch(dataset.datasetType()){
                case "area" : {
                    const set = dataset as Area;
                    return set.enable();
                }

                case "heatmap":{
                    const set = dataset as Heat_Map;
                    return set.enable();
                }

                case "vectorfield" : {
                    const set = dataset as Vector_Field;
                    return set.enable();
                }

                case "linechart":{
                    const set = dataset as Line_Chart;
                    return set.lineEnable() || set.markerEnable();
                }
            }

        });

        [legendState.metrics.width, legendState.metrics.height] = computePositions();
        legendState.metrics.titleCoord = getTitleCoord();
        [legendState.metrics.x, legendState.metrics.y] = computeLegendPosition();

    }

//---------------------------------------------
//------------ Compute Positions --------------

    function computePositions() : [number, number]{
        let width = 0;
        let height = 0;
        
        //Initial text coordinates
        let yStart = legendState.metrics.textOffset;
        let xStart = 2*legendState.metrics.textOffset + legendState.width;

        //If a title exist
        const titleSize = getTextSize(legendState.title.text, legendState.title.size, legendState.title.font, state.context.data);
        if(legendState.title.text !== "")
            yStart += titleSize.height + 2*legendState.metrics.textOffset;


        let lastIndex = 0;
        let reminder = legendState.data.length%legendState.columns;
        let columnHeight = 0;

        //Compute each column
        for(let i=0; i<legendState.columns; i++){
            let yCoord = yStart;
            let lastHeight = 0;
            
            //Number of items per column
            let itemsPerRow = Math.floor(legendState.data.length/legendState.columns); 
            if(reminder > 0){
                itemsPerRow++;
                reminder --;
            } 

            //Items in the column
            const dataColumn = legendState.metrics.data.slice(lastIndex, lastIndex+itemsPerRow);
            let columnWidth = 0;

            //Compute label metrics
            dataColumn.forEach(row=>{
                const textSize = getTextSize(row.text, row.label.size, row.label.font, state.context.data);
                const rowWidth = legendState.width + legendState.metrics.textOffset + textSize.width;

                legendState.metrics.items.push({
                    x : xStart,
                    y : yCoord,
                    width : textSize.width,
                    height : textSize.height,
                    drawIcon : selectIconDraw(state.data.find(item=>item.dataset.id()===row.dataset)?.dataset.datasetType()!)
                });

                yCoord += legendState.metrics.textOffset + textSize.height;
                lastHeight = textSize.height;
                
                if(rowWidth > columnWidth) 
                    columnWidth = rowWidth;

            });

            xStart += columnWidth + 3*legendState.metrics.textOffset; 
            width += columnWidth +  3*legendState.metrics.textOffset;
            if(yCoord + lastHeight > height)
                height = yCoord;
            
            lastIndex += itemsPerRow;            
        }

        if(width < titleSize.width + 2*legendState.metrics.textOffset)
            width = titleSize.width + 2*legendState.metrics.textOffset;

        return [width, height]
    }

//---------------------------------------------
//------------ Get title Coord ----------------

    function getTitleCoord() : number{
        if(legendState.title.text === "") return 0;

        const metrics = getTextSize(legendState.title.text, legendState.title.size, legendState.title.font, state.context.data);

        switch(legendState.title.position){
            case "start":
                return legendState.metrics.textOffset;

            case "center":
                return legendState.metrics.width/2 - metrics.width/2;

            case "end":
                return legendState.metrics.width - legendState.metrics.textOffset - metrics.width;
        }
    }

//---------------------------------------------
//----------- Compute Position ----------------

    function computeLegendPosition() : [number, number]{
        const defaultMargin = 12;
        const graphRect = state.context.graphRect();
        let x = 0;
        let y = 0;


        if(typeof legendState.position === "object"){
            x = legendState.position.x;
            y = legendState.position.y;
        }

        if(typeof legendState.position === "string"){
            switch(legendState.position){
                case "top-left":
                    x = defaultMargin;
                    y = defaultMargin;
                    break;

                case "top-right":
                    x = graphRect.width - defaultMargin - legendState.metrics.width;
                    y = defaultMargin;
                    break;

                case "bottom-left":
                    x = defaultMargin;
                    y = graphRect.height - defaultMargin - legendState.metrics.height;
                    break;

                case "bottom-right":
                    x = graphRect.width - defaultMargin - legendState.metrics.width;
                    y = graphRect.height - defaultMargin - legendState.metrics.height;
                    break;

                case "center":
                    x = graphRect.height/2 - legendState.metrics.width/2;
                    y = graphRect.height/2 - legendState.metrics.height/2;
                    break;
            }
        }

        return [Math.round(x), Math.round(y)];
    }

//---------------------------------------------

    return {
        compute
    }

}

export default ComputeLegend;









//------------ Select Icon Draw ---------------

function selectIconDraw(type:Datasets):DrawIcon{
    switch(type){
        case "area":
            return drawArea as DrawIcon;
        
        case "heatmap":
            return drawHeatMap as DrawIcon;

        case "linechart":
            return drawLineChart as DrawIcon;

        case "vectorfield":
            return drawVectorField as DrawIcon;
    }
}

//---------------------------------------------