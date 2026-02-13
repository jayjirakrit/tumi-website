import React, { useRef, useEffect, useState } from "react";
import styles from "./Journey.module.css";
import Navbar from "../ui/Navbar";

const Travel = React.lazy(() => import("../ui/Travel"));

// Image imports - Vite handles these as static URLs
const IMAGES = {
  2022: {
    tokyo: [
      new URL("../../img/journey/JP_2022_1.jpeg", import.meta.url).href,
      new URL("../../img/journey/JP_2022_2.jpeg", import.meta.url).href,
      new URL("../../img/journey/JP_2022_3.jpeg", import.meta.url).href,
      new URL("../../img/journey/JP_2022_4.jpeg", import.meta.url).href,
    ],
  },
  2023: {
    korea: [
      new URL("../../img/journey/KOR_2023_1.jpeg", import.meta.url).href,
      new URL("../../img/journey/KOR_2023_2.jpeg", import.meta.url).href,
      new URL("../../img/journey/KOR_2023_3.jpeg", import.meta.url).href,
      new URL("../../img/journey/KOR_2023_4.jpeg", import.meta.url).href,
    ],
  },
  2024: {
    taiwan: [
      new URL("../../img/journey/TW_2024_1.jpeg", import.meta.url).href,
      new URL("../../img/journey/TW_2024_2.jpeg", import.meta.url).href,
      new URL("../../img/journey/TW_2024_3.jpeg", import.meta.url).href,
    ],
    hongkong: [
      new URL("../../img/journey/HK_2024_1.jpeg", import.meta.url).href,
      new URL("../../img/journey/HK_2024_2.jpeg", import.meta.url).href,
      new URL("../../img/journey/HK_2024_3.jpeg", import.meta.url).href,
    ],
  },
  2025: {
    japan: [
      new URL("../../img/journey/JP_2025_1.jpg", import.meta.url).href,
      new URL("../../img/journey/JP_2025_2.jpg", import.meta.url).href,
      new URL("../../img/journey/JP_2025_3.jpg", import.meta.url).href,
    ],
    hongkong: [
      new URL("../../img/journey/HK_2025_1.jpg", import.meta.url).href,
      new URL("../../img/journey/HK_2025_2.jpg", import.meta.url).href,
      new URL("../../img/journey/HK_2025_3.jpg", import.meta.url).href,
    ],
  },
  2026: {
    england: [
      new URL("../../img/journey/UK_2026_1.jpeg", import.meta.url).href,
      new URL("../../img/journey/UK_2026_2.jpeg", import.meta.url).href,
      new URL("../../img/journey/UK_2026_3.jpeg", import.meta.url).href,
    ],
  },
};

// Background images
const BACKGROUNDS = {
  tokyo: new URL("../../img/JP_Flag.png", import.meta.url).href,
  korea: new URL("../../img/KOR_Flag.png", import.meta.url).href,
  hongkong: new URL("../../img/HK_Flag.png", import.meta.url).href,
  england: new URL("../../img/UK_Flag.png", import.meta.url).href,
};

// Travel data configuration
const TRAVEL_DATA = [
  {
    year: "2022",
    title: "We Come To Japan (Tokyo)",
    background: BACKGROUNDS.tokyo,
    images: [...IMAGES[2022].tokyo],
  },
  {
    year: "2023",
    title: "We Come To Korea",
    background: BACKGROUNDS.korea,
    images: [...IMAGES[2023].korea],
  },
  {
    year: "2024",
    title: "We Come To Taiwan & Hong Kong",
    background: BACKGROUNDS.hongkong,
    images: [...IMAGES[2024].taiwan, ...IMAGES[2024].hongkong],
  },
  {
    year: "2025",
    title: "We Come To Japan (Osaka) & Hong Kong",
    background: BACKGROUNDS.tokyo,
    images: [...IMAGES[2025].japan, ...IMAGES[2025].hongkong],
  },
  {
    year: "2026",
    title: "We Come To England",
    background: BACKGROUNDS.england,
    images: [...IMAGES[2026].england],
  },
];

const JourneyPage = () => {
  const sectionRefs = React.useRef([]);
  const [visibilities, setVisibilities] = useState([]);

  // Initialize visibilities state
  useEffect(() => {
    setVisibilities(Array(TRAVEL_DATA.length).fill(false));
  }, []);

  // Observe travel section when visible
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = parseInt(entry.target.getAttribute("id"));
          setVisibilities((prev) => {
            const newVisibilities = [...prev];
            newVisibilities[index] = entry.isIntersecting;
            return newVisibilities;
          });
        }
      });
    });

    sectionRefs.current.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const refCallback = (element) => {
    if (element) {
      sectionRefs.current.push(element);
    }
  };

  return (
    <div>
      <Navbar />
      <h1 className="fw-bold text-center mb-4 fs-2">OUR SPECIAL MOMENTS </h1>
      <div className={styles.content}>
        {TRAVEL_DATA.map((travel, index) => (
          <div
            id={index}
            key={index}
            className={`${styles.section} ${
              visibilities[index] ? styles.visible : ""
            }`}
            ref={refCallback}
          >
            <React.Suspense key={travel.year} fallback={<div></div>}>
              <Travel
                year={travel.year}
                title={travel.title}
                background={travel.background}
                images={travel.images}
              />
            </React.Suspense>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JourneyPage;
