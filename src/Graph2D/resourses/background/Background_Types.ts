import { Graph2D } from "../../Graph2D_Types";

export interface Background{
    backgroundColor : (color:string)=>Graph2D,
    getBackgroundColor : ()=>string,
    opacity : (opacity:number)=>Graph2D,
    getOpacity : ()=>number
}