import { Graph2D_Save_Asset } from "../../../../Graph2D/Graph2D_Types"
import { Line_Chart, Line_Chart_Callback} from "../../LineChart_Types"

export interface Properties_Line {
    polar : {
        (polar : boolean, callback?:Line_Chart_Callback) : Line_Chart,
        (arg : void) : boolean
    },
    save : ()=>Graph2D_Save_Asset
}