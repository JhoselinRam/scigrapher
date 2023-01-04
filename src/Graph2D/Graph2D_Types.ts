import { Background } from "./resourses/background/Background_Types";
import { Scale } from "./resourses/Scale/Scale_Types";

export interface Graph2D extends Background, Scale{

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
    render : ()=>void,
    compute : {
        scale : ()=>void
    }
}

export interface Method_Generator{
    state : Graph2D_State,
    graphHandler : Graph2D
}

export type RecursivePartial<T> = {
    [P in keyof T]?: RecursivePartial<T[P]>;
};

export type RecursiveRequired<T> = {
    [P in keyof T]-?: RecursiveRequired<T[P]>;
}

export type RequiredExept<T, K extends keyof T> = RecursiveRequired<T> & RecursivePartial<Pick<T,K>>