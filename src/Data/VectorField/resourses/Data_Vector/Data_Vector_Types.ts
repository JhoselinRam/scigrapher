import { Axis_Property } from "../../../../Graph2D/Graph2D_Types"
import { Field_Data, Field_Property } from "../../../Data_Types"
import { Vector_Field, Vector_Field_Callback } from "../../Vector_Field_Types"

export interface Data_Vector{
    dataX : Data_Method_Generator,
    dataY : Data_Method_Generator,
    meshX : Data_Method_Generator,
    meshY : Data_Method_Generator,
    axisUsed : {
        (axis:Partial<Axis_Property<"primary" | "secondary">>, callback?:Vector_Field_Callback) : Vector_Field,
        (arg:void) : Axis_Property<"primary" | "secondary">
    }
}

export type Data_Method_Generator = {
    (data:Field_Data<Vector_Field>, callback?:Vector_Field_Callback) : Vector_Field,
    (arg:void) : Field_Property<number>
}