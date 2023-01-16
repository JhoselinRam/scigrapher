import CreateAxis from "../../../tools/Axis_Obj/Axis_Obj.js";
import mapping from "../../../tools/Mapping/Mapping.js";
import { Method_Generator } from "../../Graph2D_Types";
import { Axis } from "./Axis_Types";

function Axis({state, graphHandler}:Method_Generator) : Axis{

    function compute(){
        const sc = mapping({from:[1, 20],to:[0,600]});
        const ax = CreateAxis({type:"bottom", scale:sc, suffix:"m"});
    }

    return {
        compute
    }
}

export default Axis;