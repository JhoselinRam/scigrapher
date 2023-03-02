import { Graph2D, graphCallback } from "../../Graph2D_Types";

export interface Background{
    draw : ()=>void,
    drawClientRect : ()=>void,
    backgroundColor : {
        (color:string, callback?:graphCallback):Graph2D,
        (arg:void):string
    },
    backgroundOpacity : {
        (opacity:number, callback?:graphCallback):Graph2D,
        (arg:void):number
    }
}