import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import CinmonImg from "../../img/Cinnamoroll.png";
import "./Navbar.css";
import { Outlet, Link } from "react-router-dom";

function NavbarUI() {
  return (
    <Navbar expand="lg" className="nav-bar-layout py-4">
      <Container>
        <Navbar.Brand href="#home">
          <img class="cinmon-img" src={CinmonImg} alt="" />
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

export default NavbarUI;
