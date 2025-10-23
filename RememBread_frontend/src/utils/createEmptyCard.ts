import { indexCard } from "@/types/indexCard";

export const createCard = (text: string): indexCard => ({
  concept: text,
  description: "",
});

export const createEmptyCard = (): indexCard => ({
  concept: "",
  description: "",
});
