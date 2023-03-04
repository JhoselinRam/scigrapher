import { Datasets, Dataset_Options, Dataset_Types, Draw_Data_Callback, Partialize } from "../../../Data/Data_Types";
import { LineChart } from "../../../Data/LineChart/LineChart.js";
import { Line_Chart, Line_Chart_Options } from "../../../Data/LineChart/LineChart_Types";
import { VectorField } from "../../../Data/VectorField/Vector_Field.js";
import { Vector_Field, Vector_Field_Options } from "../../../Data/VectorField/Vector_Field_Types";
import { Graph2D, Graph2D_State, graphCallback, Method_Generator } from "../../Graph2D_Types";
import { Data } from "./Data_Types";

function Data({state, graphHandler}:Method_Generator) : Data{

//---------------- Add Dataset ----------------

    function addDataset(type : Datasets, options : Partialize<Dataset_Options> = {}, callback?:graphCallback) : Dataset_Types {
    
        switch(type){
            case "linechart":{
                const [newDataset, drawDataset] = LineChart(options as Partialize<Line_Chart_Options>, graphHandler , state.dirty.dirtify);
                
                state.data.push({dataset : newDataset, draw:drawDataset});
                newDataset.index(state.data.length);
                if(callback != null) callback(graphHandler, state.data.map(set=>set.dataset));

                return newDataset
            }
            
            case "vectorfield":{
                const [newDataset, drawDataset] = VectorField(options as Partialize<Vector_Field_Options>, graphHandler , state.dirty.dirtify);

                state.data.push({dataset : newDataset, draw:drawDataset});
                newDataset.index(state.data.length);
                if(callback != null) callback(graphHandler, state.data.map(set=>set.dataset));

                return newDataset
            }
        }
    }

//---------------------------------------------
//---------------------------------------------

    function removeDataset(id:string, callback?:graphCallback) : Graph2D{
        state.data = state.data.filter(item => item.dataset.id()!==id);
        state.dirty.data = true;
        if(callback != null) callback(graphHandler, state.data.map(set=>set.dataset));

        return graphHandler;
    }

//---------------------------------------------
//-------------- Get Datasets -----------------

    function getDatasets() : Array<{ dataset : Dataset_Types, draw : Draw_Data_Callback }>{
        return state.data.slice();
    }

//---------------------------------------------

    return {
        addDataset,
        removeDataset,
        getDatasets
    }

}

export default Data;