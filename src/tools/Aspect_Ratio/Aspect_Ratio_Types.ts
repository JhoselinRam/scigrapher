import { Domain_Props } from "../../Graph2D/resourses/Axis/Axis_Types";

export interface Aspect_Ratio extends Domain_Props {
    ratio : number,
    axis : "x" | "y",
    anchor : "start"|"end"|number
}