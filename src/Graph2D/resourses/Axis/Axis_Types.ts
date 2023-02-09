import { Axis_Position, Axis_Property, Axis_Type, Graph2D, RecursivePartial } from "../../Graph2D_Types"

export interface Axis{
    compute : ()=>void,
    draw : ()=>void,
    axisPosition : {
        (position:Axis_Position):Graph2D,
        (arg:void):Axis_Position
    },
    axisDomain : {
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
    },
    axisUnits : {
        (units:RecursivePartial<Axis_Property<string>>):Graph2D,
        (arg:void):Axis_Property<string>
    },
    axisBase : {
        (base:RecursivePartial<Base_Props>):Graph2D,
        (arg:void):Base_Props
    },
    axisTicks : {
        (base:RecursivePartial<Ticks_Props>):Graph2D,
        (arg:void):Ticks_Props
    },
    axisText : {
        (base:RecursivePartial<Text_Props>):Graph2D,
        (arg:void):Text_Props
    },
    axisDynamic : {
        (options:RecursivePartial<Dynamic_Props>):Graph2D,
        (arg:void):Dynamic_Props
    },
    axisOverlap : {
        (overlap : RecursivePartial<Axis_Overlap>):Graph2D,
        (arg:void):Axis_Overlap
    },
    axisType : {
        (type : Axis_Type) : Graph2D,
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
    size : string
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