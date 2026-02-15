import "./App.css";
import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NoPage from "./components/common/NoPage";
import { Helmet } from "react-helmet";

const HomePage = React.lazy(() => import("./components/home/Home"));
const JourneyPage = React.lazy(() => import("./components/journey/Journey"));
const AboutPage = React.lazy(() => import("./components/about/About"));
const MemoryPage = React.lazy(() => import("./components/memory/Memory"));
const images = import.meta.glob("../../img/*.jpg", { eager: true });
const allPaths = Object.values(images).map((img) => img.default);
function App() {
  return (
    <div className="App">
      <Helmet>
        {allPaths.map((path, index) => (
          <link key={index} rel="preload" href={path} as="image" />
        ))}
      </Helmet>
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
