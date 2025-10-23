import { create } from "zustand";

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  setLocation: (lat: number, lng: number) => void;
}

export const useLocationStore = create<LocationState>((set) => ({
  latitude: 37.501274,
  longitude: 127.039585,
  setLocation: (lat, lng) => set({ latitude: lat, longitude: lng }),
}));
