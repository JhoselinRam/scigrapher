import { Colorbar, Colorbar_Callback, Colorbar_Method_Generator, Colorbar_Text, Colorbar_Title } from "../../Colorbar_Types";
import { Colorbar_Text_Generated, ColorBar_Text_Methods } from "./Text_Colorbar_Types";

function ColorbarText({barHandler, barState, graphHandler, state} : Colorbar_Method_Generator): ColorBar_Text_Methods{


//------------- Title & Label -----------------

const label = generateTextMethod<Colorbar_Text>(barState.label, {barHandler, barState, graphHandler, state});
const title = generateTextMethod<Colorbar_Title>(barState.title, {barHandler, barState, graphHandler, state});

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
                    filled : barState.title.filled,
                    position : barState.title.position
                }
            }
        }

        if(typeof text === "object"){
            if(text.color==null && text.filled==null && text.font==null && text.opacity==null && text.position==null && text.size==null) return barHandler;

            barState.label = {...barState.label, ...text};
            barState.title = {...barState.title, ...text};

            state.compute.client();
            if(callback != null) callback(barHandler, graphHandler, state.data.map(item=>item.dataset));
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

function generateTextMethod<T>(container:T, {barHandler, barState, graphHandler, state}:Colorbar_Method_Generator) : Colorbar_Text_Generated<T>{

    function method(text:Partial<T>, callback?:Colorbar_Callback) : Colorbar;
    function method(arg:void) : T;
    function method(text:Partial<T> | void, callback?:Colorbar_Callback) : Colorbar | T | undefined{
        if(typeof text === "undefined" && callback==null)
            return {...container}

        if(typeof text === "object"){
            container = {...container, ...text};

            state.compute.client();
            if(callback != null) callback(barHandler, graphHandler, state.data.map(item=>item.dataset));
            state.dirty.client = true;

            return barHandler;
        }
    }



    return method;
}

//---------------------------------------------