import { create } from "zustand";

interface ProfileState {
  nickname: string;
  mainCharacterId: number;
  mainCharacterImageUrl: string;
  notificationTimeEnable: boolean;
  notificationTime: string;
  socialLoginType: string;
}

interface ProfileActions {
  setProfile: (profile: ProfileState) => void;
  resetProfile: () => void;
}

type ProfileStore = ProfileState & ProfileActions;

const initialState: ProfileState = {
  nickname: "",
  mainCharacterId: 1,
  mainCharacterImageUrl: "",
  notificationTimeEnable: true,
  notificationTime: "09:00:00",
  socialLoginType: ""
};

const useProfileStore = create<ProfileStore>((set) => ({
  ...initialState,
  setProfile: (profile) => set(profile),
  resetProfile: () => set(initialState)
}));

export default useProfileStore;