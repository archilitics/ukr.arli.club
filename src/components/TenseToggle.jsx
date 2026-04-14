import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import tenses from "../constants/tenses.js";

const TenseToggle = ({ selectedTense, onTenseChange }) => (
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
      Tense
    </Typography>
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
