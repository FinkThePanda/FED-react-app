// src/App.tsx

import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// Importerer layout-komponenter
import Header from "./Layout/Header/Header";
import Footer from "./Layout/Footer/Footer";

// Importerer de forskellige sider (views) i applikationen
import HomePage from "./pages/HomePage/HomePage";
import ExamPage from "./pages/ExamPage/ExamPage";
import HistoryPage from "./pages/HistoryPage/HistoryPage";
import PageTransition from "./components/animations/PageTransition";

// Importerer global styling
import "./App.css";

function AppContent() {
  const location = useLocation();
  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <PageTransition>
                  <HomePage />
                </PageTransition>
              }
            />
            <Route
              path="/exam/:examId"
              element={
                <PageTransition>
                  <ExamPage />
                </PageTransition>
              }
            />
            <Route
              path="/history"
              element={
                <PageTransition>
                  <HistoryPage />
                </PageTransition>
              }
            />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    // Router-komponenten omslutter hele appen og muliggør client-side navigation.
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
