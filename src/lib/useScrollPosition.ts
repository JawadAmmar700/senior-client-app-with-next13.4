import { useEffect, useState } from "react";

const useScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = useState<number>(0);

  useEffect(() => {
    setScrollPosition(window.pageYOffset);
    function handleScroll() {
      const position = window.pageYOffset;
      setScrollPosition(position);
    }

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return scrollPosition;
};

export default useScrollPosition;
