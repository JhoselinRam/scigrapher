import { Graph2D } from "../../Graph2D_Types";

export interface Background{
    backgroundColor : {
        (color:string):Graph2D,
        (arg:void):string
    },
    backgroundOpacity : {
        (opacity:number):Graph2D,
        (arg:void):number
    }
}