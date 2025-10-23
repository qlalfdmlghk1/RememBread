import { create } from "zustand";
import { indexCard } from "@/types/indexCard";
import { createEmptyCard } from "@/utils/createEmptyCard";

interface CardStore {
  cardSet: indexCard[];
  setCardSet: (cards: indexCard[]) => void;
  appendCard: (card: indexCard) => void;
  resetCardSet: () => void;
  clearCardSet: () => void;
}

export const useCardStore = create<CardStore>((set) => ({
  cardSet: [],
  setCardSet: (cards) => set({ cardSet: cards }),
  appendCard: (card) =>
    set((state) => {
      const newCard = createEmptyCard();
      newCard.concept = card.concept;
      newCard.description = card.description;
      return {
        cardSet: [...state.cardSet, newCard],
      };
    }),
  resetCardSet: () => set({ cardSet: [] }),
  clearCardSet: () => set({ cardSet: [] }),
}));
