import { Axis_Position, Axis_Property, Axis_Type, Graph2D, graphCallback, RecursivePartial } from "../../Graph2D_Types"

export interface Axis{
    compute : ()=>void,
    draw : ()=>void,
    axisPosition : {
        (position:Axis_Position, callback?:graphCallback):Graph2D,
        (arg:void):Axis_Position
    },
    axisDomain : {
        (domain:RecursivePartial<Domain_Props>, callback?:graphCallback):Graph2D,
        (arg:void):Domain_Props
    },
    axisColor : {
        (colors:Axis_Modifier_Props<string>, callback?:graphCallback):Graph2D,
        (arg:void):Axis_Modifier<string>
    },
    axisOpacity : {
        (opacity:Axis_Modifier_Props<number>, callback?:graphCallback):Graph2D,
        (arg:void):Axis_Modifier<number>
    },
    axisUnits : {
        (units:RecursivePartial<Axis_Property<string>>, callback?:graphCallback):Graph2D,
        (arg:void):Axis_Property<string>
    },
    axisBase : {
        (base:RecursivePartial<Base_Props>, callback?:graphCallback):Graph2D,
        (arg:void):Base_Props
    },
    axisTicks : {
        (base:RecursivePartial<Ticks_Props>, callback?:graphCallback):Graph2D,
        (arg:void):Ticks_Props
    },
    axisText : {
        (base:RecursivePartial<Text_Props>, callback?:graphCallback):Graph2D,
        (arg:void):Text_Props
    },
    axisDynamic : {
        (options:RecursivePartial<Dynamic_Props>, callback?:graphCallback):Graph2D,
        (arg:void):Dynamic_Props
    },
    axisOverlap : {
        (overlap : RecursivePartial<Axis_Overlap>, callback?:graphCallback):Graph2D,
        (arg:void):Axis_Overlap
    },
    axisType : {
        (type : Axis_Type, callback?:graphCallback) : Graph2D,
        (arg : void) : Axis_Type
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

export type Base_Props = Axis_Property<{
    color : string,
    opacity : number,
    width : number
}>

export type Ticks_Props = Axis_Property<{
    color : string,
    opacity : number,
    width : number,
    size : number,
    ticks : "auto" | number | Array<number>,
    minSpacing : number
}>

export type Text_Props = Axis_Property<{
    color : string,
    opacity : number,
    font : string,
    size : string,
    specifier : string
}>

export type Dynamic_Props = Axis_Property<{
    dynamic : boolean,
    contained : boolean
}>

export interface Axis_Overlap {
    priority : "x" | "y",
    x : boolean,
    y : boolean
}