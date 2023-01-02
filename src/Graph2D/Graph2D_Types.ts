import { Background } from "./resourses/background/Background_Types";

export interface Graph2D extends Background{

}

export interface Graph2D_Options{
    background : {
        color : string,
        opacity : number
    },
    scale : {
        xStart : number,
        xEnd : number,
        yStart : number,
        yEnd : number,
        marginStart : number,
        marginEnd : number,
        marginTop : number,
        marginBottom : number
    }
}

export interface Graph2D_State extends Graph2D_Options {
    container : HTMLDivElement,
    id  : string,
    render : ()=>void
}

export interface Method_Generator{
    state : Graph2D_State,
    graphHandler : Graph2D
}

export type RecursivePartial<T> = {
    [P in keyof T]?: RecursivePartial<T[P]>;
};