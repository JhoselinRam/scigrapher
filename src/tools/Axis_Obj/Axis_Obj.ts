import { Axis_Obj, CreateAxis_Props } from "./Axis_Obj_Types";

function CreateAxis({scale, type, suffix, baseColor, baseOpacity, tickColor, tickOpacity, labelColor, labelOpacity}:CreateAxis_Props) : Axis_Obj{
    const minSpacing = 70;  //Minimun space between ticks in pixels
    const fullRange = Math.abs(scale.range[1] - scale.range[0]);
    let positions : Array<number>;
    let labels : Array<string>;
    
    
    
    function draw(){

    }
    
    
    return {
        positions,
        labels,
        draw
    };
}

export default CreateAxis;