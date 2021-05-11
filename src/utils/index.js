import seedrandom from "seedrandom";

const rng = new seedrandom();

export const shuffle = (a) => {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(rng() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
};

export function getDieRollResult() {
    const min = 1;
    const max = 6;
    return Math.floor(rng() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

export const sortByIdAsc = ({ id: prevId }, { id: nextId }) => {
    return prevId.localeCompare(nextId);
};

export function hexToRgb(hex, alpha = 1) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    let red = parseInt(result[1], 16);
    let green = parseInt(result[2], 16);
    let blue = parseInt(result[3], 16);

    return result ? `rgba(${red},${green},${blue},${alpha})` : "";
}
