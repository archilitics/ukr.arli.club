import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Fade from "@mui/material/Fade";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SpeakerButton from "./SpeakerButton.jsx";
import subjects from "../constants/subjects.js";
import tenses from "../constants/tenses.js";

const getCellValue = ({ verb, subjectId, tenseId, gender }) => {
  const tenseConjugations = verb.conjugations[tenseId];
  if (!tenseConjugations) {
    return "\u2014";
  }
  if (tenseId === "past") {
    const genderSuffix = gender === "feminine" ? "fem" : "masc";
    const pastKey = `${subjectId}_${genderSuffix}`;
    return (
      tenseConjugations[pastKey] ?? tenseConjugations[subjectId] ?? "\u2014"
    );
  }
  return tenseConjugations[subjectId] ?? "\u2014";
};

const getSubjectGender = ({ subjectId, activeGender }) => {
  const subject = subjects.find(({ id }) => id === subjectId);
  if (["ya", "ty"].includes(subjectId)) {
    return activeGender;
  }
  return subject?.gender ?? "masculine";
};

const ConjugationTable = ({
  verb,
  activeSubjectId,
  activeTenseId,
  activeGender,
}) => (
  <Fade in>
    <Box sx={{ mt: 2 }}>
      <Accordion defaultExpanded={false} variant="outlined" disableGutters>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {verb.infinitive} {"\u2014"} {verb.english}
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          <TableContainer sx={{ overflowX: "auto" }}>
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
                {subjects.map(({ id: subjectId, label: subjectLabel }) => {
                  const subjectGender = getSubjectGender({
                    subjectId,
                    activeGender,
                  });
                  return (
                    <TableRow
                      key={subjectId}
                      sx={{
                        bgcolor:
                          subjectId === activeSubjectId
                            ? "action.selected"
                            : "transparent",
                      }}
                    >
                      <TableCell sx={{ fontWeight: 600 }}>
                        {subjectLabel}
                      </TableCell>
                      {tenses.map(({ id: tenseId }) => {
                        const cellValue = getCellValue({
                          verb,
                          subjectId,
                          tenseId,
                          gender: subjectGender,
                        });
                        const isActiveCell =
                          subjectId === activeSubjectId &&
                          tenseId === activeTenseId;
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
                              {isActiveCell && cellValue !== "\u2014" && (
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
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </AccordionDetails>
      </Accordion>
    </Box>
  </Fade>
);

export default ConjugationTable;
