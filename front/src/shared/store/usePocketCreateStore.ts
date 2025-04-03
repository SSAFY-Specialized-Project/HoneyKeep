import { create } from "zustand";

interface Props {
  name: string | null;
  totalAmount: number | null;
  isWrote: boolean;
  setName: (pocketName: string) => void;
  setTotalAmount: (amount: number) => void;
  cleanPocketStore: () => void;
}

const usePocketCreateStore = create<Props>(((set,get) => ({
  name: null,
  totalAmount: null,
  isWrote: false,
  setName: (pocketName) => {
    if(get().name != null && get().totalAmount != null ){
      set({isWrote:true});
    }else{
      set({isWrote:false});
    }
    set({name: pocketName});
  },
  setTotalAmount: (amount) => {
    set({totalAmount: amount})
  },
  cleanPocketStore: () => {
    set({
      name: null,
      totalAmount: null,
      isWrote: false,
    })
  }
})));

export default usePocketCreateStore;