import { Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { DashboardPage } from "./pages/DashboardPage";
import { JourneyPage } from "./pages/JourneyPage";
import { TopicsPage } from "./pages/TopicsPage";
import { ChatPage } from "./pages/ChatPage";
import { CommunityPage } from "./pages/CommunityPage";
import { SupervisorDashboard } from "./pages/supervisor/SupervisorDashboard";
import { KnowledgeBasePage } from "./pages/supervisor/KnowledgeBasePage";
import { SupervisorStudentView } from "./pages/supervisor/SupervisorStudentView";
import { CompanyDashboardPage } from "./pages/CompanyDashboardPage";
import ProfilePage from "./pages/ProfilePage";

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        {/* Student Routes */}
        <Route path="/" element={<DashboardPage />} />
        <Route path="/journey" element={<JourneyPage />} />
        <Route path="/topics" element={<TopicsPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/profile" element={<ProfilePage />} />

        {/* Supervisor Routes */}
        <Route path="/supervisor" element={<SupervisorDashboard />} />
        <Route path="/supervisor/knowledge-base" element={<KnowledgeBasePage />} />
        <Route path="/supervisor/student/:studentId" element={<SupervisorStudentView />} />

        {/* Company Routes */}
        <Route path="/company" element={<CompanyDashboardPage />} />
      </Route>
    </Routes>
  );
}
