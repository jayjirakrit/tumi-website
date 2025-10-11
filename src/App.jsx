import "./App.css";
import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NoPage from "./components/common/NoPage";

const HomePage = React.lazy(() => import("./components/home/Home"));
const JourneyPage = React.lazy(() => import("./components/journey/Journey"));
const AboutPage = React.lazy(() => import("./components/about/About"));
const MemoryPage = React.lazy(() => import("./components/memory/Memory"));

function App() {
  return (
    <div className="App">
      <BrowserRouter basename="/tumi-website">
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="journey" element={<JourneyPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="other" element={<MemoryPage />} />
            <Route path="*" element={<NoPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </div>
  );
}

export default App;
