import { Scale, Scale_Props } from "./Scale_Types";

function Scale({from, to, type}:Scale_Props) : Scale{
    
    let map : (value:number)=>number;
    let invert : (value:number)=>number;

    switch(type){
        case "linear":
            
            break;

        case "log":
            break;
    }

//---------------------------------------------

    return {
        map,
        invert
    }
}


export default Scale;