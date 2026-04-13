import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Paper from "@mui/material/Paper";
import BuildIcon from "@mui/icons-material/Construction";
import QuestionIcon from "@mui/icons-material/Help";
import BookIcon from "@mui/icons-material/MenuBook";

const AppShell = ({ activeTab, setActiveTab }) => (
  <Paper
    sx={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 1100 }}
    elevation={3}
  >
    <BottomNavigation
      value={activeTab}
      onChange={(_, newValue) => setActiveTab(newValue)}
      showLabels
    >
      <BottomNavigationAction label="Builder" icon={<BuildIcon />} />
      <BottomNavigationAction label="Questions" icon={<QuestionIcon />} />
      <BottomNavigationAction label="Reference" icon={<BookIcon />} />
    </BottomNavigation>
  </Paper>
);

export default AppShell;
