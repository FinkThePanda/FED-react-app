// src/App.tsx

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Importerer layout-komponenter
import Header from "./Layout/Header/Header";
import Footer from "./Layout/Footer/Footer";

// Importerer de forskellige sider (views) i applikationen
import HomePage from "./pages/HomePage/HomePage";
import ExamPage from "./pages/ExamPage/ExamPage";
import HistoryPage from "./pages/HistoryPage/HistoryPage";

// Importerer global styling
import "./App.css";

function App() {
  return (
    // Router-komponenten omslutter hele appen og muliggør client-side navigation.
    <Router>
      <div className="app-container">
        <Header />
        <main className="main-content">
          {/* Routes-komponenten definerer, hvilken komponent der skal vises for hver URL-sti. */}
          <Routes>
            {/* Standardruten '/' viser HomePage. 'element' prop'en tager JSX. */}
            <Route path="/" element={<HomePage />} />
            npm install react-router-dom
            {/* Dynamisk rute for en specifik eksamen. ':examId' er en URL-parameter. */}
            <Route path="/exam/:examId" element={<ExamPage />} />
            {/* Rute for historik-siden. */}
            <Route path="/history" element={<HistoryPage />} />
            {/* Man kunne tilføje en "catch-all" rute for 404-fejl her: */}
            {/* <Route path="*" element={<NotFoundPage />} /> */}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
