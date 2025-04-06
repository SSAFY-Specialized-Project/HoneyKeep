import { create } from "zustand";

interface Props {
  isOpen: boolean;
  setIsOpen: (isOpen:boolean) => void;
  modalProps: {
    pocketId: number;
    totalAmount: number;
    gatheredAmount: number;
  } | null;
  openModal: (props: Props["modalProps"]) => void;
  closeModal: () => void;
}

const useGatheringModalStore = create<Props>(((set) => ({
  isOpen: false,
  setIsOpen: (isOpen: boolean) => set({isOpen}),
  openModal: (props) => set({isOpen: true, modalProps: props}),
  closeModal: () => set({isOpen:false, modalProps:null}),
  modalProps: null
})))

export default useGatheringModalStore;