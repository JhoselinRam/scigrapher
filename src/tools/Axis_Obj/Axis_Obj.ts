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
        if(minPartition<1){
            positions.push(scale.domain[0]);
            positions.push(scale.domain[1]);
            return positions;
        }

        const minDomainSpacing = Math.abs(scale.invert(fullRange/minPartition));
        const tickMultiplier = [5,2,1]; //Order is important!!
        let magnitudeOrder = Math.floor(Math.log10(minDomainSpacing));
        let multiplier : number = 1;

        tickMultiplier.forEach(item=>{
            if(minDomainSpacing/Math.pow(10,magnitudeOrder) > item)
                multiplier = item;
        });

        const start = scale.domain[0]<scale.domain[1]?scale.domain[0]:scale.domain[1];
        const end = scale.domain[1]>scale.domain[0]?scale.domain[1]:scale.domain[0];
        let tickCounter = Math.ceil(start / (minDomainSpacing*Math.pow(10,magnitudeOrder)));

        while(true){
            const newPosition = tickCounter * minDomainSpacing * Math.pow(10, magnitudeOrder);
            if(newPosition >end)
                break;
            
            positions.push(newPosition);
            tickCounter++;
        }
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