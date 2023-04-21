import { Area_Dataset } from "../../../Data/Area/Area.js";
import { Area, Area_Options } from "../../../Data/Area/Area_Types";
import { Datasets, Dataset_Options, Dataset_Types, Partialize } from "../../../Data/Data_Types";
import { HeatMap } from "../../../Data/HeatMap/Heat_Map.js";
import { Heat_Map, Heat_Map_Options } from "../../../Data/HeatMap/Heat_Map_Types";
import { LineChart } from "../../../Data/LineChart/LineChart.js";
import { Line_Chart, Line_Chart_Options } from "../../../Data/LineChart/LineChart_Types";
import { VectorField } from "../../../Data/VectorField/Vector_Field.js";
import { Vector_Field, Vector_Field_Options } from "../../../Data/VectorField/Vector_Field_Types";
import { Graph2D, graphCallback, Method_Generator } from "../../Graph2D_Types";
import { Data, Datasets_Get } from "./Data_Types";

function Data({state, graphHandler}:Method_Generator) : Data{

//---------------- Add Dataset ----------------
    function addDataset<T extends Datasets>(type:T, options?:Partialize<Dataset_Options>, callback?:graphCallback) : T extends "linechart" ? Line_Chart : T extends "area"? Area : T extends "heatmap"? Heat_Map : Vector_Field;
    function addDataset(type:Datasets, options:Partialize<Dataset_Options> = {}, callback?:graphCallback) : Dataset_Types {
    
        switch(type){
            case "linechart":{
                const [newDataset, drawDataset, saveDataset] = LineChart(options as Partialize<Line_Chart_Options>, graphHandler , state.dirty.dirtify);
                
                state.data.push({dataset : newDataset, draw:drawDataset, save:saveDataset});
                newDataset.index(state.data.length);
                if(callback != null) callback(graphHandler);

                return newDataset as Line_Chart;
            }
            
            case "vectorfield":{
                const [newDataset, drawDataset, saveDataset] = VectorField(options as Partialize<Vector_Field_Options>, graphHandler , state.dirty.dirtify);

                state.data.push({dataset : newDataset, draw:drawDataset, save:saveDataset});
                newDataset.index(state.data.length);
                if(callback != null) callback(graphHandler);

                return newDataset as Vector_Field;
            }

            case "heatmap":{
                const [newDataset, drawDataset, saveDataset] = HeatMap(options as Partialize<Heat_Map_Options>, graphHandler , state.dirty.dirtify);

                state.data.push({dataset : newDataset, draw:drawDataset, save:saveDataset});
                newDataset.index(state.data.length);
                if(callback != null) callback(graphHandler);

                return newDataset as Heat_Map;
            }

            case "area":{
                const [newDataset, drawDataset, saveDataset] = Area_Dataset(options as Partialize<Area_Options>, graphHandler , state.dirty.dirtify);

                state.data.push({dataset : newDataset, draw:drawDataset, save:saveDataset});
                newDataset.index(state.data.length);
                if(callback != null) callback(graphHandler);

                return newDataset as Area;
            }
        }
    }

//---------------------------------------------
//------------- Remove Dataset ----------------

    function removeDataset(id:string, callback?:graphCallback) : Graph2D{
        const index = state.data.findIndex(item=>item.dataset.id() === id);

        if(index === -1)
            return graphHandler;

        state.data.splice(index, 1); 
        state.dirty.data = true;
        if(callback != null) callback(graphHandler);

        return graphHandler;
    }

//---------------------------------------------
//-------------- Get Datasets -----------------

    function getDatasets() : Datasets_Get{
        const linechart : Array<Line_Chart> = [];
        const area : Array<Area> = [];
        const heatmap : Array<Heat_Map> = [];
        const vectorfield : Array<Vector_Field> = [];

        state.data.forEach(set=>{
            switch(set.dataset.datasetType()){
                case "linechart":
                    linechart.push(set.dataset as Line_Chart);
                    break;
                case "area":
                    area.push(set.dataset as Area);
                    break;
                case "heatmap":
                    heatmap.push(set.dataset as Heat_Map);
                    break;
                case "vectorfield":
                    vectorfield.push(set.dataset as Vector_Field);
                    break;
            }
        })

        return {
            linechart,
            area, 
            heatmap,
            vectorfield
        }
    }

//---------------------------------------------

    return {
        addDataset,
        removeDataset,
        getDatasets
    }

}

export default Data;