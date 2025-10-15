import React, { useState, useEffect, memo, useMemo } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import CinmonImg from "../../img/Cinnamoroll.png";
import "./Navbar.css";
import { Link } from "react-router-dom";

import Music from "../../audio/cinnamon_music.mp3";

function NavbarUI() {
  const [isPlaying, setIsPlaying] = useState(false);

  // Clean up effect
  useEffect(() => {
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  // Play/Pause effect
  useEffect(() => {
    if (isPlaying) {
      audio.play();
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  const audio = useMemo(() => new Audio(Music), []);
  const handleAudio = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <Navbar expand="lg" className="nav-bar-layout py-4">
      <Container>
        <Navbar.Brand href="#home">
          <img class="cinmon-img" src={CinmonImg} onClick={handleAudio} />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav" className="justify-content-center">
          <Nav className="nav-cust">
            <Nav.Link className="me-4">
              <Link to="/">
                <span className="fw-bold nav-item-cust">Home</span>
              </Link>
            </Nav.Link>
            <Nav.Link className="me-4">
              <Link to="/journey">
                <span className="fw-bold nav-item-cust">Journey</span>
              </Link>
            </Nav.Link>
            <Nav.Link className="me-4">
              <Link to="/about">
                <span className="fw-bold nav-item-cust">About</span>
              </Link>
            </Nav.Link>
            <Nav.Link className="me-4">
              <Link to="/other">
                <span className="fw-bold nav-item-cust">Other</span>
              </Link>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default memo(NavbarUI);
