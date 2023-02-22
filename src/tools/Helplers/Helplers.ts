//------------- Get Line Dash -----------------
export function getLineDash(style : string) : Array<number> {
    let lineDash : Array<number> = [] //style = "solid";

    switch(style){
        case "dot":
            lineDash = [2, 3];
            break;
        
        case "dash":
            lineDash = [5, 3];
            break;
        
        case "long-dash":
            lineDash = [8, 3];
            break;

        case "dash-dot":
            lineDash = [5, 3, 2, 3];
            break;

        case "dash-2dot":
            lineDash = [6, 3, 2, 3, 2, 3];
            break;
        
        default:
            lineDash = style.split(" ").map(item=>parseInt(item));
            break;
    }

    return lineDash;
}
//---------------------------------------------