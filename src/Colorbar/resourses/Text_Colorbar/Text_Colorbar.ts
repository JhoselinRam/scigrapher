import { Colorbar, Colorbar_Callback, Colorbar_Method_Generator, Colorbar_Text, Colorbar_Title } from "../../Colorbar_Types";
import { Colorbar_Text_Generated, ColorBar_Text_Methods, Colorbar_Text_Option } from "./Text_Colorbar_Types";

function ColorbarText({barHandler, barState, graphHandler, state} : Colorbar_Method_Generator): ColorBar_Text_Methods{


//------------- Title & Label -----------------

const label = generateTextMethod<Colorbar_Text>("label", {barHandler, barState, graphHandler, state});
const title = generateTextMethod<Colorbar_Title>("title", {barHandler, barState, graphHandler, state});

//---------------------------------------------
//----------------- Text ----------------------

    function text(text:Partial<Colorbar_Text>, callback?:Colorbar_Callback):Colorbar;
    function text(arg:void):{label:Colorbar_Text, title:Colorbar_Text};
    function text(text:Partial<Colorbar_Text> | void, callback?:Colorbar_Callback) : Colorbar | {label:Colorbar_Text, title:Colorbar_Text} | undefined{
        if(typeof text === "undefined" && callback==null){
            return {
                label : {...barState.label},
                title : {
                    color : barState.title.color,
                    opacity : barState.title.opacity,
                    size : barState.title.size,
                    font : barState.title.font,
                    position : barState.title.position,
                    specifier : barState.title.specifier
                }
            }
        }

        if(typeof text === "object"){
            if(Object.keys(text).length === 0) return barHandler;

            barState.label = {...barState.label, ...text};
            barState.title = {...barState.title, ...text};

            state.compute.client();
            if(callback != null) callback(barHandler, graphHandler);
            state.dirty.client = true;

            return barHandler;
        }
    }

//---------------------------------------------

    return {
        label,
        text, 
        title
    }
}

export default ColorbarText;














//---------------- Generator ------------------

function generateTextMethod<T>(option:Colorbar_Text_Option, {barHandler, barState, graphHandler, state}:Colorbar_Method_Generator) : Colorbar_Text_Generated<T>{

    function method(text:Partial<T>, callback?:Colorbar_Callback) : Colorbar;
    function method(arg:void) : T;
    function method(text:Partial<T> | void, callback?:Colorbar_Callback) : Colorbar | T | undefined{
        if(typeof text === "undefined" && callback==null)
            return {...barState[option] as T}

        if(typeof text === "object"){
            (barState[option] as T) = {...barState[option] as T, ...text};

            state.compute.client();
            if(callback != null) callback(barHandler, graphHandler);
            state.dirty.client = true;

            return barHandler;
        }
    }



    return method;
}

//---------------------------------------------