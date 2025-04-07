import { ReactNode } from "react";
import { create } from "zustand";

interface Props {
  title: string | null;
  content: ReactNode | null;
  setContent: (headerContent: ReactNode) => void;
  setTitle: (textTitle:string) => void;
}

const useHeaderStore = create<Props>(((set) => ({

  title: "",
  content: null,
  setContent: (headerContent) => set({content: headerContent}),
  setTitle: (textTitle) => set({title: textTitle})

})));

export default useHeaderStore;