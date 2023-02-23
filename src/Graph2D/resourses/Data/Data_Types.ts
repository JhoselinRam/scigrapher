import { Dataset_Types } from "../../../Data/Data_Types";
import { Graph2D } from "../../Graph2D_Types";

export interface Data {
    addDataset : (dataset : Dataset_Types)=>Graph2D,
    removeDataset : (id:string)=>Graph2D,
    getDatasets : ()=>Array<Dataset_Types>
}