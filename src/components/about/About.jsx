import React, { useState } from "react";
import Navbar from "../ui/Navbar";
import "./About.css";
import JimBg from "../../img/Cinnamoroll_bg.png";
import MonBg from "../../img/FMCG_BG.jpg";
import JimImg from "../../img/jim1.jpg";
import MonImg from "../../img/mon1.jpg";
import ModalGraduation from "../ui/ModalGraduation";
import ImageSlider from "../ui/ImageSlider";

const AboutPage = () => {
  const [activeModalId, setActiveModalId] = useState(null);
  const handleOpenModal = (id) => setActiveModalId(id);
  const handleCloseModal = () => setActiveModalId(null);

  const jimBg = {
    backgroundImage: `linear-gradient(to bottom,  rgba(46, 115, 199, 0.634),
            rgba(88, 166, 215, 0.81)), url(${JimBg})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
  };
  const monBg = {
    backgroundImage: `url(${MonBg})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  return (
    <div>
      <Navbar />
      {/* Mon Section */}
      <div
        className="bam-section d-flex flex-column flex-md-row align-items-center"
        style={jimBg}
      >
        <div className="d-flex flex-column w-100 text-center flex-md-row justify-content-between align-items-center">
          <div className="w-100 w-md-50 m-5">
            <h1 className="text-center text-md-start fw-bold mb-6">Tumi</h1>
            <p className="text-center text-md-start d-md-flex fs-5">
              Love snack, tiktok, cold weather, watch netflix, traveling , play
              with jimmy
            </p>
          </div>

          <div className="w-100 w-md-50 m-5">
            <div className="d-flex flex-column align-items-center justify-content-between">
              <img
                src={MonImg}
                className="mon-img personal-img ml-5 rounded mb-4"
                alt="Mon"
              />
              <button
                className="btn-mon"
                onClick={() => handleOpenModal("mon")}
              >
                Mon Graduation
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Jimmy Section */}
      <div
        className="jimmy-section d-flex flex-column flex-md-row align-items-center"
        style={monBg}
      >
        <div className="d-flex flex-column w-100 text-center flex-md-row justify-content-between align-items-center">
          <div className="w-100 w-md-50 m-5">
            <h1 className="text-center text-md-start fw-bold mb-6">Jimmy</h1>
            <p className="text-center text-md-start d-md-flex fs-5">
              Love dairy product, computer programming, board game, table
              tennis, read a book, play with tumi
            </p>
          </div>

          <div className="w-100 w-md-50 m-5">
            <div className="d-flex flex-column align-items-center justify-content-between">
              <img
                src={JimImg}
                className="jim-img personal-img ml-5 mb-4 rounded"
                alt="Jim"
              />
              <button
                className="btn-mon"
                onClick={() => handleOpenModal("jim")}
              >
                Jemy Graduation
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Render all modal for achivements */}
      <ModalGraduation
        show={activeModalId === "mon"}
        onHide={handleCloseModal}
        title={"Mon Graduation"}
        body={() => (
          <div className="d-flex justify-content-center">
            <div>
              <p>
                Graduated from King College London University in 2025 with a
                Master's degree in Marketing.
              </p>
              <ImageSlider />
            </div>
          </div>
        )}
      />
      <ModalGraduation
        show={activeModalId === "jim"}
        onHide={handleCloseModal}
        title={"Jemy Graduation"}
        body={() => (
          <div className="d-flex justify-content-center">
            <div>
              <p>
                Graduated from The University of Hong Kong in 2025 with a
                Master's degree in Computer Science.
              </p>
              <ImageSlider />
            </div>
          </div>
        )}
      />
    </div>
  );
};

export default AboutPage;
