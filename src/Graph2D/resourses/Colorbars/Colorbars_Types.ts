import { Colorbar, Colorbar_Options } from "../../../Colorbar/Colorbar_Types";
import { graphCallback, RecursivePartial } from "../../Graph2D_Types";

export interface Colorbars {
    addColorbar : (options : RecursivePartial<Colorbar_Options>, callback?:graphCallback) => Colorbar
}