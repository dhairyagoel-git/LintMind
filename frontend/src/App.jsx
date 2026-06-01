import { Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import GithubCallback from "./pages/GithubCallback";
import History from "./pages/History";

const App = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/history" element={<History />} />
      </Route>

      <Route path="/login" element={<AuthPage />} />
      <Route path="/github/callback" element={<GithubCallback />} />
    </Routes>
  );
};

export default App;