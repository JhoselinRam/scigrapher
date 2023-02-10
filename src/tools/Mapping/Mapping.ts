import { Mapping, Mapping_Props } from "./Mapping_Types";

function mapping({from, to, type="linear", base=10}:Mapping_Props) : Mapping{
    let map : (value:number)=>number;
    let invert : (value:number)=>number;
    let m : number = 0;
    let b : number = 0;

    switch(type){
        case "linear":
            m = (to[1]-to[0])/(from[1]-from[0]);
            b = (from[1]*to[0] - from[0]*to[1])/(from[1]-from[0]);
            map = (value:number)=>m*value+b;
            invert = (value:number)=>(value-b)/m;
            break;

        case "log":
            const baseLog = Math.log(base);
            if(from[0]>0 && from[1]>0){
                m = (to[1]-to[0])/(Math.log(from[1])-Math.log(from[0]))*baseLog;
                b = (Math.log(from[1])*to[0] - Math.log(from[0])*to[1]) / (Math.log(from[1])-Math.log(from[0]));
            }
            if(from[0]<0 && from[0]<0){
                m = (to[1]-to[0])/(Math.log(Math.abs(from[0]))-Math.log(Math.abs(from[1])))*baseLog;
                b = (Math.log(Math.abs(from[0]))*to[0] - Math.log(Math.abs(from[1]))*to[1]) / (Math.log(Math.abs(from[0]))-Math.log(Math.abs(from[1])));
            }
            map = (value:number) => m*Math.log(Math.abs(value))/baseLog + b;
            invert = (value:number) => Math.exp((value-b)/m*baseLog);

            break;
    }

//---------------------------------------------

    return {
        map,
        invert,
        domain : [from[0], from[1]],
        range : [to[0], to[1]],
        type,
        base : type==="log"?base:undefined
    }
}


export default mapping;