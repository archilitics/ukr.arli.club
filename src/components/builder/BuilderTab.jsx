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
import ShuffleIcon from "@mui/icons-material/Shuffle";
import ChipSelector from "../ChipSelector.jsx";
import TenseToggle from "../TenseToggle.jsx";
import GenderToggle from "../GenderToggle.jsx";
import ResultCard from "../ResultCard.jsx";
import ConjugationTable from "../ConjugationTable.jsx";
import { builderSubjects } from "../../constants/subjects.js";
import subjects from "../../constants/subjects.js";
import verbs from "../../data/verbs.json";
import complements from "../../data/complements.json";
import sentencePresets from "../../data/sentencePresets.json";
import conjugate from "../../utils/conjugate.js";
import { buildEnglishSentence } from "../../utils/englishSentence.js";
import { expandSentencePreset } from "../../utils/expandPreset.js";
import verbComplementKinds from "../../utils/verbComplementKinds.js";

const expandedSentencePresets = sentencePresets.map((preset) =>
  expandSentencePreset({ preset }),
);

const STARTER_PRESET_IDS = [
  "i-want-coffee",
  "i-want-to-eat",
  "i-go-home",
  "i-speak-ukrainian",
  "i-have-phone",
  "i-love-coffee",
  "i-work-at-home",
  "we-go-to-park",
  "i-rest-at-home",
];

const starterSentencePresets = expandedSentencePresets.filter(({ id }) =>
  STARTER_PRESET_IDS.includes(id),
);

const verbCategories = [...new Set(verbs.map(({ category }) => category))];

const subjectNeedsGender = ({ subjectId }) => ["ya", "ty"].includes(subjectId);

const defaultGenderForSubject = ({ subjectId }) =>
  subjectId === "ty" ? "feminine" : "masculine";

const matchesQuery = ({ query, haystack }) =>
  !query ||
  haystack.some((field) => field.toLowerCase().includes(query.toLowerCase()));

