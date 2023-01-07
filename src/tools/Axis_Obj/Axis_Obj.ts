import { Mapping } from "../Mapping/Mapping_Types";
import { Axis_Obj, CreateAxis_Props } from "./Axis_Obj_Types";
const black = "#ffffff";

const minSpacing = 70;  //Minimun space between ticks in pixels
const maxSpacing = 300;

function CreateAxis({scale, type, suffix, baseColor=black, baseOpacity=1, tickColor=black, tickOpacity=1, labelColor=black, labelOpacity=1, ticks="auto"}:CreateAxis_Props) : Axis_Obj{
    const positions = computePositions(scale, ticks);
    const labels = createLabels(positions, suffix);
    
    
    
    function draw(){

    }
    
    
    return {
        positions,
        labels,
        draw
    };
}

//---------------------------------------------
//---------------------------------------------

function computePositions(scale:Mapping, ticks: "auto" | number | Array<number>) : Array<number>{
    const fullRange = Math.abs(scale.range[1] - scale.range[0]);
    let positions : Array<number> = [];

    switch(typeof(ticks)){
        case "string":
            positions = autoCompute(scale);
            break;

        case "number":
            const delta = fullRange/(ticks-1);
            for(let i=0; i<ticks; i++)
                positions.push(scale.domain[0] + scale.map(delta*i));
            
            break;
        
        case "object":
            ticks.forEach(item=>{
                positions.push(scale.map(item));
            });
            break;
    }
    
    
    
    return positions;
}

//---------------------------------------------
//---------------------------------------------

function autoCompute(scale:Mapping):Array<number>{
    const fullRange = Math.abs(scale.range[1] - scale.range[0]);
    let positions : Array<number> = [];

    if(scale.type==="linear"){
        const minPartition = Math.ceil(fullRange/minSpacing);
        const minDomainSpacing = Math.abs(scale.invert(fullRange/minPartition));
        const tickMultiplier = [5,2,1]; //Order is important!!
        let magnitudeOrder = 0;
        let multiplier : number;

        //Determine the order of magnitude of the minimum domain spacing
        while(true){ 
            if(minDomainSpacing/Math.pow(10,magnitudeOrder)<10 && minDomainSpacing/Math.pow(10,magnitudeOrder)>=1)
                break;
            if(minDomainSpacing>=1) 
                magnitudeOrder++;
            else
                magnitudeOrder--;
        }

        tickMultiplier.forEach(item=>{
            if(minDomainSpacing/Math.pow(10,magnitudeOrder) > item)
                multiplier = item;
        });


    }
    else{

    }


    return positions;
}

//---------------------------------------------
//---------------------------------------------

function createLabels(positions:Array<number>, suffix?:string) : Array<string>{
    return [""];
}

//---------------------------------------------

export default CreateAxis;