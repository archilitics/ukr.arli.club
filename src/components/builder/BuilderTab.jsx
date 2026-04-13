import { useState, useMemo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ChipSelector from "../ChipSelector.jsx";
import TenseToggle from "../TenseToggle.jsx";
import ResultCard from "../ResultCard.jsx";
import ConjugationTable from "../ConjugationTable.jsx";
import { builderSubjects } from "../../constants/subjects.js";
import subjects from "../../constants/subjects.js";
import verbs from "../../data/verbs.json";
import conjugate from "../../utils/conjugate.js";

const verbCategories = [...new Set(verbs.map(({ category }) => category))];

const BuilderTab = () => {
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedVerbId, setSelectedVerbId] = useState(null);
  const [selectedTense, setSelectedTense] = useState("present");

  const filteredVerbs = useMemo(
    () =>
      selectedCategory
        ? verbs.filter(({ category }) => category === selectedCategory)
        : verbs,
    [selectedCategory],
  );

  const selectedVerb = useMemo(
    () => verbs.find(({ id }) => id === selectedVerbId) ?? null,
    [selectedVerbId],
  );

  const selectedSubject = useMemo(
    () => subjects.find(({ id }) => id === selectedSubjectId) ?? null,
    [selectedSubjectId],
  );

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

  const ukrainianSentence = conjugatedForm
    ? `${selectedSubject.label} ${conjugatedForm}`
    : null;

  const englishSentence = conjugatedForm
    ? `${selectedSubject.english} ${selectedVerb.english.replace("to ", "")}`
    : null;

  return (
    <Box sx={{ p: 2 }}>
      <Typography
        variant="h6"
        sx={{ mb: 2, fontWeight: 700, color: "primary.main" }}
      >
        Sentence Builder
      </Typography>

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
        label="Category"
        items={verbCategories.map((category) => ({
          id: category,
          label: category,
        }))}
        selectedId={selectedCategory}
        onSelect={(id) => {
          setSelectedCategory(id === selectedCategory ? null : id);
          setSelectedVerbId(null);
        }}
      />

      <ChipSelector
        label="Verb"
        items={filteredVerbs.map(({ id, infinitive, english }) => ({
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

      {ukrainianSentence && (
        <ResultCard
          ukrainianText={ukrainianSentence}
          englishText={englishSentence}
        />
      )}

      {selectedVerb && (
        <ConjugationTable
          verb={selectedVerb}
          activeSubjectId={selectedSubjectId}
          activeTenseId={selectedTense}
        />
      )}
    </Box>
  );
};

export default BuilderTab;
