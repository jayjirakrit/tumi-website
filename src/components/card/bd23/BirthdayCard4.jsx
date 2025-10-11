import React from "react";
import styles from "./css/BirthdayCard4.module.css";

const BirthDay4th = () => {
  return (
    <div className={styles.birthdayContainer}>
      <div className={styles.birthdayCard}>
        <div className={styles.cardFront}>
          <h3 className={styles.happy}>
            HAPPY BIRTHDAY
            <br />
            HAPPY ANNIVERSARY
          </h3>
          <div className={styles.balloons}>
            <div className={styles.balloon1}></div>
            <div className={styles.balloon2}></div>
            <div className={styles.balloon3}></div>
            <div className={styles.balloon4}></div>
            <div className={styles.balloon5}></div>
          </div>
        </div>
        <div className={styles.cardInside}>
          <h3 className={styles.back}>
            HAPPY BIRTHDAY
            <br />
            HAPPY ANNIVERSARY
          </h3>
          <p>Dear King Bu, </p>
          <p>
            Happy Birthday and Happy our 4th Anniersary!! Always excited and
            nervous everytime to celebrate with you. It been another year that
            we have overcame a lots of important thing together which for sure
            it's our tough year. However, we just made it, and I just think that
            I'm so lucky that I met you and having you stay by myside. Love you
            so much Bu Bu, you are the only one, my good kid.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BirthDay4th;