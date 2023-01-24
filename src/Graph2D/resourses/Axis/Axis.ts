import CreateAxis from "../../../tools/Axis_Obj/Axis_Obj.js";
import { Graph2D, Method_Generator, RecursivePartial } from "../../Graph2D_Types";
import { Axis, Axis_Modifier, Axis_Modifier_Props, Domain_Props } from "./Axis_Types";

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
                    context : state.context,
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
                    },
                    width : {
                        base : state.axis.x.baseWidth,
                        tick : state.axis.x.tickWidth,
                    },
                    tickSize : state.axis.x.tickSize,
                    text : {
                        font : state.axis.x.textFont,
                        size : state.axis.x.textSize,
                        filled : state.axis.x.textFill,
                        offset : state.axis.x.textOffset
                    }
                });
                
                state.axisObj.primary.y.draw({
                    context : state.context,
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
                    },
                    width : {
                        base : state.axis.y.baseWidth,
                        tick : state.axis.y.tickWidth,
                    },
                    tickSize : state.axis.y.tickSize,
                    text : {
                        font : state.axis.y.textFont,
                        size : state.axis.y.textSize,
                        filled : state.axis.y.textFill,
                        offset : state.axis.y.textOffset
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














//---------- Customization Methods ------------

//----------------- Domain --------------------

function domain(domain:RecursivePartial<Domain_Props>) : Graph2D;
function domain(arg:void) : Domain_Props;
function domain(domain:RecursivePartial<Domain_Props> | void) : Graph2D | Domain_Props | undefined{
    if(typeof domain === "undefined")
        return {
            x : {
                start : state.axis.x.start,
                end : state.axis.x.end
            },
            y : {
                start : state.axis.y.start,
                end : state.axis.y.end
            }
        }
    
    if(typeof domain === "object"){
        if(domain.x == null && domain.y == null) return graphHandler;
        if(domain.x?.start === state.axis.x.start &&
           domain.x.end === state.axis.x.end &&
           domain.y?.start === state.axis.y.start &&
           domain.y.end === state.axis.y.end) return graphHandler;

        if(domain.x != null){
            if(domain.x.start != null) state.axis.x.start = domain.x.start;
            if(domain.x.end != null) state.axis.x.end = domain.x.end;
        }
        if(domain.y != null){
            if(domain.y.start != null) state.axis.y.start = domain.y.start;
            if(domain.y.end != null) state.axis.y.end = domain.y.end;
        }

        state.compute.client();
        state.draw.client();
        return graphHandler;

    }
    
}

//---------------------------------------------
//-------------- Axis Color -------------------

    function axisColor(colors : Axis_Modifier_Props<string>) : Graph2D;
    function axisColor(arg : void) : Axis_Modifier<string>;
    function axisColor(colors : Axis_Modifier_Props<string> | void) : Graph2D | Axis_Modifier<string> | undefined{
        if(typeof colors == "undefined")
            return {
                base : {
                    x : state.axis.x.baseColor,
                    y : state.axis.y.baseColor,
                },
                tick : {
                    x : state.axis.x.tickColor,
                    y : state.axis.y.tickColor,
                },
                text : {
                    x : state.axis.x.textColor,
                    y : state.axis.y.textColor,
                }
            }
        
        if(typeof colors == "object"){
            if(colors.axis==null && colors.xAxis==null && colors.yAxis==null && colors.base==null && colors.tick==null && colors.text==null) return graphHandler;

            //Cascade the properties
            if(colors.axis != null){
                state.axis.x.baseColor = colors.axis;
                state.axis.x.tickColor = colors.axis;
                state.axis.x.textColor = colors.axis;
                state.axis.y.baseColor = colors.axis;
                state.axis.y.tickColor = colors.axis;
                state.axis.y.textColor = colors.axis;
            }
            if(colors.xAxis != null){
                state.axis.x.baseColor = colors.xAxis;
                state.axis.x.tickColor = colors.xAxis;
                state.axis.x.textColor = colors.xAxis;    
            }
            if(colors.yAxis != null){
                state.axis.y.baseColor = colors.yAxis;
                state.axis.y.tickColor = colors.yAxis;
                state.axis.y.textColor = colors.yAxis;    
            }
            if(colors.base?.x != null) state.axis.x.baseColor = colors.base.x;
            if(colors.base?.y != null) state.axis.y.baseColor = colors.base.y;
            if(colors.tick?.x != null) state.axis.x.tickColor = colors.tick.x;
            if(colors.tick?.y != null) state.axis.y.tickColor = colors.tick.y;
            if(colors.text?.x != null) state.axis.x.textColor = colors.text.x;
            if(colors.text?.y != null) state.axis.y.textColor = colors.text.y;

            state.draw.client();
            return graphHandler;
        }

    }


//---------------------------------------------
//-------------- Axis Color -------------------

function axisOpacity(opacity : Axis_Modifier_Props<number>) : Graph2D;
function axisOpacity(arg : void) : Axis_Modifier<number>;
function axisOpacity(opacity : Axis_Modifier_Props<number> | void) : Graph2D | Axis_Modifier<number> | undefined{
    if(typeof opacity == "undefined")
        return {
            base : {
                x : state.axis.x.baseOpacity,
                y : state.axis.y.baseOpacity,
            },
            tick : {
                x : state.axis.x.tickOpacity,
                y : state.axis.y.tickOpacity,
            },
            text : {
                x : state.axis.x.textOpacity,
                y : state.axis.y.textOpacity,
            }
        }
    
    if(typeof opacity == "object"){
        if(opacity.axis==null && opacity.xAxis==null && opacity.yAxis==null && opacity.base==null && opacity.tick==null && opacity.text==null) return graphHandler;

        //Cascade the properties
        if(opacity.axis != null){
            const newOpacity = opacity.axis < 0 ? 0 : (opacity.axis > 1 ? 1 : opacity.axis);
            state.axis.x.baseOpacity = newOpacity;
            state.axis.x.tickOpacity = newOpacity;
            state.axis.x.textOpacity = newOpacity;
            state.axis.y.baseOpacity = newOpacity;
            state.axis.y.tickOpacity = newOpacity;
            state.axis.y.textOpacity = newOpacity;
        }
        if(opacity.xAxis != null){
            const newOpacity = opacity.xAxis < 0 ? 0 : (opacity.xAxis > 1 ? 1 : opacity.xAxis);
            state.axis.x.baseOpacity = newOpacity;
            state.axis.x.tickOpacity = newOpacity;
            state.axis.x.textOpacity = newOpacity;    
        }
        if(opacity.yAxis != null){
            const newOpacity = opacity.yAxis < 0 ? 0 : (opacity.yAxis > 1 ? 1 : opacity.yAxis);
            state.axis.y.baseOpacity = newOpacity;
            state.axis.y.tickOpacity = newOpacity;
            state.axis.y.textOpacity = newOpacity;    
        }
        if(opacity.base?.x != null) state.axis.x.baseOpacity = opacity.base.x < 0 ? 0 : (opacity.base.x > 1 ? 1 : opacity.base.x);
        if(opacity.base?.y != null) state.axis.y.baseOpacity = opacity.base.y < 0 ? 0 : (opacity.base.y > 1 ? 1 : opacity.base.y);
        if(opacity.tick?.x != null) state.axis.x.tickOpacity = opacity.tick.x < 0 ? 0 : (opacity.tick.x > 1 ? 1 : opacity.tick.x);
        if(opacity.tick?.y != null) state.axis.y.tickOpacity = opacity.tick.y < 0 ? 0 : (opacity.tick.y > 1 ? 1 : opacity.tick.y);
        if(opacity.text?.x != null) state.axis.x.textOpacity = opacity.text.x < 0 ? 0 : (opacity.text.x > 1 ? 1 : opacity.text.x);
        if(opacity.text?.y != null) state.axis.y.textOpacity = opacity.text.y < 0 ? 0 : (opacity.text.y > 1 ? 1 : opacity.text.y);

        state.draw.client();
        return graphHandler;
    }

}


//---------------------------------------------






    return {
        compute,
        draw,
        domain,
        axisColor,
        axisOpacity
    }
}

export default Axis;