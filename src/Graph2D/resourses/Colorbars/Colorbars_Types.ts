import { Colorbar, Colorbar_Options } from "../../../Colorbar/Colorbar_Types";
import { Graph2D, graphCallback, RecursivePartial } from "../../Graph2D_Types";

export interface Colorbars {
    addColorbar : (options : RecursivePartial<Colorbar_Options>, callback?:graphCallback) => Colorbar,
    removeColorbar : (id:string, callback?:graphCallback) => Graph2D
    getColorbars : ()=>Array<Colorbar>
}