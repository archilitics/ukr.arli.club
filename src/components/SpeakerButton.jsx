import IconButton from "@mui/material/IconButton";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import useSpeech from "../hooks/useSpeech.js";

const SpeakerButton = ({ text, size = "small" }) => {
  const { speak } = useSpeech();

  return (
    <IconButton
      onClick={() => speak({ text })}
      color="primary"
      size={size}
      aria-label="Play pronunciation"
    >
      <VolumeUpIcon fontSize={size} />
    </IconButton>
  );
};

export default SpeakerButton;
