import { Dataset_Types, Data_Object } from "../../../Data/Data_Types";
import { Graph2D, Method_Generator } from "../../Graph2D_Types";
import { Data } from "./Data_Types";

function Data({state, graphHandler}:Method_Generator) : Data{

//---------------- Add Dataset ----------------

    function addDataset(dataset : Dataset_Types) : Graph2D {
        
        if(isDataset(dataset)) state.data.push(dataset);

        return graphHandler;
    }

//---------------------------------------------
//-------------- Get Datasets -----------------

    function getDatasets() : Array<Dataset_Types>{
        return state.data.slice();
    }

//---------------------------------------------
//--------------- Is Dataset ------------------

    function isDataset(candidate : Dataset_Types) : candidate is Data_Object {
        return "_drawObject" in candidate && "useAxis" in candidate;
    }

//---------------------------------------------

    return {
        addDataset,
        getDatasets
    }

}

export default Data;