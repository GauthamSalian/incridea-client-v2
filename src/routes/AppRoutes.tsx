import { lazy, Suspense } from "react";
import Layout from "../components/Layout";
import { Route, Routes } from "react-router";

// Only keep HomePage eager
import HomePage from "../pages/HomePage";

const ContactPage = lazy(() => import("../pages/ContactPage"));
const AboutPage = lazy(() => import("../pages/AboutPage"));
const EventsPage = lazy(() => import("../pages/EventsPage"));
const EventDetailPage = lazy(() => import("../pages/EventDetailPage"));
const RefundPage = lazy(() => import("../pages/RefundPage"));
const GuidelinesPage = lazy(() => import("../pages/GuidelinesPage"));
const PrivacyPage = lazy(() => import("../pages/PrivacyPage"));
const RulesPage = lazy(() => import("../pages/RulesPage"));
const QuizPage = lazy(() => import("../pages/QuizPage"));
const ProfilePage = lazy(() => import("../pages/ProfilePage"));
const RegisterPage = lazy(() => import("../pages/RegisterPage"));
const AccommodationPage = lazy(() => import("../pages/AccommodationPage"));
const TechTeamPage = lazy(() => import("../pages/techteam"));
const CoreTeamPage = lazy(() => import("../pages/coreteam"));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));
const ComingSoon = lazy(() => import("../pages/ComingSoon"));

const AuthRedirect = () => {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");

  if (token) {
    localStorage.setItem("token", token);
    window.location.href = "/";
    return null;
  }

  window.location.href = `${import.meta.env.VITE_AUTH_URL}/?redirect=${
    window.location.href
  }`;
  return null;
};

const ResetRedirect = () => {
  window.location.href = `${import.meta.env.VITE_AUTH_URL}/reset-password${
    window.location.search
  }`;
  return null;
};

function AppRoutes() {
  return (
    <Suspense fallback={<div className="fixed inset-0 bg-black" />}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:slug" element={<EventDetailPage />} />
          <Route path="/refund" element={<RefundPage />} />
          <Route path="/guidelines" element={<GuidelinesPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/rules" element={<RulesPage />} />
          <Route path="/login" element={<AuthRedirect />} />
          <Route path="/reset-password" element={<ResetRedirect />} />
          <Route path="/quiz/:quizId" element={<QuizPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/accommodation" element={<AccommodationPage />} />
          <Route path="/techteam" element={<TechTeamPage />} />
          <Route path="/coreteam" element={<CoreTeamPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        <Route path="/comingsoon" element={<ComingSoon />} />
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;
