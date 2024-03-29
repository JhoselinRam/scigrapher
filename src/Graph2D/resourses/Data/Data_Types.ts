import { Area } from "../../../Data/Area/Area_Types";
import { Datasets, Dataset_Options, Partialize } from "../../../Data/Data_Types";
import { Heat_Map } from "../../../Data/HeatMap/Heat_Map_Types";
import { Line_Chart } from "../../../Data/LineChart/LineChart_Types";
import { Vector_Field } from "../../../Data/VectorField/Vector_Field_Types";
import { Graph2D, graphCallback } from "../../Graph2D_Types";

export interface Data {
    addDataset :{
        <T extends Datasets>(type:T, options?:Partialize<Dataset_Options>, callback?:graphCallback) : T extends "linechart" ? Line_Chart : T extends "area"? Area : T extends "heatmap"? Heat_Map : Vector_Field
    },
    removeDataset : (id:string, callback?:graphCallback) => Graph2D,
    getDatasets : ()=>Datasets_Get
}

export interface Datasets_Get {
    linechart : Array<Line_Chart>,
    area : Array<Area>,
    heatmap : Array<Heat_Map>,
    vectorfield : Array<Vector_Field>
}