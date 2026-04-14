import { useState, useMemo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Collapse from "@mui/material/Collapse";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import ChipSelector from "../ChipSelector.jsx";
import TenseToggle from "../TenseToggle.jsx";
import GenderToggle from "../GenderToggle.jsx";
import ResultCard from "../ResultCard.jsx";
import { builderSubjects } from "../../constants/subjects.js";
import subjects from "../../constants/subjects.js";
import verbs from "../../data/verbs.json";
import questionWords from "../../data/questionWords.json";
import questionPresets from "../../data/questionPresets.json";
import conjugate from "../../utils/conjugate.js";
import { buildEnglishQuestion } from "../../utils/englishSentence.js";
import { expandQuestionPreset } from "../../utils/expandPreset.js";

const expandedQuestionPresets = questionPresets.map((preset) =>
  expandQuestionPreset({ preset }),
);

const verbCategories = [...new Set(verbs.map(({ category }) => category))];

const subjectNeedsGender = ({ subjectId }) => ["ya", "ty"].includes(subjectId);

const defaultGenderForSubject = ({ subjectId }) =>
  subjectId === "ty" ? "feminine" : "masculine";

const matchesQuery = ({ query, haystack }) =>
  !query ||
  haystack.some((field) => field.toLowerCase().includes(query.toLowerCase()));

const QuestionsTab = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedQuestionWordIndex, setSelectedQuestionWordIndex] =
    useState(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [selectedGender, setSelectedGender] = useState("masculine");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedVerbId, setSelectedVerbId] = useState(null);
  const [selectedTense, setSelectedTense] = useState("present");

  const trimmedQuery = searchQuery.trim();

  const filteredQuestionWords = useMemo(
    () =>
      questionWords
        .map((questionWord, index) => ({ ...questionWord, index }))
        .filter(({ ukrainian, english, transliteration }) =>
          matchesQuery({
            query: trimmedQuery,
            haystack: [ukrainian, english, transliteration],
          }),
        ),
    [trimmedQuery],
  );

  const filteredVerbs = useMemo(
    () =>
      verbs
        .filter(
          ({ category }) => !selectedCategory || category === selectedCategory,
        )
        .filter(({ infinitive, english, transliteration }) =>
          matchesQuery({
            query: trimmedQuery,
            haystack: [infinitive, english, transliteration],
          }),
        ),
    [selectedCategory, trimmedQuery],
  );

  const matchingPresets = useMemo(() => {
    if (!trimmedQuery) {
      return [];
    }
    return expandedQuestionPresets.filter(({ english, ukrainian }) =>
      matchesQuery({ query: trimmedQuery, haystack: [english, ukrainian] }),
    );
  }, [trimmedQuery]);

  const applyPreset = ({ preset }) => {
    setSelectedQuestionWordIndex(preset.questionWordIndex);
    setSelectedSubjectId(preset.subjectId);
    setSelectedGender(preset.gender);
    setSelectedCategory(null);
    setSelectedVerbId(preset.verbId);
    setSelectedTense(preset.tense);
  };

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

  const effectiveGender = useMemo(() => {
    if (!selectedSubjectId) {
      return selectedGender;
    }
    if (subjectNeedsGender({ subjectId: selectedSubjectId })) {
      return selectedGender;
    }
    return selectedSubject?.gender ?? "masculine";
  }, [selectedSubjectId, selectedGender, selectedSubject]);

  const conjugatedForm = useMemo(() => {
    if (!selectedVerb || !selectedSubjectId) {
      return null;
    }
    return conjugate({
      verb: selectedVerb,
      subjectId: selectedSubjectId,
      tense: selectedTense,
      gender: effectiveGender,
    });
  }, [selectedVerb, selectedSubjectId, selectedTense, effectiveGender]);

  const ukrainianQuestion =
    conjugatedForm && selectedQuestionWord
      ? `${selectedQuestionWord.ukrainian} ${selectedSubject.label.toLowerCase()} ${conjugatedForm}?`
      : null;

  const englishQuestion =
    conjugatedForm && selectedQuestionWord
      ? buildEnglishQuestion({
          questionWord: selectedQuestionWord,
          subject: selectedSubject,
          verb: selectedVerb,
          tense: selectedTense,
        })
      : null;

  const placeholderHint = !selectedQuestionWord
    ? "Start by choosing a question word"
    : !selectedSubjectId
      ? "Now pick a subject"
      : !selectedVerbId
        ? "Now pick a verb"
        : null;

  return (
    <Box sx={{ p: 2 }}>
      <Typography
        variant="h6"
        sx={{ mb: 2, fontWeight: 700, color: "primary.main" }}
      >
        Question
      </Typography>

      <TextField
        fullWidth
        size="small"
        placeholder="Type in English to search (e.g. what, to eat, why)"
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
        sx={{ mb: 2 }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />

      {trimmedQuery && matchingPresets.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="caption"
            sx={{
              mb: 0.5,
              display: "block",
              color: "text.secondary",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            Quick Questions ({matchingPresets.length})
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
              pb: 0.5,
            }}
          >
            {matchingPresets.map((preset) => (
              <Chip
                key={preset.id}
                label={preset.english}
                onClick={() => applyPreset({ preset })}
                color="primary"
                variant="filled"
                sx={{
                  fontWeight: 500,
                  color: "white",
                  "&:hover": { backgroundColor: "primary.dark" },
                }}
              />
            ))}
          </Box>
        </Box>
      )}

      {trimmedQuery &&
        matchingPresets.length === 0 &&
        filteredQuestionWords.length === 0 &&
        filteredVerbs.length === 0 && (
          <Box
            sx={{
              mb: 2,
              p: 2,
              bgcolor: "action.hover",
              borderRadius: 1,
              textAlign: "center",
            }}
          >
            <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
              No matches for &ldquo;{trimmedQuery}&rdquo;
            </Typography>
            <Typography variant="caption" sx={{ color: "text.disabled" }}>
              Try: what, where, when, why, eat, live, work, go
            </Typography>
          </Box>
        )}

      <ChipSelector
        label={`Question Word${trimmedQuery ? ` (${filteredQuestionWords.length} match)` : ""}`}
        items={filteredQuestionWords.map(({ index, ukrainian, english }) => ({
          id: index,
          label: `${ukrainian} (${english})`,
        }))}
        selectedId={selectedQuestionWordIndex}
        onSelect={setSelectedQuestionWordIndex}
      />

      <Collapse in={selectedQuestionWordIndex !== null}>
        <ChipSelector
          label="Subject"
          items={builderSubjects.map(({ id, label, english }) => ({
            id,
            label: `${label} (${english})`,
          }))}
          selectedId={selectedSubjectId}
          onSelect={(id) => {
            setSelectedSubjectId(id);
            if (subjectNeedsGender({ subjectId: id })) {
              setSelectedGender(defaultGenderForSubject({ subjectId: id }));
            }
          }}
        />
      </Collapse>

      <Collapse
        in={
          selectedSubjectId !== null &&
          subjectNeedsGender({ subjectId: selectedSubjectId })
        }
      >
        {selectedSubjectId &&
          subjectNeedsGender({ subjectId: selectedSubjectId }) && (
            <GenderToggle
              selectedGender={selectedGender}
              onGenderChange={setSelectedGender}
            />
          )}
      </Collapse>

      <Collapse in={selectedSubjectId !== null}>
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
          label={`Verb${trimmedQuery ? ` (${filteredVerbs.length} match)` : ""}`}
          items={filteredVerbs.map(({ id, infinitive, english }) => ({
            id,
            label: `${infinitive} (${english})`,
          }))}
          selectedId={selectedVerbId}
          onSelect={setSelectedVerbId}
        />
      </Collapse>

      <Collapse in={selectedVerbId !== null}>
        <TenseToggle
          selectedTense={selectedTense}
          onTenseChange={setSelectedTense}
        />
      </Collapse>

      {placeholderHint && (
        <Typography
          variant="body2"
          sx={{
            color: "text.disabled",
            fontStyle: "italic",
            textAlign: "center",
            py: 3,
          }}
        >
          {placeholderHint}
        </Typography>
      )}

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
