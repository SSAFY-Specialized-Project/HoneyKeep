import { create } from "zustand";

interface Props{
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  modalProps: {
    pocketId: number;
    totalAmount: number;
    gatheredAmount: number;
  } | null;
  openModal: (props:Props['modalProps']) => void;
  closeModal: () => void;
}

const usePocketUseModalStore = create<Props>(((set) => ({
  isOpen: false,
  modalProps: null,
  setIsOpen: (isOpen: boolean) => set({isOpen}),
  openModal: (props) => {console.log(" 모달 오픈 !") 
    return set({isOpen: true, modalProps: props});
  },
  closeModal: () => set({isOpen: false, modalProps: null})
})))

export default usePocketUseModalStore;