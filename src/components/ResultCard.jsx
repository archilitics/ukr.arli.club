import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grow from "@mui/material/Grow";
import SpeakerButton from "./SpeakerButton.jsx";
import transliterate from "../utils/transliterate.js";

const ResultCard = ({ ukrainianText, englishText }) => (
  <Grow in>
    <Card sx={{ mb: 2, borderLeft: 4, borderColor: "secondary.main" }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, color: "primary.main" }}
          >
            {ukrainianText}
          </Typography>
          <SpeakerButton text={ukrainianText} />
        </Box>
        <Typography
          variant="body2"
          sx={{ color: "text.secondary", fontStyle: "italic", mb: 0.5 }}
        >
          {transliterate({ text: ukrainianText })}
        </Typography>
        <Typography variant="body1">{englishText}</Typography>
      </CardContent>
    </Card>
  </Grow>
);

export default ResultCard;
