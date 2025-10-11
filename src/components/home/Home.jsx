import React from "react";
import Navbar from "../ui/Navbar";
import "./Home.css";
import Background from "../../img/travel.jpg";
import BamImg from "../../img/mon2.jpg";
import JimImg from "../../img/jim1.jpg";
import BamJimImg from "../../img/journey/TW_2024_2.jpeg";

const HomePage = () => {
  const myStyle = {
    backgroundImage: `url(${Background})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
  };
  return (
    <div>
      <Navbar />
      {/* Welcome Section */}
      <div
        className="welcome-section d-flex flex-column justify-content-center"
        style={myStyle}
      >
        <h1 className="text-4xl fw-bold mb-4">Welcome to Tumi Website</h1>
        <h1 className="text-4xl fw-bold mb-4">Where We Collect Our Memories</h1>
      </div>
      {/* Profile Section */}
      <div className="intro-section d-flex flex-column justify-content-center">
        <h1 className="text-4xl fw-bold text-secondary mb-4">Who's Watching?</h1>
        <ul className="intro justify-content-center mt-4">
          <li>
            <div className="intro-item d-flex flex-column mt-4 ms-5 justify-content-center">
              <img src={BamImg} className="rounded img-thumbnail" alt="Mon" />
              <span className="mt-3 fw-bold fs-4 text-secondary">Mon</span>
            </div>
          </li>
          <li>
            <div className="intro-item d-flex flex-column mt-4 ms-5 justify-content-center">
              <img src={JimImg} className="rounded img-thumbnail" alt="Jim" />
              <span className="mt-3 fw-bold fs-4 text-secondary">Jimmy</span>
            </div>
          </li>
          <li>
            <div className="intro-item d-flex flex-column mt-4 ms-5 justify-content-center">
              <img src={BamJimImg} className="rounded img-thumbnail" alt="Mon & Jim" />
              <span className="mt-3 fw-bold fs-4 text-secondary">Mon & Jimmy</span>
            </div>
          </li>
        </ul>
      </div>

      {/* Record Section */}
      <div className="travel-section d-flex flex-column justify-content-center px-5 record-bg">
        <h1 className="fs-1 fw-bold mb-3">Record Counting</h1>
        <div className="d-flex justify-content-between items-center count-container mt-5 w-full">
          <div className="count-box d-flex flex-column justify-content-center rounded-3">
            <h1 className="fs-2 mb-3 text-danger text-center fw-bold">
              Countries
            </h1>
            <p className="fs-3 mb-1">
              <span className="country"></span>5
            </p>
          </div>
          <div className="count-box d-flex flex-column justify-content-center rounded-3">
            <h1 className="fs-2 mb-3 text-danger text-center fw-bold">
              Relationship
            </h1>
            <p className="fs-3 mb-1">
              <span className="relationship"></span>5 years
            </p>
          </div>
          <div className="count-box d-flex flex-column justify-content-center rounded-3">
            <h1 className="fs-2 mb-3 text-danger text-center fw-bold">
              Boardgame
            </h1>
            <span className="boardgame"></span>
            <p className="fs-3 mb-1">25</p>
          </div>
          <div className="count-box d-flex flex-column justify-content-center rounded-3">
            <h1 className="fs-2 mb-3 text-danger text-center fw-bold">
              Other
            </h1>
            <p className="fs-3 mb-1">...</p>
          </div>
        </div>
      </div>
      {/* Footer Section */}
    </div>
  );
};

export default HomePage;
