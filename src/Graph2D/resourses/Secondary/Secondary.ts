import CreateAxis from "../../../tools/Axis_Obj/Axis_Obj.js";
import { Axis_Obj } from "../../../tools/Axis_Obj/Axis_Obj_Types";
import { Axis_Property, Graph2D, Method_Generator, RecursivePartial, Secondary_Axis } from "../../Graph2D_Types";
import { Base_Props, Domain_Props, Text_Props, Ticks_Props } from "../Axis/Axis_Types.js";
import { Secondary, Secondary_Axis_Modifier, Secondary_Axis_Modifier_Props } from "./Secondary_Types";

function Secondary({state, graphHandler}:Method_Generator) : Secondary {

//---------------- Compute --------------------

    function compute(){
        if(state.axis.position === "center") return;

        const secondaryAxis : Partial<Axis_Property<Axis_Obj>> = {};
        if(state.secondary.x != null && state.secondary.x.enable)
            secondaryAxis.x = CreateAxis({state, axis:"x", scale:"secondary"});
        if(state.secondary.y != null && state.secondary.y.enable)
            secondaryAxis.y = CreateAxis({state, axis:"y", scale:"secondary"});

        
        state.axisObj.secondary.obj = secondaryAxis;
    }

//---------------------------------------------
//------------------ Draw ---------------------

    function draw(){
        if(state.axis.position === "center") return;
        
        if(state.secondary.x!=null && state.secondary.x.enable)
            state.axisObj.secondary?.obj?.x?.draw();
        if(state.secondary.y!=null && state.secondary.y.enable)
            state.axisObj.secondary?.obj?.y?.draw();
    }

//---------------------------------------------




























const defaultSecondaryAxis : Secondary_Axis = {
    enable : true,
    type : "rectangular",
    unit : "",
    start : -5,
    end : 5,
    baseColor : "#000000",
    baseOpacity : 1,
    baseWidth : 1,
    tickColor : "#000000",
    tickOpacity : 1,
    tickWidth : 1,
    tickSize : 5,
    textColor : "#000000",
    textOpacity : 1,
    textFont : "Arial, Helvetica Neue, Helvetica, sans-serif",
    textSize : "10px",
    ticks : "auto",
    minSpacing : 45
};

//---------- Customization Methods ------------
//---------------- Enable ---------------------

function secondaryAxisEnable(enable : Partial<Axis_Property<boolean>>) : Graph2D;
function secondaryAxisEnable(arg : void) : Partial<Axis_Property<boolean>>;
function secondaryAxisEnable(enable : Partial<Axis_Property<boolean>> | void) : Graph2D | Partial<Axis_Property<boolean>> | undefined {
    if(typeof enable === "undefined"){
        const axisEnabled : Partial<Axis_Property<boolean>> = {};

        if(state.secondary.x != null)
            axisEnabled.x = state.secondary.x.enable;
        if(state.secondary.y != null)
            axisEnabled.y = state.secondary.y.enable;

        return axisEnabled;
    }

    if(typeof enable === "object"){
        if(enable.x == null && enable.y==null) return graphHandler;

        let changeX = false;
        let changeY = false;

        if(state.secondary.x != null){
            if(enable.x != null && enable.x !== state.secondary.x.enable){
                state.secondary.x.enable = enable.x;
                changeX = true;
            }
        }
        if(state.secondary.y != null){
            if(enable.y != null && enable.y !== state.secondary.y.enable){
                state.secondary.y.enable = enable.y;
                changeY = true;
            }
        }

        if(state.secondary.x == null && enable.x != null){
            state.secondary.x = {
                ...defaultSecondaryAxis,
                enable : enable.x
            }
            changeX = true;
        }

        if(state.secondary.y == null && enable.y != null){
            state.secondary.y = {
                ...defaultSecondaryAxis,
                enable : enable.y
            }
            changeY = true;
        }

        if(changeX || changeY){
            state.compute.client();
            state.draw.client();
        }

        return graphHandler;
    }
}

//---------------------------------------------
//----------------- Domain --------------------

function secondaryAxisDomain(domain:RecursivePartial<Domain_Props>) : Graph2D;
function secondaryAxisDomain(arg:void) : RecursivePartial<Domain_Props>;
function secondaryAxisDomain(domain:RecursivePartial<Domain_Props> | void) : Graph2D | RecursivePartial<Domain_Props> | undefined{
    if(typeof domain === "undefined"){
        let xDomain : {start:number, end:number} | undefined = undefined;
        let yDomain : {start:number, end:number} | undefined = undefined;

        if(state.secondary.x != null)
            xDomain = {
                start : state.secondary.x.start,
                end : state.secondary.x.end,
            };
            
        if(state.secondary.y != null)
            yDomain = {
                start : state.secondary.y.start,
                end : state.secondary.y.end,
            };

        return {
            x : xDomain,
            y : yDomain
        }
    }
    
    if(typeof domain === "object"){
        if(domain.x == null && domain.y == null) return graphHandler;
        if(state.secondary.x == null && state.secondary.y == null) return graphHandler;

        let changeX = false;
        let changeY = false;

        if(state.secondary.x != null){
            if(domain.x != null){
                if(domain.x.start != null && domain.x.start !== state.secondary.x.start){
                    state.secondary.x.start = domain.x.start;
                    changeX = true;
                } 
                if(domain.x.end != null && domain.x.end !== state.secondary.x.end){
                    state.secondary.x.end = domain.x.end;
                    changeX = true;
                } 
            }
        }
        
        if(state.secondary.y != null){
            if(domain.y != null){
                if(domain.y.start != null && domain.y.start !== state.secondary.y.start){
                    state.secondary.y.start = domain.y.start;
                    changeY = true;
                } 
                if(domain.y.end != null && domain.y.end !== state.secondary.y.end){
                    state.secondary.y.end = domain.y.end;
                    changeY = true;
                } 
            }
        }


        if(changeX || changeY){
            state.compute.client();
            state.draw.client();
        }

        return graphHandler;
    }
    
}

//---------------------------------------------
//---------------- Axis Type ------------------

    function secondaryAxisType(types : Partial<Axis_Property<"rectangular"|"log">>) : Graph2D;
    function secondaryAxisType(arg : void) : Partial<Axis_Property<"rectangular"|"log">>;
    function secondaryAxisType(types : Partial<Axis_Property<"rectangular"|"log">> | void) : Graph2D | Partial<Axis_Property<"rectangular"|"log">> | undefined{
        if(typeof types === "undefined"){
            const axisTypes : Partial<Axis_Property<"rectangular"|"log">> = {};
            if(state.secondary.x != null)
                axisTypes.x = state.secondary.x.type;
            if(state.secondary.y != null)
                axisTypes.y = state.secondary.y.type;

            return axisTypes;
        }

        if(typeof types === "object"){
            if(types.x == null && types.y == null) return graphHandler;
            if(state.secondary.x == null && state.secondary.y == null) return graphHandler;

            let changeX = false;
            let changeY = false;

            if(state.secondary.x != null && types.x != null){
                state.secondary.x.type = types.x;
                changeX = true;
            }
            
            if(state.secondary.y != null && types.y != null){
                state.secondary.y.type = types.y;
                changeY = true;
            }

            if(changeX || changeY){
                state.compute.client();
                state.draw.client();
            }

            return graphHandler;
        
        }
    }


//---------------------------------------------
//-------------- Axis Color -------------------

function secondaryAxisColor(colors : Secondary_Axis_Modifier_Props<string>) : Graph2D;
function secondaryAxisColor(arg : void) : Secondary_Axis_Modifier<string>;
function secondaryAxisColor(colors : Secondary_Axis_Modifier_Props<string> | void) : Graph2D | Secondary_Axis_Modifier<string> | undefined{
    if(typeof colors === "undefined"){
        const axisColors : Secondary_Axis_Modifier<string> = {base:{}, tick:{}, text:{}};
        
        if(state.secondary.x != null){
            axisColors.base.x = state.secondary.x.baseColor;
            axisColors.tick.x = state.secondary.x.tickColor;
            axisColors.text.x = state.secondary.x.textColor;
        }
        if(state.secondary.y != null){
            axisColors.base.y = state.secondary.y.baseColor;
            axisColors.tick.y = state.secondary.y.tickColor;
            axisColors.text.y = state.secondary.y.textColor;
        }

        return axisColors;
    }
    
    if(typeof colors === "object"){
        if(colors.axis==null && colors.xAxis==null && colors.yAxis==null && colors.base==null && colors.tick==null && colors.text==null) return graphHandler;
        if(state.secondary.x == null && state.secondary.y == null) return graphHandler;

        //Cascade the properties
        if(state.secondary.x != null){
            if(colors.axis != null){
                state.secondary.x.baseColor = colors.axis;
                state.secondary.x.tickColor = colors.axis;
                state.secondary.x.textColor = colors.axis;    
            }
            if(colors.xAxis != null){
                state.secondary.x.baseColor = colors.xAxis;
                state.secondary.x.tickColor = colors.xAxis;
                state.secondary.x.textColor = colors.xAxis;    
            }
            if(colors.base?.x != null) state.secondary.x.baseColor = colors.base.x;    
            if(colors.tick?.x != null) state.secondary.x.tickColor = colors.tick.x;    
            if(colors.text?.x != null) state.secondary.x.textColor = colors.text.x;    
        }
        
        if(state.secondary.y != null){
            if(colors.axis != null){
                state.secondary.y.baseColor = colors.axis;
                state.secondary.y.tickColor = colors.axis;
                state.secondary.y.textColor = colors.axis;    
            }
            if(colors.yAxis != null){
                state.secondary.y.baseColor = colors.yAxis;
                state.secondary.y.tickColor = colors.yAxis;
                state.secondary.y.textColor = colors.yAxis;    
            }
            if(colors.base?.y != null) state.secondary.y.baseColor = colors.base.y;    
            if(colors.tick?.y != null) state.secondary.y.tickColor = colors.tick.y;    
            if(colors.text?.y != null) state.secondary.y.textColor = colors.text.y;    
        }


        state.draw.client();
        return graphHandler;
    }

}

//---------------------------------------------
//-------------- Axis Opacity -------------------

function secondaryAxisOpacity(opacity : Secondary_Axis_Modifier_Props<number>) : Graph2D;
function secondaryAxisOpacity(arg : void) : Secondary_Axis_Modifier<number>;
function secondaryAxisOpacity(opacity : Secondary_Axis_Modifier_Props<number> | void) : Graph2D | Secondary_Axis_Modifier<number> | undefined{
    if(typeof opacity === "undefined"){
        const axisOpacity : Secondary_Axis_Modifier<number> = {base:{}, tick:{}, text:{}};
        
        if(state.secondary.x != null){
            axisOpacity.base.x = state.secondary.x.baseOpacity;
            axisOpacity.tick.x = state.secondary.x.tickOpacity;
            axisOpacity.text.x = state.secondary.x.textOpacity;
        }
        if(state.secondary.y != null){
            axisOpacity.base.y = state.secondary.y.baseOpacity;
            axisOpacity.tick.y = state.secondary.y.tickOpacity;
            axisOpacity.text.y = state.secondary.y.textOpacity;
        }

        return axisOpacity;
    }
    
    if(typeof opacity === "object"){
        if(opacity.axis==null && opacity.xAxis==null && opacity.yAxis==null && opacity.base==null && opacity.tick==null && opacity.text==null) return graphHandler;
        if(state.secondary.x == null && state.secondary.y == null) return graphHandler;

        //Cascade the properties
        if(state.secondary.x != null){
            if(opacity.axis != null){
                const newOpacity = opacity.axis<0?0:(opacity.axis>1?1:opacity.axis);
                state.secondary.x.baseOpacity = newOpacity;
                state.secondary.x.tickOpacity = newOpacity;
                state.secondary.x.textOpacity = newOpacity;    
            }
            if(opacity.xAxis != null){
                const newOpacity = opacity.xAxis<0?0:(opacity.xAxis>1?1:opacity.xAxis);
                state.secondary.x.baseOpacity = newOpacity;
                state.secondary.x.tickOpacity = newOpacity;
                state.secondary.x.textOpacity = newOpacity;    
            }
            if(opacity.base?.x != null) state.secondary.x.baseOpacity = opacity.base.x<0?0:(opacity.base.x>1?1:opacity.base.x);    
            if(opacity.tick?.x != null) state.secondary.x.tickOpacity = opacity.tick.x<0?0:(opacity.tick.x>1?1:opacity.tick.x);    
            if(opacity.text?.x != null) state.secondary.x.textOpacity = opacity.text.x<0?0:(opacity.text.x>1?1:opacity.text.x);    
        }
        
        if(state.secondary.y != null){
            if(opacity.axis != null){
                const newOpacity = opacity.axis<0?0:(opacity.axis>1?1:opacity.axis);
                state.secondary.y.baseOpacity = newOpacity;
                state.secondary.y.tickOpacity = newOpacity;
                state.secondary.y.textOpacity = newOpacity;    
            }
            if(opacity.yAxis != null){
                const newOpacity = opacity.yAxis<0?0:(opacity.yAxis>1?1:opacity.yAxis);
                state.secondary.y.baseOpacity = newOpacity;
                state.secondary.y.tickOpacity = newOpacity;
                state.secondary.y.textOpacity = newOpacity;    
            }
            if(opacity.base?.y != null) state.secondary.y.baseOpacity = opacity.base.y<0?0:(opacity.base.y>1?1:opacity.base.y);    
            if(opacity.tick?.y != null) state.secondary.y.tickOpacity = opacity.tick.y<0?0:(opacity.tick.y>1?1:opacity.tick.y);    
            if(opacity.text?.y != null) state.secondary.y.textOpacity = opacity.text.y<0?0:(opacity.text.y>1?1:opacity.text.y);    
        }


        state.draw.client();
        return graphHandler;
    }

}

//---------------------------------------------
//--------------- Axis Unit -------------------

function secondaryAxisUnits(units : RecursivePartial<Axis_Property<string>>) : Graph2D;
function secondaryAxisUnits(arg : void) : Partial<Axis_Property<string>>;
function secondaryAxisUnits(units : RecursivePartial<Axis_Property<string>> | void) : Graph2D | Partial<Axis_Property<string>> | undefined{
    if(typeof units === "undefined"){
        const axisUnits : Partial<Axis_Property<string>> = {};

        if(state.secondary.x != null)
            axisUnits.x = state.secondary.x.unit;
        if(state.secondary.y != null)
            axisUnits.y = state.secondary.y.unit;

        return axisUnits;
    }
        
    if (typeof units === "object"){
        if(units.x == null && units.y == null) return graphHandler;
        if(state.secondary.x == null && state.secondary.y == null) return graphHandler;

        let changeX = false;
        let changeY = false;

        if(state.secondary.x != null){
            if(units.x != null && units.x !== state.secondary.x.unit){
                state.secondary.x.unit = units.x;
                changeX = true;
            }
        }
        if(state.secondary.y != null){
            if(units.y != null && units.y !== state.secondary.y.unit){
                state.secondary.y.unit = units.y;
                changeX = true;
            }
        }

        if(changeX || changeY){
            state.compute.client();
            state.draw.client();
        }
        
        return graphHandler;
    }
}

//---------------------------------------------
//------------------ Base ---------------------

function secondaryAxisBase(base : RecursivePartial<Base_Props>) : Graph2D;
function secondaryAxisBase(arg : void) : Partial<Base_Props>;
function secondaryAxisBase(base : RecursivePartial<Base_Props> | void) : Graph2D | Partial<Base_Props> | undefined{
    if(typeof base === "undefined"){
        const axisBase : Partial<Base_Props> = {};

        if(state.secondary.x != null){
            axisBase.x = {
                color : state.secondary.x.baseColor,
                opacity : state.secondary.x.baseOpacity,
                width : state.secondary.x.baseWidth
            }
        }
        if(state.secondary.y != null){
            axisBase.y = {
                color : state.secondary.y.baseColor,
                opacity : state.secondary.y.baseOpacity,
                width : state.secondary.y.baseWidth
            }
        }

        return axisBase;
    }

    if(typeof base === "object"){
        if(base.x == null && base.y == null) return graphHandler;
        if(state.secondary.x == null && state.secondary.y == null) return graphHandler;

        let changeX = false;
        let changeY = false;

        if(state.secondary.x != null){
            if(base.x?.color != null && base.x.color !== state.secondary.x.baseColor){
                state.secondary.x.baseColor = base.x.color;
                changeX = true;
            }
            if(base.x?.opacity != null && base.x.opacity !== state.secondary.x.baseOpacity){
                state.secondary.x.baseOpacity = base.x.opacity<0?0:(base.x.opacity>1?1:base.x.opacity);
                changeX = true;
            }
            if(base.x?.width != null && base.x.width !== state.secondary.x.baseWidth){
                state.secondary.x.baseWidth = base.x.width;
                changeX = true;
            }
        }
        
        if(state.secondary.y != null){
            if(base.y?.color != null && base.y.color !== state.secondary.y.baseColor){
                state.secondary.y.baseColor = base.y.color;
                changeY = true;
            }
            if(base.y?.opacity != null && base.y.opacity !== state.secondary.y.baseOpacity){
                state.secondary.y.baseOpacity = base.y.opacity<0?0:(base.y.opacity>1?1:base.y.opacity);
                changeY = true;
            }
            if(base.y?.width != null && base.y.width !== state.secondary.y.baseWidth){
                state.secondary.y.baseWidth = base.y.width;
                changeY = true;
            }
        }

        if(changeX || changeY)
            state.draw.client();
        
        return graphHandler;
    
    }
}

//---------------------------------------------
//----------------- Ticks ---------------------

function secondaryAxisTicks(ticks : RecursivePartial<Ticks_Props>) : Graph2D;
function secondaryAxisTicks(arg : void) : Partial<Ticks_Props>;
function secondaryAxisTicks(ticks : RecursivePartial<Ticks_Props> | void) : Graph2D | Partial<Ticks_Props> | undefined{
    if(typeof ticks === "undefined"){
        const axisTicks : Partial<Ticks_Props> = {};

        if(state.secondary.x != null){
            axisTicks.x = {
                color : state.secondary.x.tickColor,
                minSpacing : state.secondary.x.minSpacing,
                opacity : state.secondary.x.tickOpacity,
                size : state.secondary.x.tickSize,
                ticks : state.secondary.x.ticks,
                width : state.secondary.x.tickWidth
            }
        }
        if(state.secondary.y != null){
            axisTicks.y = {
                color : state.secondary.y.tickColor,
                minSpacing : state.secondary.y.minSpacing,
                opacity : state.secondary.y.tickOpacity,
                size : state.secondary.y.tickSize,
                ticks : state.secondary.y.ticks,
                width : state.secondary.y.tickWidth
            }
        }
        
        return axisTicks;
    }

    if(typeof ticks === "object"){
        if(ticks.x == null && ticks.y == null) return graphHandler;
        if(state.secondary.x == null && state.secondary.y == null) return graphHandler;

        let changeX = false;
        let changeY = false;

        if(state.secondary.x != null){
            if(ticks.x?.color != null && ticks.x.color !== state.secondary.x.tickColor){
                state.secondary.x.tickColor = ticks.x.color;
                changeX = true;
            }
            if(ticks.x?.opacity != null && ticks.x.opacity !== state.secondary.x.tickOpacity){
                state.secondary.x.tickOpacity = ticks.x.opacity<0?0:(ticks.x.opacity>1?1:ticks.x.opacity);
                changeX = true;
            }
            if(ticks.x?.width != null && ticks.x.width !== state.secondary.x.tickWidth){
                state.secondary.x.tickWidth = ticks.x.width;
                changeX = true;
            }
            if(ticks.x?.minSpacing != null && ticks.x.minSpacing !== state.secondary.x.minSpacing){
                state.secondary.x.minSpacing = ticks.x.minSpacing;
                changeX = true;
            }
            if(ticks.x?.ticks != null && ticks.x.ticks !== state.secondary.x.ticks){
                state.secondary.x.ticks = ticks.x.ticks as "auto"|number|number[];
                changeX = true;
            }
            if(ticks.x?.size != null && ticks.x.size !== state.secondary.x.tickSize){
                state.secondary.x.tickSize = ticks.x.size;
                changeX = true;
            }
        }
        
        if(state.secondary.y != null){
            if(ticks.y?.color != null && ticks.y.color !== state.secondary.y.tickColor){
                state.secondary.y.tickColor = ticks.y.color;
                changeY = true;
            }
            if(ticks.y?.opacity != null && ticks.y.opacity !== state.secondary.y.tickOpacity){
                state.secondary.y.tickOpacity = ticks.y.opacity<0?0:(ticks.y.opacity>1?1:ticks.y.opacity);
                changeY = true;
            }
            if(ticks.y?.width != null && ticks.y.width !== state.secondary.y.tickWidth){
                state.secondary.y.tickWidth = ticks.y.width;
                changeY = true;
            }
            if(ticks.y?.minSpacing != null && ticks.y.minSpacing !== state.secondary.y.minSpacing){
                state.secondary.y.minSpacing = ticks.y.minSpacing;
                changeY = true;
            }
            if(ticks.y?.ticks != null && ticks.y.ticks !== state.secondary.y.ticks){
                state.secondary.y.ticks = ticks.y.ticks as "auto"|number|number[];
                changeY = true;
            }
            if(ticks.y?.size != null && ticks.y.size !== state.secondary.y.tickSize){
                state.secondary.y.tickSize = ticks.y.size;
                changeY = true;
            }
        }

        if(changeX || changeY){
            state.compute.client();
            state.draw.client();
        }
        
        return graphHandler;
    
    }
}

//---------------------------------------------
//------------------ Text ---------------------

function secondaryAxisText(text : RecursivePartial<Text_Props>) : Graph2D;
function secondaryAxisText(arg : void) : Partial<Text_Props>;
function secondaryAxisText(text : RecursivePartial<Text_Props> | void) : Graph2D | Partial<Text_Props> | undefined{
    if(typeof text === "undefined"){
        const axisText : Partial<Text_Props> = {};

        if(state.secondary.x != null){
            axisText.x = {
                color : state.secondary.x.textColor,
                font : state.secondary.x.textFont,
                opacity : state.secondary.x.textOpacity,
                size : state.secondary.x.textSize
            }
        }
        if(state.secondary.y != null){
            axisText.y = {
                color : state.secondary.y.textColor,
                font : state.secondary.y.textFont,
                opacity : state.secondary.y.textOpacity,
                size : state.secondary.y.textSize
            }
        }
        
        return axisText;
    }

    if(typeof text === "object"){
        if(text.x == null && text.y == null) return graphHandler;
        if(state.secondary.x == null && state.secondary.y == null) return graphHandler;

        let changeX = false;
        let changeY = false;

        if(state.secondary.x != null){
            if(text.x?.color != null && text.x.color !== state.secondary.x.textColor){
                state.secondary.x.textColor = text.x.color;
                changeX = true;
            }
            if(text.x?.opacity != null && text.x.opacity !== state.secondary.x.textOpacity){
                state.secondary.x.textOpacity = text.x.opacity<0?0:(text.x.opacity>1?1:text.x.opacity);
                changeX = true;
            }
            if(text.x?.size != null && text.x.size !== state.secondary.x.textSize){
                state.secondary.x.textSize = text.x.size;
                changeX = true;
            }
            if(text.x?.font != null && text.x.font !== state.secondary.x.textFont){
                state.secondary.x.textFont = text.x.font;
                changeX = true;
            }
        }

        if(state.secondary.y != null){
            if(text.y?.color != null && text.y.color !== state.secondary.y.textColor){
                state.secondary.y.textColor = text.y.color;
                changeY = true;
            }
            if(text.y?.opacity != null && text.y.opacity !== state.secondary.y.textOpacity){
                state.secondary.y.textOpacity = text.y.opacity<0?0:(text.y.opacity>1?1:text.y.opacity);
                changeY = true;
            }
            if(text.y?.size != null && text.y.size !== state.secondary.y.textSize){
                state.secondary.y.textSize = text.y.size;
                changeY = true;
            }
            if(text.y?.font != null && text.y.font !== state.secondary.y.textFont){
                state.secondary.y.textFont = text.y.font;
                changeY = true;
            }
        }
        
        
        if(changeX || changeY){
            state.compute.client();
            state.draw.client();
        }
        
        return graphHandler;
    
    }
}

//---------------------------------------------










    return {
        compute,
        draw,
        secondaryAxisEnable,
        secondaryAxisDomain,
        secondaryAxisColor,
        secondaryAxisOpacity,
        secondaryAxisUnits,
        secondaryAxisBase,
        secondaryAxisTicks,
        secondaryAxisText,
        secondaryAxisType
    }

}

export default Secondary;