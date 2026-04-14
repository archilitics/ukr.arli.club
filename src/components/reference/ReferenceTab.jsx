import { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Fade from "@mui/material/Fade";
import ChipSelector from "../ChipSelector.jsx";
import SpeakerButton from "../SpeakerButton.jsx";
import numbers from "../../data/numbers.json";
import colours from "../../data/colours.json";
import daysOfWeek from "../../data/daysOfWeek.json";
import commonPhrases from "../../data/commonPhrases.json";
import questionWords from "../../data/questionWords.json";
import foodDrink from "../../data/foodDrink.json";
import family from "../../data/family.json";
import time from "../../data/time.json";
import directions from "../../data/directions.json";
import adjectives from "../../data/adjectives.json";
import weather from "../../data/weather.json";
import months from "../../data/months.json";
import body from "../../data/body.json";

const referenceCategories = [
  { id: "phrases", label: "Common Phrases", data: commonPhrases },
  { id: "foodDrink", label: "Food & Drink", data: foodDrink },
  { id: "adjectives", label: "Adjectives", data: adjectives },
  { id: "directions", label: "Directions & Places", data: directions },
  { id: "weather", label: "Weather", data: weather },
  { id: "time", label: "Time", data: time },
  { id: "days", label: "Days of Week", data: daysOfWeek },
  { id: "months", label: "Months", data: months },
  { id: "family", label: "Family", data: family },
  { id: "body", label: "Body & Health", data: body },
  { id: "numbers", label: "Numbers", data: numbers },
  { id: "colours", label: "Colours", data: colours },
  { id: "questions", label: "Question Words", data: questionWords },
];

const ReferenceTab = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState("phrases");

  const activeCategory = referenceCategories.find(
    ({ id }) => id === selectedCategoryId,
  );

  return (
    <Box sx={{ p: 2 }}>
      <Typography
        variant="h6"
        sx={{ mb: 2, fontWeight: 700, color: "primary.main" }}
      >
        Reference
      </Typography>

      <ChipSelector
        label="Category"
        items={referenceCategories.map(({ id, label }) => ({ id, label }))}
        selectedId={selectedCategoryId}
        onSelect={setSelectedCategoryId}
      />

      <Fade in key={selectedCategoryId}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
            gap: 2,
            pb: 1,
          }}
        >
          {activeCategory?.data.map(
            ({ ukrainian, transliteration, english }, index) => (
              <Card key={index} variant="outlined">
                <CardContent sx={{ pb: "12px !important" }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      mb: 0.5,
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        color: "primary.main",
                        fontSize: "1.1rem",
                      }}
                    >
                      {ukrainian}
                    </Typography>
                    <SpeakerButton text={ukrainian} size="small" />
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "text.secondary",
                      fontStyle: "italic",
                      display: "block",
                    }}
                  >
                    {transliteration}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    {english}
                  </Typography>
                </CardContent>
              </Card>
            ),
          )}
        </Box>
      </Fade>
    </Box>
  );
};

export default ReferenceTab;
