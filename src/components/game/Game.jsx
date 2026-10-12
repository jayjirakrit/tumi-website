import { useRef, useState, useEffect, use } from "react";
import Navbar from "../ui/Navbar";
import "./Game.css";
import GameGuides from "./GameGuides";

const GamePage = () => {
  const canvasRef = useRef(null);
  const [color, setColor] = useState("#015CAC");
  const [width, setWidth] = useState(5);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // TBD with window resize event listener to make canvas responsive
  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = document.querySelector(".game-board-inner");
    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;
    const ctx = canvas.getContext("2d");
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.lineCap = "round";
    let isPainting = false;

    // Get mouse coordinates relative to the canvas deduct from viewport coordinated
    // eg. current mouse position is (100, 100) and canvas is positioned at (50, 50) in the viewport -> left 50 and top 50 from viewport screen
    // the coordinates relative to the canvas would be (50, 50) since canvas always start at (0, 0) in its own coordinate system
    const getCanvasCoordinates = (e) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    canvas.addEventListener("mousedown", (e) => {
      isPainting = true;
      ctx.beginPath();
      const { x, y } = getCanvasCoordinates(e);
      ctx.moveTo(x, y);
    });

    canvas.addEventListener("mouseup", (e) => {
      isPainting = false;
      ctx.beginPath();
    });

    canvas.addEventListener("mousemove", (e) => {
      if (!isPainting) return;
      const { x, y } = getCanvasCoordinates(e);
      ctx.lineTo(x, y);
      ctx.stroke();
    });

    return () => {
      canvas.removeEventListener("mousedown", () => {});
      canvas.removeEventListener("mouseup", () => {});
      canvas.removeEventListener("mousemove", () => {});
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = color;
  }, [color]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.lineWidth = width;
  }, [width]);

  return (
    <div>
      <Navbar />
      <div id="game-container">
        <h1>Cinnamon Board</h1>
        <div id="tool-bar">
          <input
            className="color-picker"
            type="color"
            defaultValue={color}
            onChange={(e) => setColor(e.target.value)}
          />
          <input
            type="number"
            defaultValue={width}
            onChange={(e) => setWidth(e.target.value)}
          />
          <button className="btn btn-primary" onClick={clearCanvas}>
            Clear
          </button>
        </div>
        <div className="game-board">
          <div className="game-board-inner">
            <GameGuides />
            <canvas ref={canvasRef} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamePage;
