import React from "react";
import "./Travel.css";

const Travel = (props) => {
  const travelStyle = {
    backgroundImage: `linear-gradient(to bottom,  rgba(248, 244, 244, 0.634),
            rgba(248, 244, 244, 0.81)), url(${props.background})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  const renderImages = () => {
    if (props.images.length === 4) {
      return (
        <div className="d-flex flex-row justify-content-evenly">
          <div className="photo photo1">
            <img src={props.images[0]} alt="Image1" />
          </div>
          <div className="photo photo2">
            <img src={props.images[1]} alt="Image2" />
          </div>
          <div className="photo photo3">
            <img src={props.images[2]} alt="Image3" />
          </div>
          <div className="photo photo4">
            <img src={props.images[3]} alt="Image4" />
          </div>
        </div>
      );
    } else if (props.images.length === 3) {
      return (
        <div className="d-flex flex-row justify-content-evenly">
          <div className="photo photo1">
            <img src={props.images[0]} alt="Image1" />
          </div>
          <div className="photo photo2_5">
            <img src={props.images[1]} alt="Image2" />
          </div>
          <div className="photo photo4">
            <img src={props.images[2]} alt="Image3" />
          </div>
        </div>
      );
    } else {
      return (
        <>
          <div className="d-flex flex-row justify-content-evenly section-2024">
            <div className="photo photo1">
              <img src={props.images[0]} alt="Image1" />
            </div>
            <div className="photo photo2_5">
              <img src={props.images[1]} alt="Image2" />
            </div>
            <div className="photo photo4">
              <img src={props.images[2]} alt="Image3" />
            </div>
          </div>
          <div className="d-flex flex-row justify-content-evenly">
            <div className="photo photo4">
              <img src={props.images[3]} alt="Image4" />
            </div>
            <div className="photo photo2_5">
              <img src={props.images[4]} alt="Image5" />
            </div>
            <div className="photo photo1">
              <img src={props.images[5]} alt="Image6" />
            </div>
          </div>
        </>
      );
    }
  };

  return (
    <div>
      <div
        className={
          props.images.length === 6
            ? "two-three-section gallery"
            : "two-four-section gallery"
        }
        style={travelStyle}
      >
        <div className="flex flex-col pt-5">
          <h2 className="fw-bold fs-2 mb-5">In {props.year}</h2>
          <h3 className="fw-bold fs-2 mb-5 pb-5">{props.title}</h3>
          {renderImages(props)}
        </div>
      </div>
    </div>
  );
};

export default Travel;
