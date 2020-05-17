import seedrandom from "seedrandom";
const rng = seedrandom(
    "7v1IePLKA7oRefKddVznOklLczjSIDdaMeE0SUx7WPKAi8GUbAgDGfvgjswt",
    { entropy: true }
);

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
