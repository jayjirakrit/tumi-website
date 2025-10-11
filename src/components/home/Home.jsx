import React from "react";
import Navbar from "../ui/Navbar";
import "./Home.css";
import Background from "../../img/travel.jpg";
import BamImg from "../../img/mon2.jpg";
import JimImg from "../../img/jim1.jpg";
import BamJimImg from "../../img/journey/TW_2024_2.jpeg";
import Footer from "../ui/Footer"

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
        class="welcome-section d-flex flex-column justify-content-center"
        style={myStyle}
      >
        <h1 class="text-4xl fw-bold mb-4">Welcome to Tumi Website</h1>
        <h1 class="text-4xl fw-bold mb-4">Where We Collect Our Memories</h1>
      </div>
      {/* Profile Section */}
      <div class="intro-section d-flex flex-column justify-content-center">
        <h1 class="text-4xl fw-bold text-secondary mb-4">Who's Watching?</h1>
        <ul class="intro justify-content-center mt-4">
          <li>
            <div class="intro-item d-flex flex-column mt-4 ms-5 justify-content-center">
              <img src={BamImg} class="rounded img-thumbnail" alt="Mon" />
              <span class="mt-3 fw-bold fs-4 text-secondary">Mon</span>
            </div>
          </li>
          <li>
            <div class="intro-item d-flex flex-column mt-4 ms-5 justify-content-center">
              <img src={JimImg} class="rounded img-thumbnail" alt="Jim" />
              <span class="mt-3 fw-bold fs-4 text-secondary">Jimmy</span>
            </div>
          </li>
          <li>
            <div class="intro-item d-flex flex-column mt-4 ms-5 justify-content-center">
              <img src={BamJimImg} class="rounded img-thumbnail" alt="Mon & Jim" />
              <span class="mt-3 fw-bold fs-4 text-secondary">Mon & Jimmy</span>
            </div>
          </li>
        </ul>
      </div>

      {/* Record Section */}
      <div class="travel-section d-flex flex-column justify-content-center px-5 record-bg">
        <h1 class="fs-1 fw-bold mb-3">Record Counting</h1>
        <div class="d-flex justify-content-between items-center count-container mt-5 w-full">
          <div class="count-box d-flex flex-column justify-content-center rounded-3">
            <h1 class="fs-2 mb-3 text-danger text-center fw-bold">
              Countries
            </h1>
            <p class="fs-3 mb-1">
              <span class="country"></span>5
            </p>
          </div>
          <div class="count-box d-flex flex-column justify-content-center rounded-3">
            <h1 class="fs-2 mb-3 text-danger text-center fw-bold">
              Relationship
            </h1>
            <p class="fs-3 mb-1">
              <span class="relationship"></span>5 years
            </p>
          </div>
          <div class="count-box d-flex flex-column justify-content-center rounded-3">
            <h1 class="fs-2 mb-3 text-danger text-center fw-bold">
              Boardgame
            </h1>
            <span class="boardgame"></span>
            <p class="fs-3 mb-1">25</p>
          </div>
          <div class="count-box d-flex flex-column justify-content-center rounded-3">
            <h1 class="fs-2 mb-3 text-danger text-center fw-bold">
              Other
            </h1>
            <p class="fs-3 mb-1">...</p>
          </div>
        </div>
      </div>
      {/* Footer Section */}
    </div>
  );
};

export default HomePage;
