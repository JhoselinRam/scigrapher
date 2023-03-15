import { Colorbar, Colorbar_Callback, Colorbar_Data, Colorbar_Entries, Colorbar_Method_Generator } from "../../Colorbar_Types";
import { Colorbar_Data_Methods } from "./Data_Colorbar_Types";

function ColorbarData({barHandler, barState, graphHandler, state} : Colorbar_Method_Generator) : Colorbar_Data_Methods{

//------------------ Data ---------------------

    function data(data:Colorbar_Data, callback?:Colorbar_Callback) : Colorbar;
    function data(arg:void) : Colorbar_Entries;
    function data(data:Colorbar_Data | void, callback?:Colorbar_Callback) : Colorbar | Colorbar_Entries | undefined{
        if(typeof data === "undefined" && callback == null)
            return {...barState.gradient.entries};

        if(typeof data !== "undefined"){
            if(typeof data === "string" && barState.data === data) return barHandler;
            
            if(typeof data === "object" && typeof barState.data === "object"){
                let change = false;
                const currentData = barState.data;
                data.forEach((entrie, i)=>{
                    if(!(entrie.color === currentData[i].color && entrie.label === currentData[i].label &&  entrie.position === currentData[i].position))
                        change = true;
                });

                if(!change) return barHandler;
            }
            
            barState.data = data;
            state.compute.client();
            if(callback != null) callback(barHandler, graphHandler, state.data.map(item=>item.dataset));
            state.dirty.client = true;

            return barHandler;
        }
    }

//---------------------------------------------

    return {
        data
    }
}

export default ColorbarData;