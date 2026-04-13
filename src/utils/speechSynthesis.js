let cachedUkrainianVoice = null;
let voicesLoaded = false;

const findUkrainianVoice = () => {
  const allVoices = window.speechSynthesis.getVoices();
  return allVoices.find(({ lang }) => lang.startsWith("uk")) ?? null;
};

const ensureVoicesLoaded = () =>
  new Promise((resolve) => {
    if (voicesLoaded) {
      resolve();
      return;
    }

    const existingVoice = findUkrainianVoice();
    if (existingVoice) {
      cachedUkrainianVoice = existingVoice;
      voicesLoaded = true;
      resolve();
      return;
    }

    window.speechSynthesis.addEventListener(
      "voiceschanged",
      () => {
        cachedUkrainianVoice = findUkrainianVoice();
        voicesLoaded = true;
        resolve();
      },
      { once: true },
    );
  });

const speakUkrainian = async ({ text }) => {
  try {
    await ensureVoicesLoaded();
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "uk-UA";
    utterance.rate = 0.9;

    if (cachedUkrainianVoice) {
      utterance.voice = cachedUkrainianVoice;
    }

    window.speechSynthesis.speak(utterance);
  } catch {
    // Silent fail if no Ukrainian voice available
  }
};

export default speakUkrainian;
