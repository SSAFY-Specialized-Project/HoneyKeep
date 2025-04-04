import { create } from "zustand";

interface Props {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  modalProps: {
    icon?: string;
    title: string;
    itemName: string;
    description: string;
    buttonText: string;
    onClose: (e: React.MouseEvent) => void;
    onConfirm: (e: React.MouseEvent) => void;
  } | null;
  openModal: (props:Props['modalProps']) => void;
  closeModal: () => void;
}

const useBasicModalStore = create<Props>(((set) => ({
  isOpen: false,
  modalProps: null,
  setIsOpen: (isOpen: boolean) => set({ isOpen}),
  openModal: (props) => set({isOpen: true, modalProps: props}),
  closeModal: () => set({isOpen: false, modalProps: null})
})));

export default useBasicModalStore;