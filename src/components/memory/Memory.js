import React from "react";
import Navbar from "../ui/Navbar";
import Footer from "../ui/Footer";
import Card from "../ui/CardEvent";
import "./Memory.css";
import Modal from "../ui/ModalEvent";
import { useState } from "react";
import BdImg from "../../img/memory/cake.png";
import ValImg from "../../img/memory/hearts.png";


const card5Valen = () => {
  return (
    <div class="card-inside">
    <div class="text-one">Happy Valentine Day !!<br /></div>
    <div class="text-two">
      I'm so glad to be with you another year, still excited and heart race
      every time. Wish I could celebrate with you until we old. As always,
      Love you more than yesterday, but less than tommorow. Love you my king &#128150; &#128150;. 
    </div>
    <div class="heart"></div>
    <div class="smile"></div>
    <div class="eyes"></div>
  </div>
  );
};

const card4Valen = () => {
  return (
    <div class="cardInside">
      <h3 class="back">Happy 4th Valentine's Day!</h3>
      <p>Love You Tumi!!, My Beloved Kid</p>
      <p>
        You are my kiddy, I'm so glad this is our 4th Valentine. Let celebrate
        and be happy together until we old. Love you so much and fall in love
        with you a million times.
      </p>
    </div>
  );
};

const card4Ann = () => {
  return (
    <div class="cardInside">
      <h3 class="back">
        HAPPY BIRTHDAY
        <br />
        HAPPY ANNIVERSARY
      </h3>
      <p>Dear King Bu, </p>
      <p>
        Happy Birthday and Happy our 4th Anniersary!! Always excited and nervous
        everytime to celebrate with you. It been another year that we have
        overcame a lots of important thing together which for sure it's our
        tough year. However, we just made it, and I just think that I'm so lucky
        that I met you and having you stay by myside. Love you so much Bu Bu,
        you are the only one, my good kid.
      </p>
    </div>
  );
};

const card5Ann = () => {
  return (
    <div class="flex flex-col justify-center items-center h-96 px-6">
      <h1 class="text-4xl font-bold text-gray-900 mt-8 mb-4">
        Happy Birthday and Our 5th Anniversary!!
      </h1>
      <br />
      <h5 class="text-2xl text-gray-900 mb-4 ml-20 mr-20">
        I'm so glad that I have met you and we are still together. This is a big
        year for our as the first time having long distance , but somehow we
        will overcome it. Thank you for everything, there won't be me in this
        version without you. You really grow up and become a good kid. I wish
        this is another best year for you and us. Wish your life happy, your job
        easy, and have a good health. Let continue having precious time and
        collecting more memory together. Love you so much
        <span class="text-red-900">&#10084; &#10084;</span>, love you more than
        yesterday, but less than tomorrow.
      </h5>
    </div>
  );
};

const card6Valen = () => {
  return (
    <div class="flex flex-col justify-center items-center h-96 px-6">
      <h3 class="text-4xl font-bold text-gray-900 mt-8 mb-4">
        Happy our 6th Valentine!!
      </h3>
      <br />
      <h5 class="text-2xl text-gray-900 mb-4 ml-20 mr-20">
        I'm so glad that I have met you and we are still together. 
        Love you so much
        <span class="text-red-900">&#10084; &#10084;</span>, love you more than
        yesterday, but less than tomorrow.
      </h5>
    </div>
  );
};

const MemoryPage = () => {
  const eventDatas = [
    [
      {
        id: 1,
        cardTitle: "Valentine 2023",
        cardText: "Tumi Dek Dee",
        cardBody: card4Valen,
        cardImage: ValImg,
      },
      {
        id: 2,
        cardTitle: "Anniversary 2023",
        cardText: "Tumi Dek Dee",
        cardBody: card4Ann,
        cardImage: BdImg,
      },
      {
        id: 3,
        cardTitle: "Valentine 2024",
        cardText: "Tumi Dek Dee",
        cardBody: card5Valen,
        cardImage: ValImg,
      },
    ],
    [
      {
        id: 4,
        cardTitle: "Anniversary 2024",
        cardText: "Tumi Dek Dee",
        cardBody: card5Ann,
        cardImage: BdImg,
      },
      {
        id: 5,
        cardTitle: "Valentine 2025",
        cardText: "Tumi Dek Dee",
        cardBody: card6Valen,
        cardImage: ValImg,
      },
    ],
  ];

  const [activeCardId, setActiveCardId] = useState(null);
  const handleOpenModal = (id) => setActiveCardId(id);
  const handleCloseModal = () => setActiveCardId(null);

  return (
    <div>
      <Navbar />
      {/* Card Section */}
      <div className="memory-page">
        {/* Render All Cards */}
        {eventDatas.map((datas) => (
          <ul className="card-section justify-content-center">
            {datas.map((data) => (
              <li>
                <Card
                  title={data.cardTitle}
                  text={data.cardText}
                  image={data.cardImage}
                  onButtonClick={() => handleOpenModal(data.id)}
                />
              </li>
            ))}
          </ul>
        ))}
      </div>
      {/* Render All Modal respect to Card */}
      {eventDatas.map((datas) => (
        <>
          {datas.map((data) => (
            <Modal
              title={data.cardTitle}
              body={data.cardBody}
              show={activeCardId === data.id}
              onHide={handleCloseModal}
            />
          ))}
        </>
      ))}
      {/* <Footer /> */}
      <Footer />
    </div>
  );
};

export default MemoryPage;
