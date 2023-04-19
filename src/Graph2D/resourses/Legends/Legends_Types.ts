import { Legend, Legend_Options } from "../../../Legend/Legend_Types";
import { Graph2D, graphCallback } from "../../Graph2D_Types";

export interface Legends {
    addLegend : (options ?: Partial<Legend_Options>, callback?:graphCallback) => Legend,
    removeLegend : (id : string, callback?:graphCallback) => Graph2D,
    getLegends : ()=>Array<Legend>
}