import subjects from "../constants/subjects.js";

const conjugate = ({ verb, subjectId, tense }) => {
  const tenseConjugations = verb.conjugations[tense];
  if (!tenseConjugations) {
    return null;
  }

  if (tense === "past") {
    const subject = subjects.find(({ id }) => id === subjectId);
    const pastKey =
      subject?.gender === "masculine" || subject?.gender === null
        ? `${subjectId}_masc`
        : `${subjectId}_fem`;
    return tenseConjugations[pastKey] ?? tenseConjugations[subjectId] ?? null;
  }

  return tenseConjugations[subjectId] ?? null;
};

export default conjugate;
