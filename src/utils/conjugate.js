const conjugate = ({ verb, subjectId, tense, gender }) => {
  const tenseConjugations = verb.conjugations[tense];
  if (!tenseConjugations) {
    return null;
  }

  if (tense === "past") {
    const genderSuffix = gender === "feminine" ? "fem" : "masc";
    const pastKey = `${subjectId}_${genderSuffix}`;
    return tenseConjugations[pastKey] ?? tenseConjugations[subjectId] ?? null;
  }

  return tenseConjugations[subjectId] ?? null;
};

export default conjugate;
