import CreateAxis from "../../../tools/Axis_Obj/Axis_Obj.js";
import { Axis_Obj } from "../../../tools/Axis_Obj/Axis_Obj_Types";
import { Axis_Property, Graph2D, Method_Generator, RecursivePartial, Secondary_Axis } from "../../Graph2D_Types";
import { Domain_Props } from "../Axis/Axis_Types.js";
import { Secondary } from "./Secondary_Types";

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
        
        if(domain.x != null && state.secondary.x == null){
            state.secondary.x = {
                ...defaultSecondaryAxis,
                ...domain.x
            };    
            changeX = true;
        }
        if(domain.y != null && state.secondary.y == null){
            state.secondary.y = {
                ...defaultSecondaryAxis,
                ...domain.y
            };
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










    return {
        compute,
        draw,
        secondaryAxisEnable,
        secondaryAxisDomain
    }

}

export default Secondary;