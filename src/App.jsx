import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./components/home/Home";
import JourneyPage from "./components/journey/Journey";
import AboutPage from "./components/about/About";
import NoPage from "./components/common/NoPage";
import MemoryPage from "./components/memory/Memory";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="journey" element={<JourneyPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="other" element={<MemoryPage />} />
          <Route path="*" element={<NoPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
