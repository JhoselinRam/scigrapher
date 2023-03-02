import { Axis_Property, Graph2D, graphCallback, RecursivePartial } from "../../Graph2D_Types";

export interface Margin{
    margin : {
        (margins:RecursivePartial<Margin_Props>, callback?:graphCallback):Graph2D,
        (arg:void):Margin_Props
    }
}

export type Margin_Props = Axis_Property<{
    start : number,
    end : number
}>