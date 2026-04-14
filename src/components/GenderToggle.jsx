import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grow from "@mui/material/Grow";

const GenderToggle = ({ selectedGender, onGenderChange }) => (
  <Grow in>
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
        Speaker Gender
      </Typography>
      <Typography
        variant="caption"
        sx={{
          mb: 0.5,
          display: "block",
          color: "text.disabled",
          fontSize: "0.65rem",
        }}
      >
        Affects past tense conjugation
      </Typography>
      <ToggleButtonGroup
        value={selectedGender}
        exclusive
        onChange={(_, newGender) => {
          if (newGender !== null) {
            onGenderChange(newGender);
          }
        }}
        size="small"
      >
        <ToggleButton value="masculine" sx={{ textTransform: "none", px: 2 }}>
          Masculine
        </ToggleButton>
        <ToggleButton value="feminine" sx={{ textTransform: "none", px: 2 }}>
          Feminine
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  </Grow>
);

export default GenderToggle;
