import { Colorbar_Method_Generator } from "../../Colorbar_Types";
import { Compute_Colorbar } from "./Compute_Colorbar_Types";

function ComputeColorbar({} : Colorbar_Method_Generator) : Compute_Colorbar{
    
//---------------------------------------------
    
    function compute(){
        console.log("compute :p")
    }

//---------------------------------------------

    return {
        compute
    }
}

export default ComputeColorbar;