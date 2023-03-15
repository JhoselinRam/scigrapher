import { Colorbar, Colorbar_Callback, Colorbar_Text, Colorbar_Title } from "../../Colorbar_Types"

export interface ColorBar_Text_Methods {
    text : {
        (text:Partial<Colorbar_Text>, callback?:Colorbar_Callback):Colorbar,
        (arg:void):{label:Colorbar_Text, title:Colorbar_Text}
    },
    title : Colorbar_Text_Generated<Colorbar_Title>,
    label : Colorbar_Text_Generated<Colorbar_Text>
}

export type Colorbar_Text_Generated<T> = {
    (text:Partial<T>, callback?:Colorbar_Callback) : Colorbar,
    (arg:void) : T
}