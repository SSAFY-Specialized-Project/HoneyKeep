import { useLocation } from "react-router";
import usePocketCreateStore from "../store/usePocketCreateStore";
import { useEffect } from "react";

const useResetCreateOnExit = (targetPaths: string[]) => {
  const location = useLocation();
  const resetBudget = usePocketCreateStore(state => state.resetBudget);

  useEffect(() => {

    const currentPath = location.pathname;

    return () => {

      const isTargetPath = targetPaths.some(path => currentPath.startsWith(path));

      if(isTargetPath){
        resetBudget();
      }

    }

  },[location.pathname, resetBudget])
}

export default useResetCreateOnExit;