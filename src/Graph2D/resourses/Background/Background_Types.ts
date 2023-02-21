import { Graph2D } from "../../Graph2D_Types";

export interface Background{
    draw : ()=>void,
    drawClientRect : ()=>void,
    backgroundColor : {
        (color:string, callback?:(handler?:Graph2D)=>void):Graph2D,
        (arg:void):string
    },
    backgroundOpacity : {
        (opacity:number, callback?:(handler?:Graph2D)=>void):Graph2D,
        (arg:void):number
    }
}