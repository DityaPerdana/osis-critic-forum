import { Suspense, lazy } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import LoadingPage from "./components/loading/LoadingPage";

const Home = lazy(() => import("./components/home"));
const LandingPage = lazy(() => import("./components/landing/LandingPage"));
const AboutPage = lazy(() => import("./components/about/AboutPage"));
const EkstrakurikulerPage = lazy(
  () => import("./components/ekstrakurikuler/EkstrakurikulerPage"),
);
const NotFoundPage = lazy(() => import("./components/error/NotFoundPage"));
const DashboardPage = lazy(
  () => import("./components/dashboard/DashboardPage"),
);

function App() {
  return (
      <Suspense fallback={<LoadingPage />}>
        <div>

        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/ekstrakurikuler" element={<EkstrakurikulerPage />} />
          <Route path="/forum" element={<Home />} />
          <Route path="/forum/" element={<Home />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          {/* Add this before the catchall route */}
          {import.meta.env.VITE_TEMPO === "true" && (
            <Route path="/tempobook/*" />
          )}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </Suspense>
  );
}

export default App;
