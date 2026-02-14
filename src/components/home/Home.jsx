import React, { useEffect } from "react";
import Navbar from "../ui/Navbar";
import "./Home.css";
import BamImg from "../../img/mon2.jpg";
import JimImg from "../../img/jim1.jpg";
import BamJimImg from "../../img/journey/TW_2024_2.jpeg";
import "bootstrap-icons/font/bootstrap-icons.css";

const likeContents = [
  "She is my daughter, close friend, and lovely girl friend",
  "Cute like kid, but cool like adult",
  "Plenty of happiness & enjoyment, and little battle",
  "So glad so proud so delighted to have you in my journey",
];

const HomePage = () => {
  return (
    <div>
      <Navbar />
      {/* Welcome Section */}
      <div className="welcome-section d-flex flex-column flex-md-row justify-content-around align-items-center">
        <div className="w-100 w-md-50">
          <h1 className="fw-bolder mb-4">Tumi Cinnamoroll</h1>
          <p className="m-4 mt-0 mb-0">
            Tumi Cinnamoroll is Jimmy's official daughter. She is a good kid
            with excellent academic performance, strong discipline, and
            number-one mental integrity. She is lovely and energetic, loved and
            cared by everyone around her.
          </p>
          <div className="d-flex justify-content-center mt-5 gap-3">
            <button className="btn-mon">Cinnamoroll Tumi</button>
            <button className="btn-mon">Cinnamoroll Jimmy</button>
          </div>
        </div>
        <div className="w-100 w-md-50">
          <img
            className="w-75 w-md-100"
            src="https://i.shgcdn.com/2121ec60-de9e-4d21-b11c-7eb9365ebe1f/-/format/auto/-/preview/3000x3000/-/quality/lighter/"
          />
        </div>
      </div>
      {/* Profile Section */}
      <div className="intro-section d-flex flex-column justify-content-center">
        <h1 className="text-4xl fw-bold mb-5 mt-5 mt-md-0 title-mon">
          Who's Watching?
        </h1>
        <ul className="intro d-flex flex-column flex-md-row justify-content-evenly align-items-center">
          <li>
            <div className="intro-item d-flex flex-column justify-content-center">
              <img src={BamImg} className="rounded img-thumbnail" alt="Mon" />
              <span className="mt-md-3 fw-bold fs-4">Mon</span>
            </div>
          </li>
          <li>
            <div className="intro-item d-flex flex-column justify-content-center">
              <img src={JimImg} className="rounded img-thumbnail" alt="Jim" />
              <span className="mt-md-3 fw-bold fs-4">Jimmy</span>
            </div>
          </li>
          <li>
            <div className="intro-item d-flex flex-column justify-content-center">
              <img
                src={BamJimImg}
                className="rounded img-thumbnail"
                alt="Mon & Jim"
              />
              <span className="mt-md-3 fw-bold fs-4">Mon & Jimmy</span>
            </div>
          </li>
        </ul>
      </div>

      {/* Why Like Mon Section */}
      <div className="like-section d-flex flex-column record-bg">
        <h1 className="fs-1 fw-bold mb-5 mt-5 title-mon">Why I Like Mon</h1>
        <div className="d-flex flex-column flex-md-row justify-content-evenly align-items-center gap-5 gap-md-3 gap-lg-0 w-full text-white">
          <ul className="d-flex flex-column align-items-center gap-5 floating-box">
            {likeContents.map((content, index) => (
              <li key={index} className="like-box">
                {content}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Record Section */}
      <div className="record-section d-flex flex-column justify-content-center record-bg">
        <h1 className="fs-1 fw-bold mb-5 mt-5 mt-md-0 title-mon">
          Record Counting
        </h1>
        <div className="d-flex flex-column flex-md-row justify-content-evenly align-items-center mt-5 gap-5 gap-md-3 gap-lg-0 w-full text-white">
          <div className="count-box d-flex flex-column justify-content-center rounded-3">
            <h1 className="fs-2 mb-3 text-center fw-bold">Countries</h1>
            <p className="fs-3 mb-1">
              <span className="country">6</span>
            </p>
          </div>
          <div className="count-box d-flex flex-column justify-content-center rounded-3 ">
            <h1 className="fs-2 mb-3 text-center fw-bold">Relationship</h1>
            <p className="fs-3 mb-1">
              <span className="relationship">6 years</span>
            </p>
          </div>
          <div className="count-box d-flex flex-column justify-content-center rounded-3">
            <h1 className="fs-2 mb-3 text-center fw-bold">Boardgame</h1>
            <p className="fs-3 mb-1">
              <span className="boardgame in-view">25</span>
            </p>
          </div>
          <div className="count-box d-flex flex-column justify-content-center rounded-3">
            <h1 className="fs-2 mb-3 text-center fw-bold">Other</h1>
            <p className="fs-3 mb-1">...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
