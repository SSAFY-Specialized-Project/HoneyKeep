import { create } from 'zustand';

interface Props {
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
  setClose: () => void;
}

const useNoticeModalStore = create<Props>((set) => ({
  isOpen: false,
  setOpen: (isOpen) => set({ isOpen }),
  setClose: () => set({ isOpen: false }),
}));

export default useNoticeModalStore;
