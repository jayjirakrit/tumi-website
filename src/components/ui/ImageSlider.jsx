import React, { useState } from "react";
import "./ImageSlider.css";
import ArrowLeft from "../../img/about/arrow-left.png";
import ArrowRight from "../../img/about/arrow-right.png";

const ImageSlider = (props) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [direction, setDirection] = useState(true); // true for right, false for left

  const handleNext = () => {
    setDirection(true);
    setCurrentImageIndex((index) =>
      index === props.images.length - 1 ? 0 : index + 1,
    );
  };

  const handlePrev = () => {
    setDirection(false);
    setCurrentImageIndex((index) =>
      index === 0 ? props.images.length - 1 : index - 1,
    );
  };
  
  const handleIndicatorClick = (index) => {
    setDirection(currentImageIndex < index );
    setCurrentImageIndex(index);
  }

  return (
    <>
      <div className="arrow arrow-left" onClick={handlePrev}>
        <img src={ArrowLeft} alt="Left Arrow" />
      </div>
      <div className="slider-container">
        {props.images.map((image, index) => (
          <div
            key={index}
            className={`slider-item ${index === currentImageIndex ? "active" : ""} ${direction ? "slide-from-right" : "slide-from-left"}`}
          >
            <img src={image.src} alt={image.alt} />
          </div>
        ))}
      </div>
      <div className="slider-indicators">
        {props.images.map((_, index) => (
          <span
            key={index}
            className={`indicator ${index === currentImageIndex ? "active" : ""}`}
            onClick={() => handleIndicatorClick(index)}
          ></span>
        ))}
      </div>
      <div className="arrow arrow-right" onClick={handleNext}>
        <img src={ArrowRight} alt="Right Arrow" />
      </div>
    </>
  );
};

export default ImageSlider;
