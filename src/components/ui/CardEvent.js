import React from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import "./CardEvent.css";

function CardEvent(props) {
  return (
    <Card className="c-layout">
      <Card.Body>
        <Card.Title>
          <img className="c-image" src={props.image} alt=""></img>
        </Card.Title>
        <Card.Title className="c-title">
          <span>{props.title}</span>
        </Card.Title>
        <Card.Text className="c-detail">
          <span>{props.text}</span>
        </Card.Text>
        <Button
          onClick={props.onButtonClick}
          className="c-btn"
          variant="primary"
        >
          <span>Click View !!</span>
        </Button>
      </Card.Body>
    </Card>
  );
}

export default CardEvent;
