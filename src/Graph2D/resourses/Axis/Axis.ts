import CreateAxis from "../../../tools/Axis_Obj/Axis_Obj.js";
import { Axis_Position, Axis_Property, Axis_Type, Graph2D, Method_Generator, RecursivePartial } from "../../Graph2D_Types";
import { Axis, Axis_Modifier, Axis_Modifier_Props, Axis_Overlap, Base_Props, Domain_Props, Dynamic_Props, Text_Props, Ticks_Props } from "./Axis_Types";

function Axis({state, graphHandler}:Method_Generator) : Axis{

//---------------- Compute --------------------

    function compute(){
        const primaryAxisX = CreateAxis({state, axis:"x", scale:"primary"});
        const primaryAxisY = CreateAxis({state, axis:"y", scale:"primary"});

        state.axisObj.primary.obj = {
            x : primaryAxisX,
            y : primaryAxisY
        }

    }

//---------------------------------------------
//----------------- Draw ----------------------

    function draw(){
        if(state.axis.overlapPriority === "x"){
            state.axisObj.primary.obj?.y.draw();
            state.axisObj.primary.obj?.x.draw();
        }
        if(state.axis.overlapPriority === "y"){
            state.axisObj.primary.obj?.x.draw();
            state.axisObj.primary.obj?.y.draw();
        }
    }

//---------------------------------------------














//---------- Customization Methods ------------

//-------------- Axis Position ----------------

    function axisPosition(position : Axis_Position, callback?:(handler?:Graph2D)=>void) : Graph2D;
    function axisPosition(arg : void) : Axis_Position;
    function axisPosition(position : Axis_Position | void, callback?:(handler?:Graph2D)=>void) : Graph2D | Axis_Position | undefined {
        if(typeof position === "undefined" && callback==null)
            return state.axis.position;

        if(typeof position === "string"){
            if(position === state.axis.position) return graphHandler;

            state.axis.position = position;

            state.compute.full();
            if(callback != null) callback(graphHandler);
            state.dirty.full = true;
            

            return graphHandler;
        }
    }

//---------------------------------------------
//---------------- Axis Type ------------------

    function axisType(type : Axis_Type, callback?:(handler?:Graph2D)=>void) : Graph2D;
    function axisType(arg : void) : Axis_Type;
    function axisType(type : Axis_Type | void, callback?:(handler?:Graph2D)=>void) : Graph2D | Axis_Type | undefined{
        if(typeof type === "undefined" && callback==null)
            return state.axis.type;

        if(typeof type === "string"){
            if(type === state.axis.type) return graphHandler;

            state.axis.type = type;
            state.compute.client();
            if(callback != null) callback(graphHandler);
            state.dirty.client = true;

            return graphHandler;
        }
    }

//---------------------------------------------
//----------------- Domain --------------------

function axisDomain(domain:RecursivePartial<Domain_Props>, callback?:(handler?:Graph2D)=>void) : Graph2D;
function axisDomain(arg:void) : Domain_Props;
function axisDomain(domain:RecursivePartial<Domain_Props> | void, callback?:(handler?:Graph2D)=>void) : Graph2D | Domain_Props | undefined{
    if(typeof domain === "undefined" && callback==null)
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
        if(callback != null) callback(graphHandler);
        state.dirty.client = true;

        return graphHandler;

    }
    
}

//---------------------------------------------
//-------------- Axis Color -------------------

    function axisColor(colors : Axis_Modifier_Props<string>, callback?:(handler?:Graph2D)=>void) : Graph2D;
    function axisColor(arg : void) : Axis_Modifier<string>;
    function axisColor(colors : Axis_Modifier_Props<string> | void, callback?:(handler?:Graph2D)=>void) : Graph2D | Axis_Modifier<string> | undefined{
        if(typeof colors === "undefined" && callback == null)
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


            if(callback != null) callback(graphHandler);
            state.dirty.client = true;
            
            return graphHandler;
        }

    }


//---------------------------------------------
//-------------- Axis Opacity -------------------

function axisOpacity(opacity : Axis_Modifier_Props<number>, callback?:(handler?:Graph2D)=>void) : Graph2D;
function axisOpacity(arg : void) : Axis_Modifier<number>;
function axisOpacity(opacity : Axis_Modifier_Props<number> | void, callback?:(handler?:Graph2D)=>void) : Graph2D | Axis_Modifier<number> | undefined{
    if(typeof opacity == "undefined" && callback == null)
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



        if(callback != null) callback(graphHandler);
        state.dirty.client = true;
        
        return graphHandler;
    }

}

//---------------------------------------------
//--------------- Axis Unit -------------------

    function axisUnits(units : RecursivePartial<Axis_Property<string>>, callback?:(handler?:Graph2D)=>void) : Graph2D;
    function axisUnits(arg : void) : Axis_Property<string>;
    function axisUnits(units : RecursivePartial<Axis_Property<string>> | void, callback?:(handler?:Graph2D)=>void) : Graph2D | Axis_Property<string> | undefined{
        if(typeof units === "undefined" && callback == null)
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
            if(callback != null) callback(graphHandler);
            state.dirty.client = true;
            
            return graphHandler;
        }
    }

