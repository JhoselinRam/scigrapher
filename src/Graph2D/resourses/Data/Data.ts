import { Dataset_Types } from "../../../Data/Data_Types";
import { Graph2D, Method_Generator } from "../../Graph2D_Types";
import { Data } from "./Data_Types";

function Data({state, graphHandler}:Method_Generator) : Data{

//---------------- Add Dataset ----------------

    function addDataset(dataset : Dataset_Types) : Graph2D {
        state.data.push(dataset);
        return graphHandler;
    }

//---------------------------------------------
//---------------------------------------------

    function removeDataset(id:string){
        
    }

//---------------------------------------------
//-------------- Get Datasets -----------------

    function getDatasets() : Array<Dataset_Types>{
        return state.data.slice();
    }

//---------------------------------------------

    return {
        addDataset,
        getDatasets
    }

}

export default Data;