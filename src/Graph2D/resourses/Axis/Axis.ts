import CreateAxis from "../../../tools/Axis_Obj/Axis_Obj.js";
import { Axis_Property, Graph2D, Method_Generator, RecursivePartial } from "../../Graph2D_Types";
import { Axis, Axis_Modifier, Axis_Modifier_Props, Base_Props, Create_Modifier_Props, Domain_Props, Text_Props, Ticks_Props } from "./Axis_Types";

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
        if(typeof colors === "undefined")
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
        
        if(typeof colors === "object"){
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
//-------------- Axis Opacity -------------------

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
//--------------- Axis Unit -------------------

    function axisUnits(units : RecursivePartial<Axis_Property<string>>) : Graph2D;
    function axisUnits(arg : void) : Axis_Property<string>;
    function axisUnits(units : RecursivePartial<Axis_Property<string>> | void) : Graph2D | Axis_Property<string> | undefined{
        if(typeof units === "undefined")
            return {
                x : state.axis.x.unit,
                y : state.axis.y.unit
            }

        if (typeof units === "object"){
            if(units.x == null && units.y == null) return graphHandler;
            if(units.x === state.axis.x.unit && units.y === state.axis.y.unit) return graphHandler;

            if(units.x != null) state.axis.x.unit = units.x;
            if(units.y != null) state.axis.y.unit = units.y;

            state.compute.client();
            state.draw.client();
            
            return graphHandler;
        }
    }

//---------------------------------------------
//------------------ Base ---------------------

    function axisBase(base : RecursivePartial<Base_Props>) : Graph2D;
    function axisBase(arg : void) : Base_Props;
    function axisBase(base : RecursivePartial<Base_Props> | void) : Graph2D | Base_Props | undefined{
        if(typeof base === "undefined")
            return {
                x : {
                    color : state.axis.x.baseColor,
                    opacity : state.axis.x.baseOpacity,
                    width : state.axis.x.baseWidth
                },
                y : {
                    color : state.axis.y.baseColor,
                    opacity : state.axis.y.baseOpacity,
                    width : state.axis.y.baseWidth
                }
            }

        if(typeof base === "object"){
            if(base.x == null && base.y == null) return graphHandler;
            if(base.x?.color === state.axis.x.baseColor && 
                base.x?.opacity === state.axis.x.baseOpacity && 
                base.x?.width === state.axis.x.baseWidth && 
                base.y?.color === state.axis.y.baseColor && 
                base.y?.opacity === state.axis.y.baseOpacity && 
                base.y?.width === state.axis.y.baseWidth) return graphHandler;

            if(base.x?.color != null) state.axis.x.baseColor = base.x.color;
            if(base.x?.opacity != null) 
                state.axis.x.baseOpacity = base.x.opacity<0?0:(base.x.opacity>1?1:base.x.opacity);
            if(base.x?.width != null) state.axis.x.baseWidth = base.x.width;
            if(base.y?.color != null) state.axis.y.baseColor = base.y.color;
            if(base.y?.opacity != null) 
                state.axis.y.baseOpacity = base.y.opacity<0?0:(base.y.opacity>1?1:base.y.opacity);
            if(base.y?.width != null) state.axis.y.baseWidth = base.y.width;
        
            state.draw.client();
            return graphHandler;
        
        }
    }

//---------------------------------------------
//------------------ Ticks --------------------

    function axisTicks(ticks : RecursivePartial<Ticks_Props>) : Graph2D;
    function axisTicks(arg : void) : Ticks_Props;
    function axisTicks(ticks : RecursivePartial<Ticks_Props> | void) : Graph2D | Ticks_Props | undefined{
        if(typeof ticks === "undefined")
            return {
                x : {
                    color : state.axis.x.tickColor,
                    opacity : state.axis.x.tickOpacity,
                    width : state.axis.x.tickWidth,
                    size : state.axis.x.tickSize
                },
                y : {
                    color : state.axis.y.tickColor,
                    opacity : state.axis.y.tickOpacity,
                    width : state.axis.y.tickWidth,
                    size : state.axis.y.tickSize
                }
            }

        if(typeof ticks === "object"){
            if(ticks.x == null && ticks.y == null) return graphHandler;
            if(ticks.x?.color === state.axis.x.tickColor &&
                ticks.x?.opacity === state.axis.x.tickOpacity &&
                ticks.x?.size === state.axis.x.tickSize &&
                ticks.x?.width === state.axis.x.tickWidth &&
                ticks.y?.color === state.axis.y.tickColor &&
                ticks.y?.opacity === state.axis.y.tickOpacity &&
                ticks.y?.size === state.axis.y.tickSize &&
                ticks.y?.width === state.axis.y.tickWidth) return graphHandler;


            if(ticks.x?.color != null) state.axis.x.tickColor = ticks.x.color;
            if(ticks.x?.opacity != null)
                state.axis.x.tickOpacity = ticks.x.opacity<0?0:(ticks.x.opacity>1?1:ticks.x.opacity);
            if(ticks.x?.size != null) state.axis.x.tickSize = ticks.x.size;
            if(ticks.x?.width != null) state.axis.x.tickWidth = ticks.x.width;
            if(ticks.y?.color != null) state.axis.y.tickColor = ticks.y.color;
            if(ticks.y?.opacity != null)
                state.axis.y.tickOpacity = ticks.y.opacity<0?0:(ticks.y.opacity>1?1:ticks.y.opacity);
            if(ticks.y?.size != null) state.axis.y.tickSize = ticks.y.size;
            if(ticks.y?.width != null) state.axis.y.tickWidth = ticks.y.width;

            state.compute.client();
            state.draw.client();

            return graphHandler;
        }
    }

//---------------------------------------------
//------------------ Text ---------------------

    function axisText(text : RecursivePartial<Text_Props>) : Graph2D;
    function axisText(arg : void) : Text_Props;
    function axisText(text : RecursivePartial<Text_Props> | void) : Graph2D | Text_Props | undefined{
        if(typeof text === "undefined")
            return {
                x : {
                    color : state.axis.x.textColor,
                    opacity : state.axis.x.textOpacity,
                    font : state.axis.x.textFont,
                    size : state.axis.x.textSize,
                    fill : state.axis.x.textFill,
                    offset : state.axis.x.textOffset
                },
                y : {
                    color : state.axis.y.textColor,
                    opacity : state.axis.y.textOpacity,
                    font : state.axis.y.textFont,
                    size : state.axis.y.textSize,
                    fill : state.axis.y.textFill,
                    offset : state.axis.y.textOffset
                },
            }

        if(typeof text === "object"){
            if(text.x == null && text.y == null) return graphHandler;
            if(text.x?.color === state.axis.x.textColor && 
                text.x?.fill === state.axis.x.textFill &&
                text.x?.font === state.axis.x.textFont &&
                text.x?.offset === state.axis.x.textOffset &&
                text.x?.opacity === state.axis.x.textOpacity &&
                text.x?.size === state.axis.x.textSize &&
                text.y?.color === state.axis.y.textColor && 
                text.y?.fill === state.axis.y.textFill &&
                text.y?.font === state.axis.y.textFont &&
                text.y?.offset === state.axis.y.textOffset &&
                text.y?.opacity === state.axis.y.textOpacity &&
                text.y?.size === state.axis.y.textSize) return graphHandler;

            if(text.x?.color != null) state.axis.x.textColor = text.x.color;
            if(text.x?.fill != null) state.axis.x.textFill = text.x.fill;
            if(text.x?.font != null) state.axis.x.textFont = text.x.font;
            if(text.x?.offset != null) state.axis.x.textOffset = text.x.offset;
            if(text.x?.opacity != null)
                state.axis.x.textOpacity = text.x.opacity<0?0:(text.x.opacity>1?1:text.x?.opacity);
            if(text.x?.size != null) state.axis.x.textSize = text.x.size;
            if(text.y?.color != null) state.axis.y.textColor = text.y.color;
            if(text.y?.fill != null) state.axis.y.textFill = text.y.fill;
            if(text.y?.font != null) state.axis.y.textFont = text.y.font;
            if(text.y?.offset != null) state.axis.y.textOffset = text.y.offset;
            if(text.y?.opacity != null)
                state.axis.y.textOpacity = text.y.opacity<0?0:(text.y.opacity>1?1:text.y?.opacity);
            if(text.y?.size != null) state.axis.y.textSize = text.y.size;

            state.compute.client();
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
        axisOpacity,
        axisUnits,
        axisBase,
        axisTicks,
        axisText
    }
}

export default Axis;