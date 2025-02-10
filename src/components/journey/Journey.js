import React from "react";
import "./Journey.css";
import Navbar from "../ui/Navbar";
import Footer from "../ui/Footer";
import Travel from "../ui/Travel";
import TokyoBg from "../../img/JP_Flag.png";
import KoreaBg from "../../img/KOR_Flag.png";
import HongkongBg from "../../img/HK_Flag.png";
import TokyoImg1 from "../../img/journey/JP_2022_1.jpeg";
import TokyoImg2 from "../../img/journey/JP_2022_2.jpeg";
import TokyoImg3 from "../../img/journey/JP_2022_3.jpeg";
import TokyoImg4 from "../../img/journey/JP_2022_4.jpeg";
import KoreaImg1 from "../../img/journey/KOR_2023_1.jpeg";
import KoreaImg2 from "../../img/journey/KOR_2023_2.jpeg";
import KoreaImg3 from "../../img/journey/KOR_2023_3.jpeg";
import KoreaImg4 from "../../img/journey/KOR_2023_4.jpeg";
import TwImg1 from "../../img/journey/TW_2024_1.jpeg";
import TwImg2 from "../../img/journey/TW_2024_2.jpeg";
import TwImg3 from "../../img/journey/TW_2024_3.jpeg";
import HkImg1 from "../../img/journey/HK_2024_1.jpeg";
import HkImg2 from "../../img/journey/HK_2024_2.jpeg";
import HkImg3 from "../../img/journey/HK_2024_3.jpeg";

const JourneyPage = () => {
  const imagesTokyo = [TokyoImg1, TokyoImg2, TokyoImg3, TokyoImg4];
  const imagesKorea = [KoreaImg1, KoreaImg2, KoreaImg3, KoreaImg4];
  const imagesTWAndHK = [TwImg1, TwImg2, TwImg3, HkImg1, HkImg2, HkImg3];

  return (
    <div>
      <Navbar />
      <h1 class="fw-bold text-center mb-5 fs-2">OUR SPECIAL MOMENTS</h1>
      {/* 2022 Section */}
      <Travel
        year="2022"
        title="We Come To Japan (Tokyo)"
        background={TokyoBg}
        images={imagesTokyo}
      />
      {/* 2023 Section */}
      <Travel
        year="2023"
        title="We Come To Korea"
        background={KoreaBg}
        images={imagesKorea}
      />
      {/* 2024 Section */}
      <Travel
        year="2024"
        title="We Come To Taiwan & HongKong"
        background={HongkongBg}
        images={imagesTWAndHK}
      />
      {/* 2025 Section */}
      <Travel
        year="2025"
        title="We Come To Japan (Osaka)"
        background={TokyoBg}
        images={imagesTokyo}
      />
    </div>
  );
};

export default JourneyPage;
