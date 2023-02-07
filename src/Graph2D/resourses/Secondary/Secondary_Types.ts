import { Axis_Property, Graph2D, RecursivePartial } from "../../Graph2D_Types"
import { Base_Props, Domain_Props, Text_Props, Ticks_Props } from "../Axis/Axis_Types"

export interface Secondary{
    compute : ()=>void,
    draw : ()=>void,
    secondaryAxisEnable : {
        (enable : Partial<Axis_Property<boolean>>) : Graph2D,
        (arg : void) : Partial<Axis_Property<boolean>>
    },
    secondaryAxisDomain : {
        (domain:RecursivePartial<Domain_Props>) : Graph2D,
        (arg:void) : RecursivePartial<Domain_Props>
    },
    secondaryAxisColor : {
        (colors : Secondary_Axis_Modifier_Props<string>) : Graph2D,
        (arg : void) : Secondary_Axis_Modifier<string>
    },
    secondaryAxisOpacity : {
        (opacity : Secondary_Axis_Modifier_Props<number>) : Graph2D,
        (arg : void) : Secondary_Axis_Modifier<number>
    },
    secondaryAxisUnits : {
        (units : RecursivePartial<Axis_Property<string>>) : Graph2D,
        (arg : void) : Partial<Axis_Property<string>>
    },
    secondaryAxisBase : {
        (base : RecursivePartial<Base_Props>) : Graph2D,
        (arg : void) : Partial<Base_Props>
    },
    secondaryAxisTicks : {
        (base : RecursivePartial<Ticks_Props>) : Graph2D,
        (arg : void) : Partial<Ticks_Props>
    },
    secondaryAxisText : {
        (base : RecursivePartial<Text_Props>) : Graph2D,
        (arg : void) : Partial<Text_Props>
    }
}

export interface Secondary_Axis_Modifier<T>{
    base : Partial<Axis_Property<T>>,
    tick : Partial<Axis_Property<T>>,
    text : Partial<Axis_Property<T>>,
}

export interface Secondary_Axis_Modifier_Props<T> extends RecursivePartial<Secondary_Axis_Modifier<T>> {
    axis ?: T,
    xAxis ?: T,
    yAxis ?: T
}