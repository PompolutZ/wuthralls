import create from "zustand";

const initialPlayerState = {
    activationsLeft: 0,
    faction: "",
    gloryScored: 0,
    glorySpent: 0,
    name: "",
    oDeck: "",
    pDeck: "",
};

export const useMyGameState = create((set) => ({
    ...initialPlayerState,
    setActivationsLeft: (value) => set((state) => ({ activationsLeft: value })),
}));

export const useTheirGameState = create(() => ({
    ...initialPlayerState,
}));
