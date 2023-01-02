import { Graph2D, Graph2D_Options } from "./Graph2D_Types";

const defaultOptios : Graph2D_Options = {
    background : {
        color : "#ffffff",
        opacity : 1
    },
    scale : {
        xStart : -5,
        xEnd : 5,
        yStart : -5,
        yEnd : 5,
        marginStart : 5,
        marginEnd : 5,
        marginTop : 5,
        marginBottom : 5
    }
}

export function Graph2D(container:HTMLDivElement, {...defaultOptios}:Graph2D_Options) : Graph2D{
    console.log(background);

    return {
        
    }
}