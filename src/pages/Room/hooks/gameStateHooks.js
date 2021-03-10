import create from "zustand";

export const useGameRound = create((set) => ({
    round: 0,
    setRound: (value) => set(() => ({ round: value })),
}));

export const useRoomInfo = create(() => ({
    roomId: "",
    players: [],
}));

export const useFightersInfo = create(() => ({}));
