import React, { useRef, useEffect, useState } from "react";
import styles from "./Journey.module.css";
import Navbar from "../ui/Navbar";
import { TRAVEL_DATA } from "./JourneyData";

const Travel = React.lazy(() => import("../ui/Travel"));

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
