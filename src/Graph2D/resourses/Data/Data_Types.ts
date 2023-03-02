import { Datasets, Dataset_Options, Dataset_Types, Draw_Data_Callback, Partialize } from "../../../Data/Data_Types";
import { Graph2D, graphCallback } from "../../Graph2D_Types";

export interface Data {
    addDataset :<T extends Dataset_Types>(type : Datasets, options : Partialize<Dataset_Options>, callback?:graphCallback)=>T,
    removeDataset : (id:string, callback?:graphCallback)=>Graph2D,
    getDatasets : ()=>Array<{ dataset : Dataset_Types, draw : Draw_Data_Callback }>
}