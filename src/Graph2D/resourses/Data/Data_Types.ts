import { Datasets, Dataset_Options, Dataset_Types, Draw_Data_Callback, Partialize } from "../../../Data/Data_Types";
import { Graph2D, graphCallback } from "../../Graph2D_Types";

export interface Data {
    addDataset :(type : Datasets, options : Partialize<Dataset_Options>, callback?:graphCallback)=>Dataset_Types,
    removeDataset : (id:string, callback?:graphCallback)=>Graph2D,
    getDatasets : ()=>Array<{ dataset : Dataset_Types, draw : Draw_Data_Callback }>
}