//---------------------------------------------
//------------------ Base ---------------------

    function axisBase(base : RecursivePartial<Base_Props>, callback?:(handler?:Graph2D)=>void) : Graph2D;
    function axisBase(arg : void) : Base_Props;
    function axisBase(base : RecursivePartial<Base_Props> | void, callback?:(handler?:Graph2D)=>void) : Graph2D | Base_Props | undefined{
        if(typeof base === "undefined" && callback == null)
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
        


            if(callback != null) callback(graphHandler);
            state.dirty.client = true;
            
            return graphHandler;
        
        }
    }

//---------------------------------------------
//------------------ Ticks --------------------

    function axisTicks(ticks : RecursivePartial<Ticks_Props>, callback?:(handler?:Graph2D)=>void) : Graph2D;
    function axisTicks(arg : void) : Ticks_Props;
    function axisTicks(ticks : RecursivePartial<Ticks_Props> | void , callback?:(handler?:Graph2D)=>void) : Graph2D | Ticks_Props | undefined{
        if(typeof ticks === "undefined" && callback == null)
            return {
                x : {
                    color : state.axis.x.tickColor,
                    opacity : state.axis.x.tickOpacity,
                    width : state.axis.x.tickWidth,
                    size : state.axis.x.tickSize,
                    ticks : state.axis.x.ticks,
                    minSpacing : state.axis.x.minSpacing
                },
                y : {
                    color : state.axis.y.tickColor,
                    opacity : state.axis.y.tickOpacity,
                    width : state.axis.y.tickWidth,
                    size : state.axis.y.tickSize,
                    ticks : state.axis.y.ticks,
                    minSpacing : state.axis.y.minSpacing
                }
            }

        if(typeof ticks === "object"){
            if(ticks.x == null && ticks.y == null) return graphHandler;
            if(ticks.x?.color === state.axis.x.tickColor &&
                ticks.x?.opacity === state.axis.x.tickOpacity &&
                ticks.x?.size === state.axis.x.tickSize &&
                ticks.x?.width === state.axis.x.tickWidth &&
                ticks.x?.ticks === state.axis.x.ticks &&
                ticks.x?.minSpacing === state.axis.x.minSpacing &&
                ticks.y?.color === state.axis.y.tickColor &&
                ticks.y?.opacity === state.axis.y.tickOpacity &&
                ticks.y?.size === state.axis.y.tickSize &&
                ticks.y?.width === state.axis.y.tickWidth &&
                ticks.y?.ticks === state.axis.y.ticks &&
                ticks.y?.minSpacing === state.axis.y.minSpacing) return graphHandler;


            if(ticks.x?.color != null) state.axis.x.tickColor = ticks.x.color;
            if(ticks.x?.opacity != null)
                state.axis.x.tickOpacity = ticks.x.opacity<0?0:(ticks.x.opacity>1?1:ticks.x.opacity);
            if(ticks.x?.size != null) state.axis.x.tickSize = ticks.x.size;
            if(ticks.x?.width != null) state.axis.x.tickWidth = ticks.x.width;
            if(ticks.x?.ticks != null) state.axis.x.ticks = ticks.x.ticks as "auto"|number|number[];
            if(ticks.x?.minSpacing != null) state.axis.x.minSpacing = ticks.x.minSpacing;
            if(ticks.y?.color != null) state.axis.y.tickColor = ticks.y.color;
            if(ticks.y?.opacity != null)
                state.axis.y.tickOpacity = ticks.y.opacity<0?0:(ticks.y.opacity>1?1:ticks.y.opacity);
            if(ticks.y?.size != null) state.axis.y.tickSize = ticks.y.size;
            if(ticks.y?.width != null) state.axis.y.tickWidth = ticks.y.width;
            if(ticks.y?.ticks != null) state.axis.y.ticks = ticks.y.ticks as "auto"|number|number[];
            if(ticks.y?.minSpacing != null) state.axis.y.minSpacing = ticks.y.minSpacing;

            
            state.compute.client();
            if(callback != null) callback(graphHandler);
            state.dirty.client = true;
            

            return graphHandler;
        }
    }

