import subjects from "../constants/subjects.js";
import verbs from "../data/verbs.json";
import complements from "../data/complements.json";
import questionWords from "../data/questionWords.json";
import conjugate from "./conjugate.js";
import {
  buildEnglishSentence,
  buildEnglishQuestion,
} from "./englishSentence.js";

const resolveGender = ({ subjectId, overrideGender }) => {
  if (overrideGender) {
    return overrideGender;
  }
  if (subjectId === "ty") {
    return "feminine";
  }
  return "masculine";
};

const expandSentencePreset = ({ preset }) => {
  const subject = subjects.find(({ id }) => id === preset.subjectId);
  const verb = verbs.find(({ id }) => id === preset.verbId);
  const complement = preset.complementId
    ? (complements.find(({ id }) => id === preset.complementId) ?? null)
    : null;
  const gender = resolveGender({
    subjectId: preset.subjectId,
    overrideGender: preset.gender,
  });
  const conjugated = conjugate({
    verb,
    subjectId: preset.subjectId,
    tense: preset.tense,
    gender,
  });
  const ukrainian = `${subject.label} ${conjugated}${complement ? ` ${complement.ukrainian}` : ""}`;
  const english = buildEnglishSentence({
    subject,
    verb,
    tense: preset.tense,
    complement,
  });
  return { ...preset, subject, verb, complement, gender, ukrainian, english };
};

const expandQuestionPreset = ({ preset }) => {
  const questionWord = questionWords[preset.questionWordIndex];
  const subject = subjects.find(({ id }) => id === preset.subjectId);
  const verb = verbs.find(({ id }) => id === preset.verbId);
  const gender = resolveGender({
    subjectId: preset.subjectId,
    overrideGender: preset.gender,
  });
  const conjugated = conjugate({
    verb,
    subjectId: preset.subjectId,
    tense: preset.tense,
    gender,
  });
  const ukrainian = `${questionWord.ukrainian} ${subject.label.toLowerCase()} ${conjugated}?`;
  const english = buildEnglishQuestion({
    questionWord,
    subject,
    verb,
    tense: preset.tense,
  });
  return { ...preset, questionWord, subject, verb, gender, ukrainian, english };
};

export { expandSentencePreset, expandQuestionPreset };
