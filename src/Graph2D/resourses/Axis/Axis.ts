import CreateAxis from "../../../tools/Axis_Obj/Axis_Obj.js";
import { Method_Generator } from "../../Graph2D_Types";
import { Axis } from "./Axis_Types";

function Axis({state, graphHandler}:Method_Generator) : Axis{

//---------------- Compute --------------------

    function compute(){
        const primaryAxisX = CreateAxis({scale:state.scale.primary.x, suffix:state.axis.x.unit});
        const primaryAxisY = CreateAxis({scale:state.scale.primary.y, suffix:state.axis.y.unit});

        state.axisObj.primary = {
            x : primaryAxisX,
            y : primaryAxisY
        }

    }

//---------------------------------------------
//----------------- Draw ----------------------

    function draw(){
        switch(state.axis.position){
            case "center":
                state.axisObj.primary.x.draw({
                    type : "centerX",
                    position : state.scale.primary.y.map(0),
                    dynamic : state.axis.x.dynamic,                    
                    contained : state.axis.x.contained,
                    color : {
                        base : state.axis.x.baseColor,
                        tick : state.axis.x.tickColor,
                        text : state.axis.x.textColor,
                    },                    
                    opacity : {
                        base : state.axis.x.baseOpacity,
                        tick : state.axis.x.tickOpacity,
                        text : state.axis.x.textOpacity,
                    }                    
                });
                
                state.axisObj.primary.y.draw({
                    type : "centerY",
                    position : state.scale.primary.x.map(0),
                    dynamic : state.axis.y.dynamic,                    
                    contained : state.axis.y.contained,
                    color : {
                        base : state.axis.y.baseColor,
                        tick : state.axis.y.tickColor,
                        text : state.axis.y.textColor,
                    },                    
                    opacity : {
                        base : state.axis.y.baseOpacity,
                        tick : state.axis.y.tickOpacity,
                        text : state.axis.y.textOpacity,
                    }                    
                });

                break;
            
            case "bottom-left":
                break;

            case "bottom-right":
                break;

            case "top-left":
                break;

            case "top-right":
                break;
        }
    }

//---------------------------------------------

    return {
        compute,
        draw
    }
}

export default Axis;