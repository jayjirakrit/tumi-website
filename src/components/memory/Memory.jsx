import React from "react";
import Navbar from "../ui/Navbar";
import Footer from "../ui/Footer";
import Card from "../ui/CardEvent";
import "./Memory.css";
import Modal from "../ui/ModalEvent";
import { useState } from "react";
import BdImg from "../../img/memory/cake.png";
import ValImg from "../../img/memory/hearts.png";

const BirthDay4th = React.lazy(() => import("../card/bd23/BirthdayCard4"));

const card5Valen = () => {
  return (
    <div className="card-inside">
      <div className="text-one">
        Happy Valentine Day !!
        <br />
      </div>
      <div className="typing-effect text-two">
        I'm so glad to be with you another year, still excited and heart race
        every time. Wish I could celebrate with you until we old. As always,
        Love you more than yesterday, but less than tommorow. Love you my king
        &#128150; &#128150;.
      </div>
      <div className="heart"></div>
      <div className="smile"></div>
      <div className="eyes"></div>
    </div>
  );
};

const card4Valen = () => {
  return (
    <div className="typing-effect cardInside-memory">
      <h3 className="back">Happy 4th Valentine's Day!</h3>
      <p>Love You Tumi!!, My Beloved Kid</p>
      <p>
        You are my kiddy, I'm so glad this is our 4th Valentine. Let celebrate
        and be happy together until we old. Love you so much and fall in love
        with you a million times.
      </p>
    </div>
  );
};

const card4Bd = () => {
  return <BirthDay4th />;
};

const card5Bd = () => {
  return (
    <div className="flex flex-col justify-center items-center h-96 px-6">
      <h1 className="text-4xl font-bold text-gray-900 mt-8 mb-4">
        Happy Birthday and Our 5th Anniversary!!
      </h1>
      <br />
      <h5 className="typing-effect text-2xl text-gray-900 mb-4 ml-20 mr-20">
        I'm so glad that I have met you and we are still together. This is a big
        year for our as the first time having long distance , but somehow we
        will overcome it. Thank you for everything, there won't be me in this
        version without you. You really grow up and become a good kid. I wish
        this is another best year for you and us. Wish your life happy, your job
        easy, and have a good health. Let continue having precious time and
        collecting more memory together. Love you so much
        <span className="text-red-900">&#10084; &#10084;</span>, love you more
        than yesterday, but less than tomorrow.
      </h5>
    </div>
  );
};

const card6Valen = () => {
  return (
    <div className="flex flex-col justify-center items-center h-96 px-6">
      <h3 className="text-4xl font-bold text-gray-900 mt-8 mb-4">
        Happy our 6th Valentine!!
      </h3>
      <br />
      <h5 className="typing-effect text-2xl text-gray-900 mb-4 ml-20 mr-20">
        I love you so much na, really excited to show this website to you. I
        hope you like it. I build this website to remind our good memorable and
        journey along the way. Time flies so fast and this is our 6th tim
        valentine celebration laew na. Let keep counting and celebrate na Bu.
        Staying, playing, being with you is the most fun for me. Being good kid
        duay na while I'm aboard. Love you Bu Bu
        <span className="text-red-900"> &#10084; &#10084;</span>
      </h5>
    </div>
  );
};

const card6Bd = () => {
  return (
    <div className="flex flex-col justify-center items-center h-96 px-6">
      <h3 className="text-4xl font-bold text-gray-900 mt-8 mb-4">
        Happy Birthday and Our 6th Anniversary!!
      </h3>
      <br />
      <h5 className="typing-effect text-2xl text-gray-900 mb-4 ml-20 mr-20">
        Another amazing year has been passed. We are doing very well mak loey
        with our long distance relation but still happy and lovely with each
        other. Please wait for me a little bit na. I will come meet you soon and
        often as promise na ja. Thank you for everything and being my only one.
        Again I love you so much and never get tried to baby sitting and taking
        care of you. My love is more than yesterday, but less than tommorow.
        From Jimmy, Mon's Daddy Jub Jub.
        <span className="text-red-900"> &#10084; &#10084;</span>
      </h5>
    </div>
  );
};

const card7Valen = () => {
  return (
    <div className="flex flex-col justify-center items-center h-96 px-6">
      <h3 className="text-4xl font-bold text-gray-900 mt-8 mb-4">
        Happy our 7th Valentine!!
      </h3>
      <br />
      <h5 className="typing-effect text-2xl text-gray-900 mb-4 ml-20 mr-20">
        I love you so much na, really excited to show this website to you. I
        hope you like it. I build this website to remind our good memorable and
        journey along the way. Time flies so fast and this is our 6th tim
        valentine celebration laew na. Let keep counting and celebrate na Bu.
        Staying, playing, being with you is the most fun for me. Being good kid
        duay na while I'm aboard. Love you Bu Bu
        <span className="text-red-900"> &#10084; &#10084;</span>
      </h5>
    </div>
  );
};

const MemoryPage = () => {
  const [activeCardId, setActiveCardId] = useState(null);
  const handleOpenModal = (id) => setActiveCardId(id);
  const handleCloseModal = () => setActiveCardId(null);

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
        cardBody: card4Bd,
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
        cardBody: card5Bd,
        cardImage: BdImg,
      },
      {
        id: 5,
        cardTitle: "Valentine 2025",
        cardText: "Tumi Dek Dee",
        cardBody: card6Valen,
        cardImage: ValImg,
      },
      {
        id: 6,
        cardTitle: "Anniversary 2025",
        cardText: "Tumi Dek Dee",
        cardBody: card6Bd,
        cardImage: BdImg,
      },
    ],
    [
      {
        id: 7,
        cardTitle: "Valentine 2026",
        cardText: "Tumi Dek Dee",
        cardBody: card7Valen,
        cardImage: ValImg,
      },
    ],
  ];

  return (
    <div>
      <Navbar />
      {/* Card Section */}
      <div className="memory-page">
        {/* Render All Cards */}
        {eventDatas.map((datas, outIndex) => (
          <ul
            key={outIndex}
            className="card-section d-flex justify-content-center"
          >
            {datas.map((data, index) => (
              <li key={index}>
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
          {datas.map((data, index) => (
            <Modal
              key={index}
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
