import { LabelProperties } from "../../Graph2D_Types"

export interface Labels {
    compute : ()=>void,
    draw : ()=>void
}

export interface Draw_Text_Props {
    params : LabelProperties,
    x : number,
    y : number,
    angle : number
}