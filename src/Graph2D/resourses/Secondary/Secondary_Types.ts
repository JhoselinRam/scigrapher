import { Axis_Property, Graph2D, RecursivePartial } from "../../Graph2D_Types"
import { Domain_Props } from "../Axis/Axis_Types"

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
    }
}