import React from "react";
import Navbar from "../ui/Navbar";
import "./About.css";
import Footer from "../ui/Footer";
import JimBg from "../../img/Cinnamoroll_bg.png";
import MonBg from "../../img/FMCG_BG.jpg";
import JimImg from "../../img/jim1.jpg";
import MonImg from "../../img/mon1.jpg";

const AboutPage = () => {
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
        class="bam-section d-flex flex-column justify-content-center align-items-center"
        style={jimBg}
      >
        <div class="d-flex justify-content-center align-items-center">
          <div class="box-container m-5">
            <h1 class="d-flex fw-bold mb-6">Tumi</h1>
            <p1 class="d-flex text-start fs-5">
              Love snack, tiktok, cold weather, <br />
              watch netflix, traveling , play with jimmy
            </p1>
          </div>

          <div class="box-container m-5">
            <img
              src={MonImg}
              class="mon-img personal-img ml-5 rounded"
              alt="Mon"
            />
          </div>
        </div>
      </div>
      
      {/* Jimmy Section */}
      <div
        class="jimmy-section d-flex flex-column justify-content-center align-items-center"
        style={monBg}
      >
        <div class="d-flex justify-content-center align-items-center">
          <div class="box-container m-5">
            <h1 class="d-flex fw-bold mb-6">Jimmy</h1>
            <p1 class="d-flex text-start fs-5">
              Love dairy product, computer programming, board game, <br />
              table tennis, read a book, play with tumi
            </p1>
          </div>

          <div class="box-container m-5">
            <img
              src={JimImg}
              class="jim-img personal-img ml-5 rounded"
              alt="Jim"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
