import { useState } from "react";
import Box from "@mui/material/Box";
import AppShell from "./components/AppShell.jsx";
import BuilderTab from "./components/builder/BuilderTab.jsx";
import QuestionsTab from "./components/questions/QuestionsTab.jsx";
import ReferenceTab from "./components/reference/ReferenceTab.jsx";

const App = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Box sx={{ pb: "72px", minHeight: "100dvh", userSelect: "none" }}>
      {activeTab === 0 && <BuilderTab />}
      {activeTab === 1 && <QuestionsTab />}
      {activeTab === 2 && <ReferenceTab />}
      <AppShell activeTab={activeTab} setActiveTab={setActiveTab} />
    </Box>
  );
};

export default App;
