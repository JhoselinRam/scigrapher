import { Axis_Property } from "../../../../Graph2D/Graph2D_Types"
import { Line_Chart, Line_Chart_Callback, Property_Modifier } from "../../LineChart_Types"

export interface Error_Line {
    errorbarType : Property_Modifier<string>,
    errorbarColorX : Property_Modifier<string>,
    errorbarOpacityX : Property_Modifier<number>,
    errorbarWidthX : Property_Modifier<number>,
    errorbarStyleX : Property_Modifier<string>,
    errorbarDataX : Property_Modifier<number>,
    errorbarColorY : Property_Modifier<string>,
    errorbarOpacityY : Property_Modifier<number>,
    errorbarWidthY : Property_Modifier<number>,
    errorbarStyleY : Property_Modifier<string>,
    errorbarDataY : Property_Modifier<number>,
    errorbarEnable : {
        (enable:Partial<Axis_Property<boolean>>, callback?:Line_Chart_Callback) : Line_Chart,
        (arg : void) : Axis_Property<boolean>
    }
}

export type Error_Properties = "color" | "opacity" | "width" | "style" | "data" | "type"