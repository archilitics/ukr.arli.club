const needsThirdPersonSingularS = ({ subjectId }) =>
  ["vin", "vona"].includes(subjectId);

const conjugateEnglishPresent = ({ base, subjectId }) => {
  if (!needsThirdPersonSingularS({ subjectId })) {
    return base;
  }
  if (/(sh|ch|ss|x|z|o)$/.test(base)) {
    return `${base}es`;
  }
  if (/[^aeiou]y$/.test(base)) {
    return `${base.slice(0, -1)}ies`;
  }
  return `${base}s`;
};

const buildEnglishSentence = ({ subject, verb, tense, complement }) => {
  const base = verb.english.replace(/^to /, "");
  const mainVerb =
    tense === "future"
      ? `will ${base}`
      : tense === "past"
        ? base
        : conjugateEnglishPresent({ base, subjectId: subject.id });
  const complementText = complement ? ` ${complement.english}` : "";
  return `${subject.english} ${mainVerb}${complementText}`;
};

const buildEnglishQuestion = ({ questionWord, subject, verb, tense }) => {
  const base = verb.english.replace(/^to /, "");
  const subjectLower = subject.english.toLowerCase();
  const auxiliary =
    tense === "past"
      ? "did"
      : tense === "future"
        ? "will"
        : needsThirdPersonSingularS({ subjectId: subject.id })
          ? "does"
          : "do";
  return `${questionWord.english} ${auxiliary} ${subjectLower} ${base}?`;
};

export { buildEnglishSentence, buildEnglishQuestion };
