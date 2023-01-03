import { Scale, Scale_Props } from "./Scale_Types";

function Scale({from, to, type, base=10}:Scale_Props) : Scale{
    let map : (value:number)=>number;
    let invert : (value:number)=>number;
    let m : number;
    let b : number;

    switch(type){
        case "linear":
            m = (to[1]-to[0])/(from[1]-from[0]);
            b = (from[1]*to[0] - from[0]*to[1])/(from[1]-from[0]);
            map = (value:number)=>m*value+b;
            invert = (value:number)=>(value-b)/m;
            break;

        case "log":
            const baseLog = Math.log(base);
            m = (to[1]-to[0])/(Math.log(from[1])-Math.log(from[0]))*baseLog;
            b = (Math.log(from[1])*to[0] - Math.log(from[0])*to[1]) / (Math.log(from[1])-Math.log(from[0]));
            map = (value:number) => m*Math.log(value)/baseLog + b;
            invert = (value:number) => Math.exp((value-b)/m*baseLog);
            break;
    }

//---------------------------------------------

    return {
        map,
        invert
    }
}


export default Scale;