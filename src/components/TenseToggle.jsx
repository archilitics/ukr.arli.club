import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Box from "@mui/material/Box";
import tenses from "../constants/tenses.js";

const TenseToggle = ({ selectedTense, onTenseChange }) => (
  <Box sx={{ mb: 2 }}>
    <ToggleButtonGroup
      value={selectedTense}
      exclusive
      onChange={(_, newTense) => {
        if (newTense !== null) {
          onTenseChange(newTense);
        }
      }}
      fullWidth
      size="small"
    >
      {tenses.map(({ id, label, english }) => (
        <ToggleButton
          key={id}
          value={id}
          sx={{ textTransform: "none", flexDirection: "column", py: 0.5 }}
        >
          <span>{label}</span>
          <span style={{ fontSize: "0.65rem", opacity: 0.7 }}>{english}</span>
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  </Box>
);

export default TenseToggle;
