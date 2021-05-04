import { cardsDb } from "../../../../data";

export const stringToCards = (source) => {
    if (!source) return [];

    return source
        .split(",")
        .map((cardId) => ({ ...cardsDb[cardId], id: cardId }));
};

export const moveCard = (cardId, source, destination) => {
    return [
        [...source.filter((c) => c.id !== cardId).map(({ id }) => id)],
        [...destination.map(({ id }) => id), cardId],
    ];
};
