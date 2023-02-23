import { Dataset_Types } from "../../../Data/Data_Types";
import { Graph2D, Method_Generator } from "../../Graph2D_Types";
import { Data } from "./Data_Types";

function Data({state, graphHandler}:Method_Generator) : Data{

//---------------- Add Dataset ----------------

    function addDataset(dataset : Dataset_Types) : Graph2D {
        
        state.data.push(dataset);
        dataset._setDirtifyCallback(state.dirty.dirtify);
        dataset.index(state.data.length);

        return graphHandler;
    }

//---------------------------------------------
//---------------------------------------------

    function removeDataset(id:string) : Graph2D{
        state.data = state.data.filter(dataset => dataset.id()!==id);
        state.dirty.data = true;

        return graphHandler;
    }

//---------------------------------------------
//-------------- Get Datasets -----------------

    function getDatasets() : Array<Dataset_Types>{
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