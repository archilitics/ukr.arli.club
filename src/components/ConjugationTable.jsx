import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Fade from "@mui/material/Fade";
import SpeakerButton from "./SpeakerButton.jsx";
import subjects from "../constants/subjects.js";
import tenses from "../constants/tenses.js";

const getCellValue = ({ verb, subjectId, tenseId }) => {
  const tenseConjugations = verb.conjugations[tenseId];
  if (!tenseConjugations) {
    return "—";
  }
  if (tenseId === "past") {
    return (
      tenseConjugations[`${subjectId}_masc`] ??
      tenseConjugations[subjectId] ??
      "—"
    );
  }
  return tenseConjugations[subjectId] ?? "—";
};

const ConjugationTable = ({ verb, activeSubjectId, activeTenseId }) => (
  <Fade in>
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
        {verb.infinitive} — {verb.english}
      </Typography>
      <TableContainer
        component={Paper}
        variant="outlined"
        sx={{ overflowX: "auto" }}
      >
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, minWidth: 60 }} />
              {tenses.map(({ id, label }) => (
                <TableCell
                  key={id}
                  align="center"
                  sx={{
                    fontWeight: 700,
                    minWidth: 90,
                    bgcolor:
                      id === activeTenseId ? "primary.main" : "transparent",
                    color: id === activeTenseId ? "white" : "inherit",
                  }}
                >
                  {label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {subjects.map(({ id: subjectId, label: subjectLabel }) => (
              <TableRow
                key={subjectId}
                sx={{
                  bgcolor:
                    subjectId === activeSubjectId
                      ? "action.selected"
                      : "transparent",
                }}
              >
                <TableCell sx={{ fontWeight: 600 }}>{subjectLabel}</TableCell>
                {tenses.map(({ id: tenseId }) => {
                  const cellValue = getCellValue({ verb, subjectId, tenseId });
                  const isActiveCell =
                    subjectId === activeSubjectId && tenseId === activeTenseId;
                  return (
                    <TableCell
                      key={tenseId}
                      align="center"
                      sx={{
                        fontWeight: isActiveCell ? 700 : 400,
                        color: isActiveCell ? "primary.main" : "inherit",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 0.5,
                        }}
                      >
                        {cellValue}
                        {isActiveCell && cellValue !== "—" && (
                          <SpeakerButton
                            text={`${subjectLabel} ${cellValue}`}
                            size="small"
                          />
                        )}
                      </Box>
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  </Fade>
);

export default ConjugationTable;
