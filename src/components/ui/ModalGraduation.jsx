import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "./ModalGraduation.css";

function ModalGraduation(props) {
  return (
    <Modal show={props.show} onHide={props.handleClose} fullscreen={true} size="lg">
      <Modal.Header className="d-flex justify-content-center">
        <Modal.Title className="fw-bold">{props.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="custom-modal-content">{props.body()}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalGraduation;
