import { Axis_Property, Graph2D, RecursivePartial } from "../../Graph2D_Types";

export interface Margin{
    margin : {
        (margins:RecursivePartial<Margin_Props>, callback?:(handler:Graph2D)=>void):Graph2D,
        (arg:void):Margin_Props
    }
}

export type Margin_Props = Axis_Property<{
    start : number,
    end : number
}>