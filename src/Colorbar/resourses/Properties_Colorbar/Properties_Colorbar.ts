import { Rect } from "../../../Graph2D/Graph2D_Types";
import { Colorbar, Colorbar_Callback, Colorbar_Line, Colorbar_Marker, Colorbar_Method_Generator, Colorbar_Position} from "../../Colorbar_Types";
import { Colorbar_Object_Generator, Colorbar_Object_Options, Colorbar_Properties_Methods, Colorbar_Property_Generator, Colorbar_Property_Options } from "./Properties_Colorbar_Types";

function ColorbarProperties(props:Colorbar_Method_Generator) : Colorbar_Properties_Methods{

//------------ Generated Methods --------------

    const enable = generateStaticMethod<boolean>("enable", props);
    const reverse = generateStaticMethod<boolean>("reverse", props);
    const unit = generateStaticMethod<string>("unit", props);
    const size = generateStaticMethod<number>("size", props);
    const opacity = generateStaticMethod<number>("opacity", props);
    const width = generateStaticMethod<number>("width", props);

    const border = generateDynamicMethod<Colorbar_Line>(props.barState.border, "border", props);
    const ticks = generateDynamicMethod<Colorbar_Marker>(props.barState.ticks, "ticks", props);

//---------------------------------------------
//-------------- Position ---------------------

    function position(position:Colorbar_Position, callback?:Colorbar_Callback) : Colorbar;
    function position(arg:void) : string;
    function position(position:Colorbar_Position | void, callback?:Colorbar_Callback) : Colorbar | string | undefined{
        if(typeof position === "undefined" && callback == null){
            if(typeof props.barState.position === "string")
                return props.barState.position;
            if(typeof props.barState.position === "object")
                return "floating";
        }
        else{
            if(typeof position === "string")
                props.barState.position = position;
            if(typeof position === "object"){
                if(typeof props.barState.position === "string")
                    props.barState.position = {x:0, y:0, orientation:"vertical"};
                
                props.barState.position = {...props.barState.position, ...position};
            }

            props.state.compute.client();
            if(callback != null) callback(props.barHandler, props.graphHandler, props.state.data.map(item=>item.dataset));
            props.state.dirty.client = true;

            return props.barHandler;
        }
    }


//---------------------------------------------
//--------------- Metrics ---------------------

    function metrics() : Rect{
        return {
            x : props.barState.metrics.position.x - props.state.context.clientRect.x,
            y : props.barState.metrics.position.y - props.state.context.clientRect.y,
            width : props.barState.metrics.width,
            height : props.barState.metrics.height,
        }
    }

//---------------------------------------------

    function id() : string{
        return props.barState.id;
    }

//---------------------------------------------

    return {
        enable,
        opacity,
        position,
        reverse,
        size,
        unit,
        width,
        border,
        ticks,
        id,
        metrics
    }
}

export default ColorbarProperties;








//--------------- Generator -------------------

function generateStaticMethod<T>(option:Colorbar_Property_Options, {barHandler, barState, graphHandler, state}:Colorbar_Method_Generator) : Colorbar_Property_Generator<T> {

    function method(property:T, callback?:Colorbar_Callback) : Colorbar;
    function method(arg:void) : T;
    function method(property:T | void, callback?:Colorbar_Callback) : Colorbar | T | undefined {
        if(typeof property === "undefined" && callback==null)
            return barState[option] as T;

        if(typeof property !== "undefined"){
            if(property === (barState[option] as T)) return barHandler;

            (barState[option] as T) = property;
            state.compute.client();
            if(callback != null) callback(barHandler, graphHandler, state.data.map(item=>item.dataset));
            state.dirty.client = true;

            return barHandler;
        }
    }

    return method;

}

//---------------------------------------------
//---------------------------------------------

function generateDynamicMethod<T>(container:T, option:Colorbar_Object_Options ,{barHandler, barState, graphHandler, state}:Colorbar_Method_Generator) : Colorbar_Object_Generator<T> {

    function method(property:Partial<T>, callback?:Colorbar_Callback) : Colorbar;
    function method(arg:void) : T;
    function method(property:Partial<T> | void, callback?:Colorbar_Callback) : Colorbar | T | undefined {
        if(typeof property === "undefined" && callback==null)
            return {...container};

        if(typeof property !== "undefined"){
            if(Object.keys(property).length === 0) return barHandler;

            (barState[option] as T) = {...container, ...property};
            state.compute.client();
            if(callback != null) callback(barHandler, graphHandler, state.data.map(item=>item.dataset));
            state.dirty.data = true;

            return barHandler;
        }
    }

    return method;

}

//---------------------------------------------
