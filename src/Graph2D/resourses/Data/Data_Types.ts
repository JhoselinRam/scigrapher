import { Datasets, Dataset_Options, Dataset_Types, Draw_Data_Callback } from "../../../Data/Data_Types";
import { Partialize } from "../../../Data/LineChart/LineChart_Types";
import { Graph2D, RecursivePartial } from "../../Graph2D_Types";

export interface Data {
    addDataset :<T extends Dataset_Types>(type : Datasets, options : Partialize<Dataset_Options>)=>T,
    removeDataset : (id:string)=>Graph2D,
    getDatasets : ()=>Array<{ dataset : Dataset_Types, draw : Draw_Data_Callback }>
}