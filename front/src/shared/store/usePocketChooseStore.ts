import { create } from "zustand";

interface Props {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  pocketId: number;
  pocketName: string;
  setPocketId: (id: number) => void;
  setPocketName: (name: string) => void;
  modalProps: {
    accountId: number;
  } | null;
  openModal: (props: Props["modalProps"]) => void;
  closeModal: () => void;
}

const usePocketChooseStore = create<Props>(((set) => ({
  isOpen: false,
  modalProps: null,
  pocketId: 0,
  pocketName: "",
  setPocketId: (id) => set({pocketId: id}),
  setPocketName: (name) => set({pocketName: name}), 
  setIsOpen: (isOpen: boolean) => set({isOpen}),
  openModal: (props) => set({isOpen: true, modalProps: props}),
  closeModal: () => set({isOpen: false, modalProps: null})
})));

export default usePocketChooseStore;