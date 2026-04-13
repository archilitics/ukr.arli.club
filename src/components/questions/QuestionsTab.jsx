import { useState, useMemo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ChipSelector from "../ChipSelector.jsx";
import TenseToggle from "../TenseToggle.jsx";
import ResultCard from "../ResultCard.jsx";
import { builderSubjects } from "../../constants/subjects.js";
import subjects from "../../constants/subjects.js";
import verbs from "../../data/verbs.json";
import questionWords from "../../data/questionWords.json";
import conjugate from "../../utils/conjugate.js";

const QuestionsTab = () => {
  const [selectedQuestionWordIndex, setSelectedQuestionWordIndex] =
    useState(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [selectedVerbId, setSelectedVerbId] = useState(null);
  const [selectedTense, setSelectedTense] = useState("present");

  const selectedVerb = useMemo(
    () => verbs.find(({ id }) => id === selectedVerbId) ?? null,
    [selectedVerbId],
  );

  const selectedSubject = useMemo(
    () => subjects.find(({ id }) => id === selectedSubjectId) ?? null,
    [selectedSubjectId],
  );

  const selectedQuestionWord =
    selectedQuestionWordIndex !== null
      ? questionWords[selectedQuestionWordIndex]
      : null;

  const conjugatedForm = useMemo(() => {
    if (!selectedVerb || !selectedSubjectId) {
      return null;
    }
    return conjugate({
      verb: selectedVerb,
      subjectId: selectedSubjectId,
      tense: selectedTense,
    });
  }, [selectedVerb, selectedSubjectId, selectedTense]);

  const ukrainianQuestion =
    conjugatedForm && selectedQuestionWord
      ? `${selectedQuestionWord.ukrainian} ${selectedSubject.label.toLowerCase()} ${conjugatedForm}?`
      : null;

  const englishQuestion =
    conjugatedForm && selectedQuestionWord
      ? `${selectedQuestionWord.english} does ${selectedSubject.english.toLowerCase()} ${selectedVerb.english.replace("to ", "")}?`
      : null;

  return (
    <Box sx={{ p: 2 }}>
      <Typography
        variant="h6"
        sx={{ mb: 2, fontWeight: 700, color: "primary.main" }}
      >
        Question Builder
      </Typography>

      <ChipSelector
        label="Question Word"
        items={questionWords.map(({ ukrainian, english }, index) => ({
          id: index,
          label: `${ukrainian} (${english})`,
        }))}
        selectedId={selectedQuestionWordIndex}
        onSelect={setSelectedQuestionWordIndex}
      />

      <ChipSelector
        label="Subject"
        items={builderSubjects.map(({ id, label, english }) => ({
          id,
          label: `${label} (${english})`,
        }))}
        selectedId={selectedSubjectId}
        onSelect={setSelectedSubjectId}
      />

      <ChipSelector
        label="Verb"
        items={verbs.map(({ id, infinitive, english }) => ({
          id,
          label: `${infinitive} (${english})`,
        }))}
        selectedId={selectedVerbId}
        onSelect={setSelectedVerbId}
      />

      <TenseToggle
        selectedTense={selectedTense}
        onTenseChange={setSelectedTense}
      />

      {ukrainianQuestion && (
        <ResultCard
          ukrainianText={ukrainianQuestion}
          englishText={englishQuestion}
        />
      )}
    </Box>
  );
};

export default QuestionsTab;
