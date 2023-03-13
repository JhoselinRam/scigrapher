import { Colorbar_Method_Generator } from "../../Colorbar_Types";
import { Draw_Colorbar } from "./Draw_Colorbar_Types";

function DrawColorbar({} : Colorbar_Method_Generator) : Draw_Colorbar{
    
    //---------------------------------------------
        
        function draw(){
            console.log("now draw :p")
        }
    
    //---------------------------------------------
    
        return {
            draw
        }
    }
    
    export default DrawColorbar;