import { Graph2D, graphCallback, LabelProperties } from "../../Graph2D_Types"

export interface Labels {
    compute : ()=>void,
    draw : ()=>void,
    title : {
        (label:Partial<LabelProperties>, callback?:graphCallback):Graph2D,
        (arg:void):LabelProperties | undefined
    },
    subtitle : {
        (label:Partial<LabelProperties>, callback?:graphCallback):Graph2D,
        (arg:void):LabelProperties | undefined
    },
    xLabel : {
        (label:Partial<LabelProperties>, callback?:graphCallback):Graph2D,
        (arg:void):LabelProperties | undefined
    },
    yLabel : {
        (label:Partial<LabelProperties>, callback?:graphCallback):Graph2D,
        (arg:void):LabelProperties | undefined
    },
    xLabelSecondary : {
        (label:Partial<LabelProperties>, callback?:graphCallback):Graph2D,
        (arg:void):LabelProperties | undefined
    },
    yLabelSecondary : {
        (label:Partial<LabelProperties>, callback?:graphCallback):Graph2D,
        (arg:void):LabelProperties | undefined
    },
}

export interface Text_Height_Props{
    text : string,
    size : string,
    font : string
}

export interface Draw_Text_Props {
    params : LabelProperties,
    x : number,
    y : number,
    angle : number
}

export interface Get_Coords_Props {
    heights : {
        title : number,
        subtitle : number,
        xPrimary : number,
        yPrimary : number,
        xSecondary : number,
        ySecondary : number,
    },
    position : "start" | "center" | "end",
    label : "title" | "subtitle" | "xPrimary" | "yPrimary" | "xSecondary" | "ySecondary"
}