import { Mapping } from "../Mapping/Mapping_Types";
import { Axis_Obj, CreateAxis_Props } from "./Axis_Obj_Types";
const black = "#ffffff";

const minSpacing = 70;  //Minimun space between ticks in pixels

function CreateAxis({scale, suffix, ticks="auto"}:CreateAxis_Props) : Axis_Obj{
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
//---------------------------------------------

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
//---------------------------------------------

function createLabels(positions:Array<number>, suffix?:string) : Array<string>{
    return positions.map(position=>{
        let label : string = "";
        const magnitudeOrder = position===0? 0 : Math.floor(Math.log10(Math.abs(position)));
     
        if(magnitudeOrder<-2 || magnitudeOrder>3){
            const fixed = Number.isInteger(position/Math.pow(10,magnitudeOrder)) ? 0 : 2;
            label = position.toExponential(fixed);
            label = label.replace("e","x10");
        }
        else{
            const fixed = Number.isInteger(position) ? 0 : 2;
            label = position.toFixed(fixed);
            if(Math.abs(position)>999){
                const caracteres = label.split("");
                caracteres.splice(label.indexOf("-")+2,0,",");
                label = caracteres.join("");
            }
        }

        if(suffix != null)
            label = `${label}${suffix}`;
            
        return label;
    });
}

//---------------------------------------------

export default CreateAxis;