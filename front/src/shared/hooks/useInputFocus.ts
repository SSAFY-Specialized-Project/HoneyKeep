import { useEffect, useRef, useState } from "react";

const useInputFocus = () => {
  const [isActive, setIsActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const inputElement = inputRef.current;

    if(!inputElement) return;

    const handleFocus = () => {
      if (isActive) return;
      setIsActive(true);
    };

    const handleBlur = () => {
      if (inputElement.value.length > 0 || !isActive) return;
      setIsActive(false);
    };

    if (inputElement) {
      inputElement.addEventListener("focus", handleFocus);
      inputElement.addEventListener("blur", handleBlur);
    }

    return () => {
      if (inputElement) {
        inputElement.removeEventListener("focus", handleFocus);
        inputElement.removeEventListener("blur", handleBlur);
      }
    };
  });

  return {isActive, inputRef}
}

export default useInputFocus;