const BuilderTab = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [selectedGender, setSelectedGender] = useState("masculine");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedVerbId, setSelectedVerbId] = useState(null);
  const [selectedTense, setSelectedTense] = useState("present");
  const [selectedComplementId, setSelectedComplementId] = useState(null);

  const trimmedQuery = searchQuery.trim();

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

  const acceptedComplementKinds = useMemo(
    () => (selectedVerbId ? (verbComplementKinds[selectedVerbId] ?? []) : []),
    [selectedVerbId],
  );

  const filteredComplements = useMemo(
    () =>
      complements
        .filter(({ kind }) => acceptedComplementKinds.includes(kind))
        .filter(({ ukrainian, english, transliteration }) =>
          matchesQuery({
            query: trimmedQuery,
            haystack: [ukrainian, english, transliteration],
          }),
        ),
    [acceptedComplementKinds, trimmedQuery],
  );

  const matchingPresets = useMemo(() => {
    if (!trimmedQuery) {
      return [];
    }
    return expandedSentencePresets.filter(({ english, ukrainian }) =>
      matchesQuery({ query: trimmedQuery, haystack: [english, ukrainian] }),
    );
  }, [trimmedQuery]);

  const anyComplementMatches = useMemo(
    () =>
      trimmedQuery &&
      complements.some(({ ukrainian, english, transliteration }) =>
        matchesQuery({
          query: trimmedQuery,
          haystack: [ukrainian, english, transliteration],
        }),
      ),
    [trimmedQuery],
  );

  const applyPreset = ({ preset }) => {
    setSelectedSubjectId(preset.subjectId);
    setSelectedGender(preset.gender);
    setSelectedCategory(null);
    setSelectedVerbId(preset.verbId);
    setSelectedTense(preset.tense);
    setSelectedComplementId(preset.complementId ?? null);
  };

  const resetAll = () => {
    setSearchQuery("");
    setSelectedSubjectId(null);
    setSelectedGender("masculine");
    setSelectedCategory(null);
    setSelectedVerbId(null);
    setSelectedTense("present");
    setSelectedComplementId(null);
  };

  const selectedVerb = useMemo(
    () => verbs.find(({ id }) => id === selectedVerbId) ?? null,
    [selectedVerbId],
  );

  const selectedSubject = useMemo(
    () => subjects.find(({ id }) => id === selectedSubjectId) ?? null,
    [selectedSubjectId],
  );

  const selectedComplement = useMemo(() => {
    const candidate = complements.find(({ id }) => id === selectedComplementId);
    if (!candidate) {
      return null;
    }
    if (!acceptedComplementKinds.includes(candidate.kind)) {
      return null;
    }
    return candidate;
  }, [selectedComplementId, acceptedComplementKinds]);

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

  const ukrainianSentence = conjugatedForm
    ? `${selectedSubject.label} ${conjugatedForm}${selectedComplement ? ` ${selectedComplement.ukrainian}` : ""}`
    : null;

  const englishSentence = conjugatedForm
    ? buildEnglishSentence({
        subject: selectedSubject,
        verb: selectedVerb,
        tense: selectedTense,
        complement: selectedComplement,
      })
    : null;

  const placeholderHint = !selectedSubjectId
    ? "Start by choosing a subject"
    : !selectedVerbId
      ? "Now pick a verb"
      : null;

  return (
    <Box sx={{ p: 2 }}>
      <Typography
        variant="h6"
        sx={{ mb: 2, fontWeight: 700, color: "primary.main" }}
      >
        Sentence
      </Typography>

      <TextField
        fullWidth
        size="small"
        placeholder="Type in English to search (e.g. coffee, home, to want)"
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

      {!trimmedQuery && !selectedSubjectId && !selectedVerbId && (
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
            Starter Sentences
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, pb: 0.5 }}>
            {starterSentencePresets.map((preset) => (
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
            <Chip
              icon={<ShuffleIcon sx={{ color: "white !important" }} />}
              label="Random"
              onClick={() => {
                const randomPreset =
                  expandedSentencePresets[
                    Math.floor(Math.random() * expandedSentencePresets.length)
                  ];
                applyPreset({ preset: randomPreset });
              }}
              variant="filled"
              sx={{
                fontWeight: 600,
                color: "white",
                backgroundColor: "secondary.main",
                "& .MuiChip-label": { color: "text.primary" },
                "&:hover": { backgroundColor: "secondary.dark" },
              }}
            />
          </Box>
        </Box>
      )}

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
            Quick Sentences ({matchingPresets.length})
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
        filteredVerbs.length === 0 &&
        !anyComplementMatches && (
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
              Try: coffee, eat, home, want, buy, ice cream, music, friend
            </Typography>
          </Box>
        )}

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

        <ChipSelector
          label={`Object / Place / Adverb (optional)${trimmedQuery ? ` (${filteredComplements.length} match)` : ""}`}
          items={[
            { id: null, label: "— none —" },
            ...filteredComplements.map(({ id, ukrainian, english }) => ({
              id,
              label: `${ukrainian} (${english})`,
            })),
          ]}
          selectedId={selectedComplementId}
          onSelect={(id) => setSelectedComplementId(id)}
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

      {ukrainianSentence && (
        <>
          <ResultCard
            ukrainianText={ukrainianSentence}
            englishText={englishSentence}
          />
          <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
            <Chip
              label="Start over"
              onClick={resetAll}
              variant="outlined"
              size="small"
            />
            <Chip
              icon={<ShuffleIcon fontSize="small" />}
              label="Try another"
              onClick={() => {
                const randomPreset =
                  expandedSentencePresets[
                    Math.floor(Math.random() * expandedSentencePresets.length)
                  ];
                applyPreset({ preset: randomPreset });
              }}
              variant="outlined"
              size="small"
            />
          </Box>
        </>
      )}

      <Collapse in={selectedVerb !== null}>
        {selectedVerb && (
          <ConjugationTable
            verb={selectedVerb}
            activeSubjectId={selectedSubjectId}
            activeTenseId={selectedTense}
            activeGender={effectiveGender}
          />
        )}
      </Collapse>
    </Box>
  );
};

export default BuilderTab;
