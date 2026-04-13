import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";

const ChipSelector = ({ label, items, selectedId, onSelect }) => (
  <Box sx={{ mb: 2 }}>
    {label && (
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
        {label}
      </Typography>
    )}
    <Box
      sx={{
        display: "flex",
        gap: 1,
        overflowX: "auto",
        pb: 0.5,
        "&::-webkit-scrollbar": { display: "none" },
        scrollbarWidth: "none",
      }}
    >
      {items.map(({ id, label: chipLabel }) => (
        <Chip
          key={id}
          label={chipLabel}
          color={selectedId === id ? "primary" : "default"}
          variant={selectedId === id ? "filled" : "outlined"}
          onClick={() => onSelect(id)}
          sx={{ flexShrink: 0 }}
        />
      ))}
    </Box>
  </Box>
);

export default ChipSelector;
