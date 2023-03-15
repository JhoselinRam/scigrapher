import { Colorbar, Colorbar_Callback, Colorbar_Floating, Colorbar_Line, Colorbar_Marker, Colorbar_Method_Generator, Colorbar_Position} from "../../Colorbar_Types";
import { Colorbar_Object_Generator, Colorbar_Properties_Methods, Colorbar_Property_Generator, Colorbar_Property_Options } from "./Properties_Colorbar_Types";

function ColorbarProperties(props:Colorbar_Method_Generator) : Colorbar_Properties_Methods{

//------------ Generated Methods --------------

    const enable = generateStaticMethod<boolean>("enable", props);
    const reverse = generateStaticMethod<boolean>("reverse", props);
    const unit = generateStaticMethod<string>("unit", props);
    const position = generateStaticMethod<Colorbar_Position>("position", props);
    const size = generateStaticMethod<number>("size", props);
    const opacity = generateStaticMethod<number>("opacity", props);
    const width = generateStaticMethod<number>("width", props);

    const border = generateDynamicMethod<Colorbar_Line>(props.barState.border, props);
    const floating = generateDynamicMethod<Colorbar_Floating>(props.barState.floating, props);
    const ticks = generateDynamicMethod<Colorbar_Marker>(props.barState.ticks, props);

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
        floating,
        ticks
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

function generateDynamicMethod<T>(container:T ,{barHandler, barState, graphHandler, state}:Colorbar_Method_Generator) : Colorbar_Object_Generator<T> {

    function method(property:Partial<T>, callback?:Colorbar_Callback) : Colorbar;
    function method(arg:void) : T;
    function method(property:Partial<T> | void, callback?:Colorbar_Callback) : Colorbar | T | undefined {
        if(typeof property === "undefined" && callback==null)
            return {...container};

        if(typeof property !== "undefined"){
            if(Object.keys(property).length === 0) return barHandler;

            container = {...container, ...property};
            if(callback != null) callback(barHandler, graphHandler, state.data.map(item=>item.dataset));
            state.dirty.data = true;

            return barHandler;
        }
    }

    return method;

}

//---------------------------------------------
