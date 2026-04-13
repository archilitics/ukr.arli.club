import { useCallback } from "react";
import speakUkrainian from "../utils/speechSynthesis.js";

const useSpeech = () => {
  const speak = useCallback(({ text }) => {
    speakUkrainian({ text });
  }, []);

  return { speak };
};

export default useSpeech;
