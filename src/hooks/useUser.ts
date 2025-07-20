import { create } from 'zustand';

type UserStore = {
  fullName: string;
  setFullName: (name: string) => void;
};

const useUser = create<UserStore>((set) => ({
  fullName: '',
  setFullName: (name) => set({ fullName: name }),
}));

export default useUser;
