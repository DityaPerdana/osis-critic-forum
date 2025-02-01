import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import LandingPage from "./components/landing/LandingPage";
import AboutPage from "./components/about/AboutPage";
import EkstrakurikulerPage from "./components/ekstrakurikuler/EkstrakurikulerPage";
import routes from "tempo-routes";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <div>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/ekstrakurikuler" element={<EkstrakurikulerPage />} />
          <Route path="/forum" element={<Home />} />
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </div>
    </Suspense>
  );
}

export default App;
