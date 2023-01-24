import { Axis_Property, Graph2D, RecursivePartial } from "../../Graph2D_Types"

export interface Axis{
    compute : ()=>void,
    draw : ()=>void,
    domain : {
        (domain:RecursivePartial<Domain_Props>):Graph2D,
        (arg:void):Domain_Props
    },
    axisColor : {
        (colors:Axis_Modifier_Props<string>):Graph2D,
        (arg:void):Axis_Modifier<string>
    },
    axisOpacity : {
        (opacity:Axis_Modifier_Props<number>):Graph2D,
        (arg:void):Axis_Modifier<number>
    }
}

export type Domain_Props = Axis_Property<{
    start : number,
    end : number
}>

export interface Axis_Modifier<T>{
    base : Axis_Property<T>,
    tick : Axis_Property<T>,
    text : Axis_Property<T>,
}

export interface Axis_Modifier_Props<T> extends RecursivePartial<Axis_Modifier<T>> {
    axis ?: T,
    xAxis ?: T,
    yAxis ?: T
}

