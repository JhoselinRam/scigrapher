import { Datasets, Dataset_Options, Dataset_Types, Draw_Data_Callback } from "../../../Data/Data_Types";
import { LineChart } from "../../../Data/LineChart/LineChart.js";
import { Graph2D, Graph2D_State, Method_Generator, RecursivePartial } from "../../Graph2D_Types";
import { Data } from "./Data_Types";

function Data({state, graphHandler}:Method_Generator) : Data{

//---------------- Add Dataset ----------------

    function addDataset<T extends Dataset_Types>(type : Datasets, options : RecursivePartial<Dataset_Options> = {}) : T  {
        
        let newDataset : Dataset_Types;
        let drawDataset : (state : Graph2D_State)=>void;

        switch(type){
            case "linechart":
                [newDataset, drawDataset] = LineChart(options, state.dirty.dirtify);
                break;
        }

        state.data.push({dataset : newDataset, draw:drawDataset});
        newDataset.index(state.data.length);

        return newDataset as T;
    }

//---------------------------------------------
//---------------------------------------------

    function removeDataset(id:string) : Graph2D{
        state.data = state.data.filter(item => item.dataset.id()!==id);
        state.dirty.data = true;

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