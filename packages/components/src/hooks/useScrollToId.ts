import { useCallback } from "react";

export const useScrollToId = (id: string) => {
  const scroll = useCallback(() => {
    const petitionSection = document.getElementById(id);
    petitionSection?.scrollIntoView({ behavior: "smooth" });
  }, [id]);
  return scroll;
};