//---------------------------------------------
//------------------ Text ---------------------

    function axisText(text : RecursivePartial<Text_Props>, callback?:(handler?:Graph2D)=>void) : Graph2D;
    function axisText(arg : void) : Text_Props;
    function axisText(text : RecursivePartial<Text_Props> | void, callback?:(handler?:Graph2D)=>void) : Graph2D | Text_Props | undefined{
        if(typeof text === "undefined" && callback == null)
            return {
                x : {
                    color : state.axis.x.textColor,
                    opacity : state.axis.x.textOpacity,
                    font : state.axis.x.textFont,
                    size : state.axis.x.textSize
                },
                y : {
                    color : state.axis.y.textColor,
                    opacity : state.axis.y.textOpacity,
                    font : state.axis.y.textFont,
                    size : state.axis.y.textSize
                },
            }

        if(typeof text === "object"){
            if(text.x == null && text.y == null) return graphHandler;
            if(text.x?.color === state.axis.x.textColor && 
                text.x?.font === state.axis.x.textFont &&
                text.x?.opacity === state.axis.x.textOpacity &&
                text.x?.size === state.axis.x.textSize &&
                text.y?.color === state.axis.y.textColor && 
                text.y?.font === state.axis.y.textFont &&
                text.y?.opacity === state.axis.y.textOpacity &&
                text.y?.size === state.axis.y.textSize) return graphHandler;

            if(text.x?.color != null) state.axis.x.textColor = text.x.color;
            if(text.x?.font != null) state.axis.x.textFont = text.x.font;
            if(text.x?.opacity != null)
                state.axis.x.textOpacity = text.x.opacity<0?0:(text.x.opacity>1?1:text.x?.opacity);
            if(text.x?.size != null) state.axis.x.textSize = text.x.size;
            if(text.y?.color != null) state.axis.y.textColor = text.y.color;
            if(text.y?.font != null) state.axis.y.textFont = text.y.font;
            if(text.y?.opacity != null)
                state.axis.y.textOpacity = text.y.opacity<0?0:(text.y.opacity>1?1:text.y?.opacity);
            if(text.y?.size != null) state.axis.y.textSize = text.y.size;


            state.compute.client();
            if(callback != null) callback(graphHandler);
            state.dirty.client = true;

            return graphHandler;
        }
    }

//---------------------------------------------
//----------------- Dynamic -------------------

    function axisDynamic(options : RecursivePartial<Dynamic_Props>, callback?:(handler?:Graph2D)=>void) : Graph2D;
    function axisDynamic(arg : void) : Dynamic_Props;
    function axisDynamic(options : RecursivePartial<Dynamic_Props> | void, callback?:(handler?:Graph2D)=>void) : Graph2D | Dynamic_Props | undefined{
        if(typeof options === "undefined" && callback == null)
            return {
                x : {
                    dynamic : state.axis.x.dynamic,
                    contained : state.axis.x.contained
                },
                y : {
                    dynamic : state.axis.y.dynamic,
                    contained : state.axis.y.contained
                }
            }

        if(typeof options === "object"){
            if(options.x == null && options.y == null) return graphHandler;
            if(options.x?.dynamic === state.axis.x.dynamic && options.x?.contained === state.axis.x.contained &&
                options.y?.dynamic === state.axis.y.dynamic && options.y?.contained === state.axis.y.contained) 
                return graphHandler;

            if(options.x?.dynamic != null) state.axis.x.dynamic = options.x.dynamic;
            if(options.x?.contained != null) state.axis.x.contained = options.x.contained;
            if(options.y?.dynamic != null) state.axis.y.dynamic = options.y.dynamic;
            if(options.y?.contained != null) state.axis.y.contained = options.y.contained;

            
            state.compute.client();
            if(callback != null) callback(graphHandler);
            state.dirty.client = true;
            

            return graphHandler;
        }
    }

//---------------------------------------------
//-------------- Axis Overlap -----------------

    function axisOverlap(overlap : RecursivePartial<Axis_Overlap>, callback?:(handler?:Graph2D)=>void) : Graph2D;
    function axisOverlap(arg : void) : Axis_Overlap;
    function axisOverlap(overlap:RecursivePartial<Axis_Overlap>|void, callback?:(handler?:Graph2D)=>void) : Graph2D|Axis_Overlap|undefined{
        if(typeof overlap === "undefined" && callback == null)
            return {
                priority : state.axis.overlapPriority,
                x : state.axis.x.overlap,
                y : state.axis.y.overlap
            };

        if(typeof overlap === "object"){
            if(overlap.priority == null && overlap.x == null && overlap.y == null) return graphHandler;
            if(overlap.priority === state.axis.overlapPriority && overlap.x === state.axis.x.overlap && overlap.y === state.axis.y.overlap) return graphHandler;

            if(overlap.priority != null) state.axis.overlapPriority = overlap.priority;
            if(overlap.x != null) state.axis.x.overlap = overlap.x;
            if(overlap.y != null) state.axis.y.overlap = overlap.y;

        
            
            if(callback != null) callback(graphHandler);
            state.dirty.client = true;

            return graphHandler;
        }
    }

//---------------------------------------------


    return {
        compute,
        draw,
        axisPosition,
        axisDomain,
        axisColor,
        axisOpacity,
        axisUnits,
        axisBase,
        axisTicks,
        axisText,
        axisDynamic,
        axisOverlap,
        axisType
    }
}

export default Axis;