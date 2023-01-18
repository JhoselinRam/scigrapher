import { Graph2D, LabelProperties } from "../../Graph2D_Types"

export interface Labels {
    compute : ()=>void,
    draw : ()=>void,
    title : {
        (label:Label_Props):Graph2D,
        (arg:void):LabelProperties
    }
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

export interface Label_Props extends Partial<LabelProperties> {
    enable ?: boolean
}