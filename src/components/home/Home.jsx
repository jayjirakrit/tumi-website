import React, { useEffect } from "react";
import Navbar from "../ui/Navbar";
import "./Home.css";
import Background from "../../img/travel.jpg";
import BamImg from "../../img/mon2.jpg";
import JimImg from "../../img/jim1.jpg";
import BamJimImg from "../../img/journey/TW_2024_2.jpeg";
import "bootstrap-icons/font/bootstrap-icons.css";

const HomePage = () => {
  // useEffect(() => {
  //   // Intersection Observer to detect when element is visible
  //   const observer = new IntersectionObserver((entries) => {
  //     entries.forEach((entry) => {
  //       if (entry.isIntersecting) {
  //         entry.target.classList.add("in-view");
  //         console.log("Visible");
  //       }
  //     });
  //   });

  //   // Observe all boardgame elements
  //   document.querySelectorAll(".boardgame").forEach((el) => {
  //     observer.observe(el);
  //   });
  // }, []);

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
        className="welcome-section d-flex justify-content-around align-items-center"
        // style={myStyle}
      >
        <div className="w-50">
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
        <div className="w-50">
          <img src="https://i.shgcdn.com/2121ec60-de9e-4d21-b11c-7eb9365ebe1f/-/format/auto/-/preview/3000x3000/-/quality/lighter/" />
        </div>
      </div>
      {/* Profile Section */}
      <div className="intro-section d-flex flex-column justify-content-center">
        <h1 className="text-4xl fw-bold mb-4 title-mon">Who's Watching?</h1>
        <ul className="intro justify-content-center mt-4">
          <li>
            <div className="intro-item d-flex flex-column mt-4 ms-5 justify-content-center">
              <img src={BamImg} className="rounded img-thumbnail" alt="Mon" />
              <span className="mt-3 fw-bold fs-4">Mon</span>
            </div>
          </li>
          <li>
            <div className="intro-item d-flex flex-column mt-4 ms-5 justify-content-center">
              <img src={JimImg} className="rounded img-thumbnail" alt="Jim" />
              <span className="mt-3 fw-bold fs-4">Jimmy</span>
            </div>
          </li>
          <li>
            <div className="intro-item d-flex flex-column mt-4 ms-5 justify-content-center">
              <img
                src={BamJimImg}
                className="rounded img-thumbnail"
                alt="Mon & Jim"
              />
              <span className="mt-3 fw-bold fs-4">Mon & Jimmy</span>
            </div>
          </li>
        </ul>
      </div>

      {/* Record Section */}
      <div className="travel-section d-flex flex-column justify-content-center px-5 record-bg">
        <h1 className="fs-1 fw-bold mb-3 title-mon">Record Counting</h1>
        <div className="d-flex justify-content-between items-center count-container mt-5 w-full text-white">
          <div className="count-box d-flex flex-column justify-content-center rounded-3">
            <h1 className="fs-2 mb-3 text-center fw-bold">Countries</h1>
            <p className="fs-3 mb-1">
              <span className="country">5</span>
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
      {/* Footer Section */}
    </div>
  );
};

export default HomePage;
